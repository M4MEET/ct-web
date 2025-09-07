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
  Permission,
  sanitizeBlockData
} from '@/lib/api-utils';

// Validation schemas
const BlockIdSchema = z.string().min(1, 'Block ID is required');

const UpdateBlockSchema = z.object({
  type: z.enum([
    'hero',
    'featureGrid', 
    'testimonial',
    'logoCloud',
    'metrics',
    'richText',
    'faq',
    'priceTable',
    'comparison',
    'contactForm',
    'media'
  ]),
  data: z.any(), // Block-specific data
  order: z.number().int().min(0),
});

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.CONTENT_READ);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, BlockIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  const block = await prisma.block.findUnique({
    where: { id: idResult.data },
  });

  if (!block) {
    return apiError('Block not found', 404);
  }

  return NextResponse.json({ data: block });
});

export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.CONTENT_EDIT);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, BlockIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, UpdateBlockSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: blockData } = bodyResult;

  // Check if block exists
  const existingBlock = await prisma.block.findUnique({
    where: { id: idResult.data },
  });

  if (!existingBlock) {
    return apiError('Block not found', 404);
  }

  // Update the block
  const updatedBlock = await prisma.block.update({
    where: { id: idResult.data },
    data: {
      type: blockData.type,
      data: sanitizeBlockData(blockData.data),
      order: blockData.order,
    },
  });

  return NextResponse.json({ data: updatedBlock });
});

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.CONTENT_DELETE);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, BlockIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  // Check if block exists
  const existingBlock = await prisma.block.findUnique({
    where: { id: idResult.data },
  });

  if (!existingBlock) {
    return apiError('Block not found', 404);
  }

  // Delete the block
  await prisma.block.delete({
    where: { id: idResult.data },
  });

  return NextResponse.json({ data: { message: 'Block deleted successfully' } });
});
