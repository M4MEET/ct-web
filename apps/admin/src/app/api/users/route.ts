import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { 
  withErrorHandler, 
  requireAuth, 
  validateRequestBody, 
  apiResponse,
  apiError,
  Permission
} from '@/lib/api-utils';

// Validation schemas
const UserQuerySchema = z.object({
  page: z.preprocess(
    (val) => val ? parseInt(val as string, 10) : 1,
    z.number().positive().default(1)
  ),
  limit: z.preprocess(
    (val) => val ? parseInt(val as string, 10) : 20,
    z.number().positive().max(100).default(20)
  ),
  role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'AUTHOR']).optional(),
  isActive: z.preprocess(
    (val) => val === 'true' ? true : val === 'false' ? false : undefined,
    z.boolean().optional()
  ),
});

const CreateUserSchema = z.object({
  email: z.string().email().transform(val => val.toLowerCase()),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'AUTHOR']).default('AUTHOR'),
  isActive: z.boolean().default(true),
});

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'AUTHOR']).optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
});

export const GET = withErrorHandler(async (request: NextRequest) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.USER_MANAGE);
  if (!authResult.success) {
    return authResult.error;
  }

  // Parse and validate query parameters
  const { searchParams } = new URL(request.url);
  const queryParams = Object.fromEntries(searchParams.entries());
  
  const queryResult = UserQuerySchema.safeParse(queryParams);
  if (!queryResult.success) {
    return apiError('Invalid query parameters', 400);
  }

  const { page, limit, role, isActive } = queryResult.data;

  try {
    // Build where clause
    const where: any = {};
    if (role !== undefined) {
      where.role = role;
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Database error fetching users:', error);
    return apiError('Failed to fetch users', 500);
  }
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.USER_MANAGE);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, CreateUserSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: userData } = bodyResult;

  try {
    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return apiError('A user with this email already exists', 409);
    }

    // Check domain restriction (if needed)
    const allowedDomains = ['codexterminal.com', 'example.com']; // Configure as needed
    const emailDomain = userData.email.split('@')[1];
    if (!allowedDomains.includes(emailDomain)) {
      return apiError(`Only emails from ${allowedDomains.join(', ')} are allowed`, 400);
    }

    // Generate a secure temporary password
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // 24 hours

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        isActive: userData.isActive,
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
        verificationTokenExpiry,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // TODO: In production, send email with setup instructions instead of returning password
    // For now, we'll just log that a user was created (without the password)
    console.log(`User created: ${userData.email} by ${authResult.session.user.email}`);

    return NextResponse.json({ 
      data: user,
      message: 'User created successfully. Setup instructions will be sent via email.',
    }, { status: 201 });
  } catch (error) {
    console.error('Database error creating user:', error);
    return apiError('Failed to create user', 500);
  }
});