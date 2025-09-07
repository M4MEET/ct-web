import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { z } from 'zod';
import { 
  withErrorHandler, 
  requireAuth, 
  validateRequestBody, 
  validatePathParam,
  apiResponse,
  apiError,
  Permission
} from '@/lib/api-utils';

// Validation schemas
const UserIdSchema = z.string().min(1, 'User ID is required');

const UpdateUserSchema = z.object({
  name: z.string().optional(),
  role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'AUTHOR']).optional(),
  isActive: z.boolean().optional(),
});

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with user management permission
  const authResult = await requireAuth(request, Permission.USER_MANAGE);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, UserIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  const user = await prisma.user.findUnique({
    where: { id: idResult.data },
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

  if (!user) {
    return apiError('User not found', 404);
  }

  return NextResponse.json({ data: user });
});

export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with user management permission
  const authResult = await requireAuth(request, Permission.USER_MANAGE);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, UserIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, UpdateUserSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const updateData = bodyResult.data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: idResult.data },
  });

  if (!existingUser) {
    return apiError('User not found', 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: idResult.data },
      data: updateData,
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

  return NextResponse.json({ data: updatedUser });
});

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with user management permission
  const authResult = await requireAuth(request, Permission.USER_MANAGE);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, UserIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: idResult.data },
  });

  if (!existingUser) {
    return apiError('User not found', 404);
  }

  // Soft delete by setting isActive to false instead of actually deleting
  await prisma.user.update({
    where: { id: idResult.data },
    data: { isActive: false },
  });

  return NextResponse.json({ data: { message: 'User deactivated successfully' } });
});