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
const PageIdSchema = z.string().min(1, 'Page ID is required');

const UpdatePageSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  locale: z.enum(['en', 'de', 'fr']),
  title: z.string().min(1, 'Title is required'),
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
  // Require authentication with content read permission
  const authResult = await requireAuth(request, Permission.CONTENT_READ);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, PageIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  const page = await prisma.page.findUnique({
    where: { id: idResult.data },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
      updatedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!page) {
    return apiError('Page not found', 404);
  }

  return NextResponse.json({ data: page });
});

export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with content edit permission
  const authResult = await requireAuth(request, Permission.CONTENT_EDIT);
  if (!authResult.success) {
    return authResult.error;
  }
  
  const { session } = authResult;

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, PageIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, UpdatePageSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: pageData } = bodyResult;

  // Check if page exists
  const existingPage = await prisma.page.findUnique({
    where: { id: idResult.data },
  });

  if (!existingPage) {
    return apiError('Page not found', 404);
  }

  // Check for slug uniqueness (exclude current page)
  if (pageData.slug !== existingPage.slug || pageData.locale !== existingPage.locale) {
    const conflictingPage = await prisma.page.findUnique({
      where: {
        slug_locale: {
          slug: pageData.slug,
          locale: pageData.locale,
        },
      },
    });

    if (conflictingPage && conflictingPage.id !== idResult.data) {
      return apiError('A page with this slug already exists for this locale', 409);
    }
  }

  // Update page and blocks in a transaction
  const updatedPage = await prisma.$transaction(async (tx) => {
    // Delete existing blocks
    await tx.block.deleteMany({
      where: { pageId: idResult.data },
    });

    // Update the page
    const page = await tx.page.update({
      where: { id: idResult.data },
      data: {
        slug: pageData.slug,
        locale: pageData.locale,
        title: pageData.title,
        seo: pageData.seo || null,
        status: pageData.status,
        scheduledAt: pageData.scheduledAt ? new Date(pageData.scheduledAt) : null,
        updatedById: session.user.id,
      },
    });

    // Create new blocks if provided
    if (pageData.blocks && pageData.blocks.length > 0) {
      await tx.block.createMany({
        data: pageData.blocks.map((block, index) => ({
          pageId: page.id,
          type: block.type,
          data: sanitizeBlockData(block),
          order: index,
        })),
      });
    }

    // Return updated page with blocks
    return await tx.page.findUnique({
      where: { id: page.id },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
        updatedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  });

  return NextResponse.json({ data: updatedPage });
});

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with content delete permission
  const authResult = await requireAuth(request, Permission.CONTENT_DELETE);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, PageIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  // Check if page exists
  const existingPage = await prisma.page.findUnique({
    where: { id: idResult.data },
  });

  if (!existingPage) {
    return apiError('Page not found', 404);
  }

  // Check if the page is linked to any services or case studies
  const [linkedServices, linkedCaseStudies] = await Promise.all([
    prisma.service.findMany({
      where: { pageId: idResult.data },
      select: { id: true, name: true },
    }),
    prisma.caseStudy.findMany({
      where: { pageId: idResult.data },
      select: { id: true, title: true },
    }),
  ]);

  const linkedEntities = [
    ...linkedServices.map(s => ({ type: 'service', name: s.name })),
    ...linkedCaseStudies.map(c => ({ type: 'case study', name: c.title })),
  ];

  if (linkedEntities.length > 0) {
    return apiError(
      `Cannot delete page. It is linked to ${linkedEntities.length} item(s): ${linkedEntities.map(e => `${e.name} (${e.type})`).join(', ')}. Please unlink the page first.`,
      409
    );
  }

  // Delete the page (blocks will be deleted due to cascade)
  await prisma.page.delete({
    where: { id: idResult.data },
  });

  return NextResponse.json({ data: { message: 'Page deleted successfully' } });
});