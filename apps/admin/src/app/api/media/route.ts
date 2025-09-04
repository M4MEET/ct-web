import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const mediaAssets = await prisma.mediaAsset.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(mediaAssets);
  } catch (error) {
    console.error('Error fetching media assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media assets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large (max 10MB)' },
        { status: 400 }
      );
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory already exists, continue
    }

    // Generate unique filename
    const fileId = uuidv4();
    const fileExtension = path.extname(file.name);
    const filename = `${fileId}${fileExtension}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Determine media kind
    let kind = 'file';
    if (file.type.startsWith('image/')) {
      kind = 'image';
    } else if (file.type.startsWith('video/')) {
      kind = 'video';
    }

    // Create database record
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        kind,
        url: `/uploads/${filename}`,
        alt: file.name,
        meta: {
          originalName: file.name,
          size: file.size,
          type: file.type,
        },
      },
    });

    return NextResponse.json(mediaAsset, { status: 201 });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
}