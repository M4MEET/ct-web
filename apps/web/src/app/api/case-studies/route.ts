import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const slug = searchParams.get('slug');
    const category = searchParams.get('category'); // 'caseStudy' or 'technology'

    const whereClause: any = {
      locale: locale as any,
      status: 'published', // Only published case studies for public API
    };

    if (slug) {
      whereClause.slug = slug;
    }

    if (category) {
      whereClause.category = category;
    }

    const caseStudies = await prisma.caseStudy.findMany({
      where: whereClause,
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
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

    // Return only published case studies with safe data
    const publicCaseStudies = caseStudies.map(caseStudy => ({
      id: caseStudy.id,
      slug: caseStudy.slug,
      locale: caseStudy.locale,
      title: caseStudy.title,
      client: caseStudy.client,
      sector: caseStudy.sector,
      category: caseStudy.category,
      icon: caseStudy.icon,
      order: caseStudy.order,
      seo: caseStudy.seo,
      blocks: caseStudy.blocks,
      page: caseStudy.page ? {
        id: caseStudy.page.id,
        slug: caseStudy.page.slug,
        locale: caseStudy.page.locale,
        title: caseStudy.page.title,
        seo: caseStudy.page.seo,
        blocks: caseStudy.page.blocks,
      } : null,
    }));

    return NextResponse.json({ data: publicCaseStudies });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case studies' },
      { status: 500 }
    );
  }
}