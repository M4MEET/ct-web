import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BlogPost as BlogPostSchema } from '@codex/content';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: {
        id: params.id,
      },
      include: {
        blocks: {
          orderBy: {
            order: 'asc',
          },
        },
        author: true,
        cover: true,
      },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate the blog post data
    const blogPostData = BlogPostSchema.parse({
      ...body,
      blocks: body.blocks || [],
    });

    // First, delete existing blocks
    await prisma.block.deleteMany({
      where: {
        postId: params.id,
      },
    });

    // Update the blog post with new data and blocks
    const blogPost = await prisma.blogPost.update({
      where: {
        id: params.id,
      },
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
            data: block,
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
        author: true,
        cover: true,
      },
    });

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete the blog post (blocks will be deleted due to cascade)
    await prisma.blogPost.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: 'Blog post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}