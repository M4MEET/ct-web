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
const CaseStudyIdSchema = z.string().min(1, 'Case study ID is required');

const UpdateCaseStudySchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  locale: z.enum(['en', 'de', 'fr']),
  title: z.string().min(1, 'Title is required'),
  client: z.string().optional(),
  sector: z.string().optional(),
  category: z.string().optional(),
  summary: z.string().optional(),
  featuredImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  metrics: z.record(z.any()).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    noindex: z.boolean().optional(),
    canonical: z.string().url().optional(),
    ogImage: z.string().url().optional(),
  }).optional(),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']),
  scheduledAt: z.string().datetime().optional(),
  blocks: z.array(z.any()).optional().default([]),
});

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Authentication is handled by middleware for admin routes

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, CaseStudyIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  try {
    const caseStudy = await prisma.caseStudy.findUnique({
      where: {
        id: idResult.data,
      },
      include: {
        blocks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!caseStudy) {
      return apiError('Case study not found', 404);
    }

    return NextResponse.json({ data: caseStudy });
  } catch (error) {
    console.error('Database error fetching case study:', error);
    return apiError('Failed to fetch case study', 500);
  }
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
  const idResult = validatePathParam('id', id, CaseStudyIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, UpdateCaseStudySchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: caseStudyData } = bodyResult;

  try {
    // Check if case study exists
    const existingCaseStudy = await prisma.caseStudy.findUnique({
      where: { id: idResult.data },
    });

    if (!existingCaseStudy) {
      return apiError('Case study not found', 404);
    }

    // Check if slug is unique for the locale (excluding current case study)
    const slugConflict = await prisma.caseStudy.findFirst({
      where: {
        slug: caseStudyData.slug,
        locale: caseStudyData.locale,
        id: { not: idResult.data },
      },
    });

    if (slugConflict) {
      return apiError(`A case study with slug "${caseStudyData.slug}" already exists for ${caseStudyData.locale}`, 409);
    }

    // Update the case study with blocks in a transaction
    const updatedCaseStudy = await prisma.$transaction(async (tx) => {
      // Delete existing blocks
      await tx.block.deleteMany({
        where: { caseId: idResult.data },
      });

      // Update case study with new blocks
      return await tx.caseStudy.update({
        where: { id: idResult.data },
        data: {
          slug: caseStudyData.slug,
          locale: caseStudyData.locale,
          title: caseStudyData.title,
          client: caseStudyData.client || null,
          sector: caseStudyData.sector || null,
          category: caseStudyData.category || null,
          summary: caseStudyData.summary || null,
          featuredImage: caseStudyData.featuredImage || null,
          tags: caseStudyData.tags || null,
          metrics: caseStudyData.metrics || null,
          seo: caseStudyData.seo || null,
          status: caseStudyData.status,
          scheduledAt: caseStudyData.scheduledAt ? new Date(caseStudyData.scheduledAt) : null,
          blocks: {
            create: caseStudyData.blocks.map((block, index) => ({
              type: block.type,
              data: sanitizeBlockData(block),
              order: index,
            })),
          },
        },
        include: {
          blocks: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    });

    return NextResponse.json({ data: updatedCaseStudy });
  } catch (error) {
    console.error('Database error updating case study:', error);
    return apiError('Failed to update case study', 500);
  }
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
  const idResult = validatePathParam('id', id, CaseStudyIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  try {
    // Check if case study exists
    const existingCaseStudy = await prisma.caseStudy.findUnique({
      where: { id: idResult.data },
    });

    if (!existingCaseStudy) {
      return apiError('Case study not found', 404);
    }

    // Delete the case study (blocks will be deleted due to cascade)
    await prisma.caseStudy.delete({
      where: { id: idResult.data },
    });

    return NextResponse.json({ 
      data: { message: 'Case study deleted successfully' }
    });
  } catch (error) {
    console.error('Database error deleting case study:', error);
    return apiError('Failed to delete case study', 500);
  }
});