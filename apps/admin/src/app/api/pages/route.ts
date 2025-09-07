import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
// TODO: Replace with proper @codex/content package when it exists
import { z } from 'zod';

// Temporary local schemas until @codex/content is created
const Locales = z.enum(['en', 'de', 'fr']);
const PageSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  locale: Locales,
  title: z.string(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    noindex: z.boolean().optional(),
    canonical: z.string().url().optional(),
    ogImage: z.string().url().optional(),
  }).optional(),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']).default('draft'),
  scheduledAt: z.string().datetime().optional(),
  updatedBy: z.string().optional(),
});
import { 
  withErrorHandler, 
  requireAuth, 
  validateRequestBody, 
  validateQueryParam,
  apiResponse,
  apiError,
  Permission,
  sanitizeBlockData
} from '@/lib/api-utils';

// Input validation schemas
const CreatePageSchema = PageSchema.omit({ 
  id: true, 
  updatedBy: true 
}).extend({
  blocks: z.array(z.any()).optional().default([]),
});

const GetPagesQuerySchema = z.object({
  locale: z.string().optional().default('en'),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']).optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
});

export const GET = withErrorHandler(async (request: NextRequest) => {
  // Require authentication with content read permission
  const authResult = await requireAuth(request, Permission.CONTENT_READ);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate query parameters with proper schema
  const queryResult = validateQueryParam(request, 'locale', GetPagesQuerySchema.shape.locale);
  const statusResult = validateQueryParam(request, 'status', GetPagesQuerySchema.shape.status.optional());
  const limitResult = validateQueryParam(request, 'limit', GetPagesQuerySchema.shape.limit);
  const offsetResult = validateQueryParam(request, 'offset', GetPagesQuerySchema.shape.offset);

  // Use validated values or defaults
  const { searchParams } = new URL(request.url);
  const locale = queryResult.success ? queryResult.data : 'en';
  const status = statusResult.success ? statusResult.data : null;
  const limit = limitResult.success ? limitResult.data : 50;
  const offset = offsetResult.success ? offsetResult.data : 0;

  // Build where clause
  const where: any = { locale };
  if (status) {
    where.status = status;
  }

  // Fetch pages with proper error handling
  const [pages, total] = await Promise.all([
    prisma.page.findMany({
      where,
      include: {
        blocks: {
          orderBy: {
            order: 'asc',
          },
        },
        updatedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
      skip: offset,
    }),
    prisma.page.count({ where }),
  ]);

  return NextResponse.json({
    data: pages,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Require authentication with content edit permission
  const authResult = await requireAuth(request, Permission.CONTENT_EDIT);
  if (!authResult.success) {
    return authResult.error;
  }
  
  const { session } = authResult;

  // Validate request body
  const bodyResult = await validateRequestBody(request, CreatePageSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: pageData } = bodyResult;

  // Check for slug uniqueness
  const existingPage = await prisma.page.findUnique({
    where: {
      slug_locale: {
        slug: pageData.slug,
        locale: pageData.locale,
      },
    },
  });

  if (existingPage) {
    return apiError('A page with this slug already exists for this locale', 409);
  }

  // Create page with blocks in a transaction
  const page = await prisma.$transaction(async (tx) => {
    const newPage = await tx.page.create({
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

    // Create blocks if provided
    if (pageData.blocks && pageData.blocks.length > 0) {
      await tx.block.createMany({
        data: pageData.blocks.map((block, index) => ({
          pageId: newPage.id,
          type: block.type,
          data: sanitizeBlockData(block),
          order: index,
        })),
      });
    }

    // Return page with blocks
    return await tx.page.findUnique({
      where: { id: newPage.id },
      include: {
        blocks: {
          orderBy: {
            order: 'asc',
          },
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

  return NextResponse.json({ data: page }, { status: 201 });
});