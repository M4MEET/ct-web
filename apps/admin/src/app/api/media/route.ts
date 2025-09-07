import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { prisma } from '@codex/database';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { 
  withErrorHandler, 
  requireAuth, 
  apiResponse,
  apiError,
  Permission
} from '@/lib/api-utils';

// MIME type validation with more specific checking
const ALLOWED_MIME_TYPES = {
  // Images
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'image/gif': 'image',
  'image/svg+xml': 'image',
  // Videos
  'video/mp4': 'video',
  'video/webm': 'video',
  'video/ogg': 'video',
  // Documents
  'application/pdf': 'document',
  'text/plain': 'document',
} as const;

// File size limits by type (in bytes)
const SIZE_LIMITS = {
  image: 5 * 1024 * 1024,      // 5MB for images
  video: 50 * 1024 * 1024,     // 50MB for videos
  document: 10 * 1024 * 1024,  // 10MB for documents
};

const MediaQuerySchema = z.object({
  page: z.preprocess(
    (val) => val ? parseInt(val as string, 10) : 1,
    z.number().positive().default(1)
  ),
  limit: z.preprocess(
    (val) => val ? parseInt(val as string, 10) : 20,
    z.number().positive().max(100).default(20)
  ),
  kind: z.enum(['image', 'video', 'document']).optional(),
});

// Simple MIME type detection from file buffer
function detectMimeType(buffer: Buffer, originalType: string): string {
  // Check file signatures (magic numbers)
  const signatures = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header for WebP
    'application/pdf': [0x25, 0x50, 0x44, 0x46],
  };

  for (const [mimeType, signature] of Object.entries(signatures)) {
    if (signature.every((byte, index) => buffer[index] === byte)) {
      return mimeType;
    }
  }

  // Fallback to original type if no signature matches
  return originalType;
}

export const GET = withErrorHandler(async (request: NextRequest) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.MEDIA_UPLOAD);
  if (!authResult.success) {
    return authResult.error;
  }

  // Parse and validate query parameters
  const { searchParams } = new URL(request.url);
  const queryParams = Object.fromEntries(searchParams.entries());
  
  const queryResult = MediaQuerySchema.safeParse(queryParams);
  if (!queryResult.success) {
    return apiError('Invalid query parameters', 400);
  }

  const { page, limit, kind } = queryResult.data;

  try {
    // Build where clause
    const where: any = {};
    if (kind) {
      where.kind = kind;
    }

    // Get total count for pagination
    const total = await prisma.mediaAsset.count({ where });

    // Get media assets with pagination
    const mediaAssets = await prisma.mediaAsset.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      data: mediaAssets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Database error fetching media assets:', error);
    return apiError('Failed to fetch media assets', 500);
  }
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.MEDIA_UPLOAD);
  if (!authResult.success) {
    return authResult.error;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const altText = formData.get('alt') as string;
    
    if (!file) {
      return apiError('No file provided', 400);
    }

    // Basic file validation
    if (!file.name || file.name.length === 0) {
      return apiError('File must have a name', 400);
    }

    if (file.size === 0) {
      return apiError('File cannot be empty', 400);
    }

    // Read file buffer for MIME detection
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Detect actual MIME type from file content
    const detectedMimeType = detectMimeType(buffer, file.type);
    
    // Validate MIME type
    if (!(detectedMimeType in ALLOWED_MIME_TYPES)) {
      return apiError(`File type not supported: ${detectedMimeType}`, 400);
    }

    const fileKind = ALLOWED_MIME_TYPES[detectedMimeType as keyof typeof ALLOWED_MIME_TYPES];
    
    // Validate file size based on type
    const maxSize = SIZE_LIMITS[fileKind];
    if (file.size > maxSize) {
      return apiError(`File size too large (max ${Math.round(maxSize / 1024 / 1024)}MB for ${fileKind}s)`, 400);
    }

    // Additional security: check for suspicious file patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];

    const fileContent = buffer.toString('utf8', 0, Math.min(1024, buffer.length)); // Check first 1KB
    if (suspiciousPatterns.some(pattern => pattern.test(fileContent))) {
      return apiError('File contains suspicious content and cannot be uploaded', 400);
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory already exists or creation failed
      console.warn('Upload directory creation warning:', err);
    }

    // Generate secure filename
    const fileId = uuidv4();
    const fileExtension = path.extname(file.name).toLowerCase();
    
    // Sanitize extension to prevent path traversal
    const sanitizedExtension = fileExtension.replace(/[^a-zA-Z0-9.]/g, '');
    const filename = `${fileId}${sanitizedExtension}`;
    const filePath = path.join(uploadDir, filename);

    // Ensure the file path is within the upload directory (prevent directory traversal)
    const resolvedFilePath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(uploadDir);
    if (!resolvedFilePath.startsWith(resolvedUploadDir)) {
      return apiError('Invalid file path', 400);
    }

    // Write file to disk
    await writeFile(resolvedFilePath, buffer);

    // Create database record
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        kind: fileKind,
        url: `/uploads/${filename}`,
        alt: altText || file.name,
        meta: {
          originalName: file.name,
          size: file.size,
          type: detectedMimeType,
          uploadedBy: authResult.session.user.id,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({ data: mediaAsset }, { status: 201 });
  } catch (error) {
    console.error('Error uploading media:', error);
    return apiError('Failed to upload media', 500);
  }
});