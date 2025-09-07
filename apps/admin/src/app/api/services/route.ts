import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { 
  withErrorHandler, 
  requireAuth, 
  validateQueryParam,
  validateRequestBody,
  apiResponse,
  apiError,
  Permission
} from '@/lib/api-utils';
import { z } from 'zod';

const GetServicesQuerySchema = z.object({
  locale: z.string().optional().default('en'),
  slug: z.string().optional(),
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

  // Validate query parameters
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const slug = searchParams.get('slug');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  const whereClause: any = { locale };
  
  if (slug) {
    whereClause.slug = slug;
  }
  
  if (status) {
    whereClause.status = status;
  }
  // Fetch services with pagination
  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where: whereClause,
      include: {
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
    prisma.service.count({ where: whereClause }),
  ]);

  return NextResponse.json({
    data: services,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
});

const CreateServiceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  locale: z.enum(['en', 'de', 'fr']),
  name: z.string().min(1).max(100),
  summary: z.string().max(300).optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
  pageId: z.string().uuid().optional(),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']).default('draft'),
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.CONTENT_EDIT);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, CreateServiceSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: serviceData } = bodyResult;
  const { session } = authResult;

  // Check for slug uniqueness
  const existingService = await prisma.service.findUnique({
    where: {
      slug_locale: {
        slug: serviceData.slug,
        locale: serviceData.locale,
      },
    },
  });

  if (existingService) {
    return apiError('A service with this slug already exists for this locale', 409);
  }

  const service = await prisma.service.create({
    data: {
      slug: serviceData.slug,
      locale: serviceData.locale,
      name: serviceData.name,
      summary: serviceData.summary || undefined,
      icon: serviceData.icon || undefined,
      order: serviceData.order || undefined,
      pageId: serviceData.pageId || undefined,
      status: serviceData.status,
    },
    include: {
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

  return NextResponse.json({ data: service }, { status: 201 });
});