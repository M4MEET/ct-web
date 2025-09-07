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
const BlogPostIdSchema = z.string().min(1, 'Blog post ID is required');

const UpdateBlogPostSchema = z.object({
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
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']),
  scheduledAt: z.string().datetime().optional(),
  authorId: z.string().min(1).optional(),
  coverId: z.string().min(1).optional(),
  blocks: z.array(z.any()).optional().default([]),
});

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with CONTENT_READ permission
  const authResult = await requireAuth(request, Permission.CONTENT_READ);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, BlogPostIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: {
        id: idResult.data,
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

    if (!blogPost) {
      return apiError('Blog post not found', 404);
    }

    return NextResponse.json({ data: blogPost });
  } catch (error) {
    console.error('Database error fetching blog post:', error);
    return apiError('Failed to fetch blog post', 500);
  }
});

export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with CONTENT_EDIT permission
  const authResult = await requireAuth(request, Permission.CONTENT_EDIT);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, BlogPostIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, UpdateBlogPostSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: blogPostData } = bodyResult;

  try {
    // Check if blog post exists
    const existingBlogPost = await prisma.blogPost.findUnique({
      where: { id: idResult.data },
    });

    if (!existingBlogPost) {
      return apiError('Blog post not found', 404);
    }

    // Check if slug is unique for the locale (excluding current post)
    const slugConflict = await prisma.blogPost.findFirst({
      where: {
        slug: blogPostData.slug,
        locale: blogPostData.locale,
        id: { not: idResult.data },
      },
    });

    if (slugConflict) {
      return apiError(`A blog post with slug "${blogPostData.slug}" already exists for ${blogPostData.locale}`, 409);
    }

    // Update the blog post with blocks in a transaction
    const updatedBlogPost = await prisma.$transaction(async (tx) => {
      // Delete existing blocks
      await tx.block.deleteMany({
        where: { postId: idResult.data },
      });

      // Update blog post with new blocks
      return await tx.blogPost.update({
        where: { id: idResult.data },
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

    return NextResponse.json({ data: updatedBlogPost });
  } catch (error) {
    console.error('Database error updating blog post:', error);
    return apiError('Failed to update blog post', 500);
  }
});

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with CONTENT_DELETE permission
  const authResult = await requireAuth(request, Permission.CONTENT_DELETE);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, BlogPostIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  try {
    // Check if blog post exists
    const existingBlogPost = await prisma.blogPost.findUnique({
      where: { id: idResult.data },
    });

    if (!existingBlogPost) {
      return apiError('Blog post not found', 404);
    }

    // Delete the blog post (blocks will be deleted due to cascade)
    await prisma.blogPost.delete({
      where: { id: idResult.data },
    });

    return NextResponse.json({ 
      data: { message: 'Blog post deleted successfully' }
    });
  } catch (error) {
    console.error('Database error deleting blog post:', error);
    return apiError('Failed to delete blog post', 500);
  }
});