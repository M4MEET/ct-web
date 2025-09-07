import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { sendFormSubmissionNotification } from '../../../../lib/email';

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10),
  formType: z.string(),
  metadata: z.string().optional(),
  honeypot: z.string().max(0).optional(), // Bot detection
});

// Rate limiting in-memory store (in production, use Redis)
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function getRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const limit = 5; // 5 submissions per 15 minutes

  if (!rateLimiter.has(ip)) {
    rateLimiter.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  const entry = rateLimiter.get(ip)!;
  
  if (now > entry.resetTime) {
    // Reset window
    rateLimiter.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

async function saveFile(file: File): Promise<{ filename: string; url: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Generate unique filename
  const fileExtension = file.name.split('.').pop() || '';
  const filename = `${uuidv4()}.${fileExtension}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'forms');
  const filePath = join(uploadDir, filename);
  
  // Ensure upload directory exists
  await mkdir(uploadDir, { recursive: true });
  
  // Save file
  await writeFile(filePath, buffer);
  
  return {
    filename,
    url: `/uploads/forms/${filename}`
  };
}

function validateFileType(file: File): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  return allowedTypes.includes(file.type);
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real.trim();
  }
  
  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = getRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many submissions. Please try again later.' 
        },
        { status: 429 }
      );
    }

    // Check content type
    const contentType = request.headers.get('content-type') || '';
    
    let formData: FormData;
    
    if (contentType.includes('multipart/form-data')) {
      formData = await request.formData();
    } else if (contentType.includes('application/json')) {
      // Handle JSON submission
      const jsonData = await request.json();
      formData = new FormData();
      Object.entries(jsonData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
    } else {
      // Try to parse as FormData anyway
      try {
        formData = await request.formData();
      } catch (error) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Invalid content type. Expected multipart/form-data or application/json.' 
          },
          { status: 400 }
        );
      }
    }
    
    // Extract form fields
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      company: formData.get('company') as string || undefined,
      service: formData.get('service') as string || undefined,
      budget: formData.get('budget') as string || undefined,
      timeline: formData.get('timeline') as string || undefined,
      message: formData.get('message') as string,
      formType: formData.get('formType') as string,
      metadata: formData.get('metadata') as string || undefined,
      honeypot: formData.get('honeypot') as string || undefined,
    };

    // Validate form data
    const validationResult = contactFormSchema.safeParse(data);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid form data',
          errors: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Check honeypot field (bot detection)
    if (validatedData.honeypot && validatedData.honeypot.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Submission rejected' },
        { status: 400 }
      );
    }

    // Process file attachments
    const attachmentFiles = formData.getAll('attachments') as File[];
    const attachments = [];
    
    for (const file of attachmentFiles) {
      if (file.size === 0) continue;
      
      // Validate file type
      if (!validateFileType(file)) {
        return NextResponse.json(
          { 
            success: false, 
            message: `File type not allowed: ${file.type}` 
          },
          { status: 400 }
        );
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { 
            success: false, 
            message: `File too large: ${file.name}. Maximum size is 10MB.` 
          },
          { status: 400 }
        );
      }
      
      try {
        const { filename, url } = await saveFile(file);
        attachments.push({
          filename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url,
        });
      } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
          { 
            success: false, 
            message: 'Failed to upload file' 
          },
          { status: 500 }
        );
      }
    }

    // Parse metadata
    let metadata = null;
    if (validatedData.metadata) {
      try {
        metadata = JSON.parse(validatedData.metadata);
        // Add IP address to metadata
        metadata.ip = clientIP;
      } catch (error) {
        console.error('Error parsing metadata:', error);
      }
    }

    // Save to database
    const submission = await prisma.formSubmission.create({
      data: {
        formType: validatedData.formType,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        service: validatedData.service,
        budget: validatedData.budget,
        timeline: validatedData.timeline,
        message: validatedData.message,
        metadata,
        attachments: {
          create: attachments
        }
      },
      include: {
        attachments: true
      }
    });

    // Send email notifications with complete metadata
    try {
      await sendFormSubmissionNotification({
        id: submission.id,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        service: validatedData.service,
        budget: validatedData.budget,
        timeline: validatedData.timeline,
        message: validatedData.message,
        formType: validatedData.formType,
        attachments: attachments.map(att => ({
          originalName: att.originalName,
          size: att.size,
          mimeType: att.mimeType,
        })),
        // Additional metadata
        submittedAt: new Date(),
        ipAddress: clientIP,
        userAgent: request.headers.get('user-agent') || undefined,
        referrer: request.headers.get('referer') || undefined,
        sessionId: request.headers.get('x-session-id') || metadata?.sessionId || undefined,
        locale: metadata?.locale || 'en',
      });
    } catch (emailError) {
      // Don't fail the submission if email fails
      console.error('Email notification failed:', emailError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      submissionId: submission.id.substring(0, 8).toUpperCase()
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}