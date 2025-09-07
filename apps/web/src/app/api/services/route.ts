import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const slug = searchParams.get('slug');

    const whereClause: any = {
      locale: locale as any,
      status: 'published', // Only published services for public API
    };

    if (slug) {
      whereClause.slug = slug;
    }

    const services = await prisma.service.findMany({
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
    });

    // Return only published services with safe data
    const publicServices = services.map(service => ({
      id: service.id,
      slug: service.slug,
      locale: service.locale,
      name: service.name,
      summary: service.summary,
      icon: service.icon,
      order: service.order,
      page: service.page ? {
        id: service.page.id,
        slug: service.page.slug,
        locale: service.page.locale,
        title: service.page.title,
        seo: service.page.seo,
        blocks: service.page.blocks,
      } : null,
    }));

    return NextResponse.json({ data: publicServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}