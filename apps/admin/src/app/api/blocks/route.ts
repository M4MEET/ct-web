import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { z } from 'zod';
import { 
  withErrorHandler, 
  requireAuth, 
  validateRequestBody, 
  apiResponse,
  apiError,
  Permission,
  sanitizeBlockData
} from '@/lib/api-utils';

// Validation schemas
const CreateBlockSchema = z.object({
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
  data: z.any(), // Block-specific data - would be validated by individual block schemas
  order: z.number().int().min(0).default(0),
  pageId: z.string().uuid().optional(),
  postId: z.string().uuid().optional(),
  caseId: z.string().uuid().optional(),
}).refine(
  (data) => {
    // Exactly one parent relation must be specified
    const parents = [data.pageId, data.postId, data.caseId].filter(Boolean);
    return parents.length === 1;
  },
  { message: "Block must belong to exactly one parent (pageId, postId, or caseId)" }
);

const GetBlocksQuerySchema = z.object({
  pageId: z.string().uuid().optional(),
  postId: z.string().uuid().optional(),
  caseId: z.string().uuid().optional(),
  limit: z.preprocess(
    (val) => val ? parseInt(val as string, 10) : 50,
    z.number().positive().max(100).default(50)
  ),
  offset: z.preprocess(
    (val) => val ? parseInt(val as string, 10) : 0,
    z.number().min(0).default(0)
  ),
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
  
  const queryResult = GetBlocksQuerySchema.safeParse(queryParams);
  if (!queryResult.success) {
    return apiError('Invalid query parameters', 400);
  }

  const { pageId, postId, caseId, limit, offset } = queryResult.data;

  try {
    // Build where clause - at least one parent must be specified
    const where: any = {};
    
    if (pageId) {
      where.pageId = pageId;
    } else if (postId) {
      where.postId = postId;
    } else if (caseId) {
      where.caseId = caseId;
    } else {
      return apiError('At least one parent ID must be specified (pageId, postId, or caseId)', 400);
    }

    // Get total count for pagination
    const total = await prisma.block.count({ where });

    // Get blocks with pagination
    const blocks = await prisma.block.findMany({
      where,
      orderBy: {
        order: 'asc',
      },
      skip: offset,
      take: limit,
    });

    return NextResponse.json({
      data: blocks,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Database error fetching blocks:', error);
    return apiError('Failed to fetch blocks', 500);
  }
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.CONTENT_EDIT);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, CreateBlockSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: blockData } = bodyResult;

  // Verify parent entity exists
  if (blockData.pageId) {
    const page = await prisma.page.findUnique({ where: { id: blockData.pageId } });
    if (!page) {
      return apiError('Page not found', 404);
    }
  } else if (blockData.postId) {
    const post = await prisma.blogPost.findUnique({ where: { id: blockData.postId } });
    if (!post) {
      return apiError('Blog post not found', 404);
    }
  } else if (blockData.caseId) {
    const caseStudy = await prisma.caseStudy.findUnique({ where: { id: blockData.caseId } });
    if (!caseStudy) {
      return apiError('Case study not found', 404);
    }
  }

  // Create the block
  const block = await prisma.block.create({
    data: {
      type: blockData.type,
      data: sanitizeBlockData(blockData.data),
      order: blockData.order,
      pageId: blockData.pageId || null,
      postId: blockData.postId || null,
      caseId: blockData.caseId || null,
    },
  });

  return NextResponse.json({ data: block }, { status: 201 });
});
