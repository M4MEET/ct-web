import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const slug = searchParams.get('slug');
    
    const whereClause: any = {
      locale: locale as any,
      status: 'published', // Only published pages for public API
    };
    
    if (slug) {
      whereClause.slug = slug;
    }
    
    const pages = await prisma.page.findMany({
      where: whereClause,
      include: {
        blocks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Return only published pages with safe data (no updatedBy user info)
    const publicPages = pages.map(page => ({
      id: page.id,
      slug: page.slug,
      locale: page.locale,
      title: page.title,
      seo: page.seo,
      blocks: page.blocks,
      updatedAt: page.updatedAt,
    }));

    return NextResponse.json({ data: publicPages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}