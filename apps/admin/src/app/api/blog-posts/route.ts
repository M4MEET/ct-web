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
  Permission,
  sanitizeBlockData
} from '@/lib/api-utils';

// Validation schemas
const BlogPostQuerySchema = z.object({
  locale: z.enum(['en', 'de', 'fr']).optional().default('en'),
  page: z.preprocess(
    (val) => val ? parseInt(val as string, 10) : 1,
    z.number().positive().default(1)
  ),
  limit: z.preprocess(
    (val) => val ? parseInt(val as string, 10) : 20,
    z.number().positive().max(100).default(20)
  ),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']).optional(),
});

const CreateBlogPostSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  locale: z.enum(['en', 'de', 'fr']),
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    noindex: z.boolean().optional(),
    canonical: z.string().url().optional(),
    ogImage: z.string().url().optional(),
  }).optional(),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']).default('draft'),
  scheduledAt: z.string().datetime().optional(),
  authorId: z.string().min(1).optional(),
  coverId: z.string().min(1).optional(),
  blocks: z.array(z.any()).optional().default([]),
});

export const GET = withErrorHandler(async (request: NextRequest) => {
  // Require authentication with CONTENT_READ permission
  const authResult = await requireAuth(request, Permission.CONTENT_READ);
  if (!authResult.success) {
    return authResult.error;
  }

  // Parse and validate query parameters
  const { searchParams } = new URL(request.url);
  const queryParams = Object.fromEntries(searchParams.entries());
  
  const queryResult = BlogPostQuerySchema.safeParse(queryParams);
  if (!queryResult.success) {
    return apiError('Invalid query parameters', 400);
  }

  const { locale, page, limit, status } = queryResult.data;

  try {
    // Build where clause
    const where: any = {
      locale: locale as any,
    };

    if (status) {
      where.status = status;
    }

    // Get total count for pagination
    const total = await prisma.blogPost.count({ where });

    // Get blog posts with pagination
    const blogPosts = await prisma.blogPost.findMany({
      where,
      include: {
        blocks: {
          orderBy: {
            order: 'asc',
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        cover: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      data: blogPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Database error fetching blog posts:', error);
    return apiError('Failed to fetch blog posts', 500);
  }
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.CONTENT_EDIT);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, CreateBlogPostSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: blogPostData } = bodyResult;

  try {
    // Check if slug is unique for the locale
    const existingBlogPost = await prisma.blogPost.findFirst({
      where: {
        slug: blogPostData.slug,
        locale: blogPostData.locale,
      },
    });

    if (existingBlogPost) {
      return apiError(`A blog post with slug "${blogPostData.slug}" already exists for ${blogPostData.locale}`, 409);
    }

    // Create the blog post with blocks in a transaction
    const blogPost = await prisma.$transaction(async (tx) => {
      return await tx.blogPost.create({
        data: {
          slug: blogPostData.slug,
          locale: blogPostData.locale,
          title: blogPostData.title,
          excerpt: blogPostData.excerpt || null,
          seo: blogPostData.seo || null,
          status: blogPostData.status,
          scheduledAt: blogPostData.scheduledAt ? new Date(blogPostData.scheduledAt) : null,
          authorId: blogPostData.authorId || null,
          coverId: blogPostData.coverId || null,
          blocks: {
            create: blogPostData.blocks.map((block, index) => ({
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
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          cover: true,
        },
      });
    });

    return NextResponse.json({ data: blogPost }, { status: 201 });
  } catch (error) {
    console.error('Database error creating blog post:', error);
    return apiError('Failed to create blog post', 500);
  }
});
