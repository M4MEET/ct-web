import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BlogPost as BlogPostSchema } from '@codex/content';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        locale: locale as any,
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
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the blog post data
    const blogPostData = BlogPostSchema.parse({
      ...body,
      blocks: body.blocks || [],
    });

    const blogPost = await prisma.blogPost.create({
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

    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}