import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { notFound } from 'next/navigation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    // Only fetch published pages for public API
    const page = await prisma.page.findFirst({
      where: {
        slug,
        locale: locale as any,
        status: 'published', // Only published content
      },
      include: {
        blocks: {
          orderBy: {
            order: 'asc',
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

    return NextResponse.json({
      data: {
        id: page.id,
        slug: page.slug,
        locale: page.locale,
        title: page.title,
        seo: page.seo,
        blocks: page.blocks,
        updatedAt: page.updatedAt,
      }
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}