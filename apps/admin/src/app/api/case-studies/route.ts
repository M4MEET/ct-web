import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { z } from 'zod';
import { 
  withErrorHandler, 
  requireAuth, 
  validateRequestBody, 
  validateQueryParam,
  apiResponse,
  apiError,
  Permission
} from '@/lib/api-utils';

// Validation schemas
const GetCaseStudiesQuerySchema = z.object({
  locale: z.string().optional().default('en'),
  slug: z.string().optional(),
  category: z.enum(['caseStudy', 'technology']).optional(),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']).optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
});

export const GET = withErrorHandler(async (request: NextRequest) => {
  // Require authentication with CONTENT_READ permission
  const authResult = await requireAuth(request, Permission.CONTENT_READ);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate query parameters
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  const whereClause: any = { locale };
  
  if (slug) {
    whereClause.slug = slug;
  }
  
  if (category) {
    whereClause.category = category;
  }

  if (status) {
    whereClause.status = status;
  }

  // Fetch case studies with pagination
  const [caseStudies, total] = await Promise.all([
    prisma.caseStudy.findMany({
      where: whereClause,
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
        page: {
          include: {
            blocks: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
      orderBy: [
        { order: 'asc' },
        { updatedAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    }),
    prisma.caseStudy.count({ where: whereClause }),
  ]);

  return NextResponse.json({
    data: caseStudies,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
});

const CreateCaseStudySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  locale: z.enum(['en', 'de', 'fr']),
  title: z.string().min(1).max(200),
  client: z.string().optional(),
  sector: z.string().optional(),
  category: z.enum(['caseStudy', 'technology']).default('caseStudy'),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
  pageId: z.string().uuid().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    noindex: z.boolean().optional(),
    canonical: z.string().url().optional(),
    ogImage: z.string().url().optional(),
  }).optional(),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']).default('draft'),
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.CONTENT_EDIT);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, CreateCaseStudySchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: caseStudyData } = bodyResult;

  // Check for slug uniqueness
  const existingCaseStudy = await prisma.caseStudy.findUnique({
    where: {
      slug_locale: {
        slug: caseStudyData.slug,
        locale: caseStudyData.locale,
      },
    },
  });

  if (existingCaseStudy) {
    return apiError('A case study with this slug already exists for this locale', 409);
  }

  const caseStudy = await prisma.caseStudy.create({
    data: {
      slug: caseStudyData.slug,
      locale: caseStudyData.locale,
      title: caseStudyData.title,
      client: caseStudyData.client || undefined,
      sector: caseStudyData.sector || undefined,
      category: caseStudyData.category,
      icon: caseStudyData.icon || undefined,
      order: caseStudyData.order || undefined,
      pageId: caseStudyData.pageId || undefined,
      seo: caseStudyData.seo || undefined,
      status: caseStudyData.status,
    },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
      page: {
        include: {
          blocks: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ data: caseStudy }, { status: 201 });
});