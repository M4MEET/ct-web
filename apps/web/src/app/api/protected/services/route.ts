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

    return NextResponse.json({ 
      data: services,
      meta: {
        user: authResult.user?.email,
        permissions: authResult.permissions,
        total: services.length,
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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
    const { slug, locale, name, summary, icon, status } = body;

    if (!slug || !locale || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, locale, name' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        slug,
        locale: locale as any,
        name,
        summary,
        icon,
        status: status || 'draft',
      },
    });

    return NextResponse.json({ 
      data: service,
      meta: {
        createdBy: authResult.user?.email,
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
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
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ 
      data: service,
      meta: {
        updatedBy: authResult.user?.email,
      }
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
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
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true,
      meta: {
        deletedBy: authResult.user?.email,
      }
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}