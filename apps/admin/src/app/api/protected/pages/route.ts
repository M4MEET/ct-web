import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { validateApiKey, hasPermission } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    // Validate API key
    const authResult = await validateApiKey(request);
    
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!hasPermission(authResult.permissions!, 'read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const slug = searchParams.get('slug');
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    const whereClause: any = {
      locale: locale as any,
    };

    // Only include unpublished if user has write permissions
    if (!includeUnpublished || !hasPermission(authResult.permissions!, 'write')) {
      whereClause.status = 'published';
    }

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
      orderBy: [
        { updatedAt: 'desc' },
      ],
    });

    return NextResponse.json({ 
      data: pages,
      meta: {
        user: authResult.user?.email,
        permissions: authResult.permissions,
        total: pages.length,
      }
    });
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
    // Validate API key
    const authResult = await validateApiKey(request);
    
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check write permissions
    if (!hasPermission(authResult.permissions!, 'write')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { slug, locale, title, seo, status, blocks } = body;

    if (!slug || !locale || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, locale, title' },
        { status: 400 }
      );
    }

    // Check for slug uniqueness
    const existingPage = await prisma.page.findUnique({
      where: {
        slug_locale: {
          slug,
          locale: locale as any,
        },
      },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'A page with this slug already exists for this locale' },
        { status: 409 }
      );
    }

    // Create page with blocks in a transaction
    const page = await prisma.$transaction(async (tx) => {
      const newPage = await tx.page.create({
        data: {
          slug,
          locale: locale as any,
          title,
          seo: seo || null,
          status: status || 'draft',
          updatedById: authResult.user?.id,
        },
      });

      // Create blocks if provided
      if (blocks && blocks.length > 0) {
        await tx.block.createMany({
          data: blocks.map((block: any, index: number) => ({
            pageId: newPage.id,
            type: block.type,
            data: block,
            order: index,
          })),
        });
      }

      // Return page with blocks
      return await tx.page.findUnique({
        where: { id: newPage.id },
        include: {
          blocks: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    });

    return NextResponse.json({ 
      data: page,
      meta: {
        createdBy: authResult.user?.email,
      }
    });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Validate API key
    const authResult = await validateApiKey(request);
    
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check write permissions
    if (!hasPermission(authResult.permissions!, 'write')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        ...updateData,
        updatedById: authResult.user?.id,
      },
      include: {
        blocks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json({ 
      data: page,
      meta: {
        updatedBy: authResult.user?.email,
      }
    });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Validate API key
    const authResult = await validateApiKey(request);
    
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin permissions for deletion
    if (!hasPermission(authResult.permissions!, 'admin')) {
      return NextResponse.json(
        { error: 'Admin permissions required for deletion' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    // Delete page and associated blocks
    await prisma.$transaction(async (tx) => {
      // Delete blocks first
      await tx.block.deleteMany({
        where: { pageId: id },
      });
      
      // Delete page
      await tx.page.delete({
        where: { id },
      });
    });

    return NextResponse.json({ 
      success: true,
      meta: {
        deletedBy: authResult.user?.email,
      }
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}