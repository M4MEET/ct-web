import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Page as PageSchema } from '@codex/content';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    const pages = await prisma.page.findMany({
      where: {
        locale: locale as any,
      },
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
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Skip validation for now
    const pageData = {
      ...body,
      blocks: body.blocks || [],
    };

    const page = await prisma.page.create({
      data: {
        slug: pageData.slug,
        locale: pageData.locale,
        title: pageData.title,
        seo: pageData.seo || null,
        status: pageData.status,
        scheduledAt: pageData.scheduledAt ? new Date(pageData.scheduledAt) : null,
        blocks: {
          create: pageData.blocks.map((block, index) => ({
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
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}