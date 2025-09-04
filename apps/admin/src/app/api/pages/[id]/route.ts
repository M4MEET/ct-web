import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Page as PageSchema } from '@codex/content';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const page = await prisma.page.findUnique({
      where: {
        id,
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
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Skip validation for now
    const pageData = {
      ...body,
      blocks: body.blocks || [],
    };

    // First, delete existing blocks
    await prisma.block.deleteMany({
      where: {
        pageId: id,
      },
    });

    // Update the page with new data and blocks
    const page = await prisma.page.update({
      where: {
        id,
      },
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

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Delete the page (blocks will be deleted due to cascade)
    await prisma.page.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: 'Page deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}