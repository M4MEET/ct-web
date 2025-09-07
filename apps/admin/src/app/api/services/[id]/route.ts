import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { z } from 'zod';
import { 
  withErrorHandler, 
  requireAuth, 
  validateRequestBody, 
  validatePathParam,
  apiResponse,
  apiError,
  Permission
} from '@/lib/api-utils';

// Validation schemas  
const ServiceIdSchema = z.string().min(1, 'Service ID is required');

const UpdateServiceSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  locale: z.enum(['en', 'de', 'fr']),
  name: z.string().min(1, 'Name is required'),
  summary: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().optional(),
  pageId: z.string().min(1).optional(),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']),
});

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with content read permission
  const authResult = await requireAuth(request, Permission.CONTENT_READ);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, ServiceIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  try {
    const service = await prisma.service.findUnique({
      where: {
        id: idResult.data,
      },
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
    });

    if (!service) {
      return apiError('Service not found', 404);
    }

    return NextResponse.json({ data: service });
  } catch (error) {
    console.error('Database error fetching service:', error);
    return apiError('Failed to fetch service', 500);
  }
});

export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with content edit permission
  const authResult = await requireAuth(request, Permission.CONTENT_EDIT);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, ServiceIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, UpdateServiceSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: serviceData } = bodyResult;

  try {
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: idResult.data },
    });

    if (!existingService) {
      return apiError('Service not found', 404);
    }

    // Check if slug is unique for the locale (excluding current service)
    const slugConflict = await prisma.service.findFirst({
      where: {
        slug: serviceData.slug,
        locale: serviceData.locale,
        id: { not: idResult.data },
      },
    });

    if (slugConflict) {
      return apiError(`A service with slug "${serviceData.slug}" already exists for ${serviceData.locale}`, 409);
    }

    // Update the service
    const updatedService = await prisma.service.update({
      where: { id: idResult.data },
      data: {
        slug: serviceData.slug,
        locale: serviceData.locale,
        name: serviceData.name,
        summary: serviceData.summary || null,
        icon: serviceData.icon || null,
        order: serviceData.order || null,
        pageId: serviceData.pageId || null,
        status: serviceData.status,
      },
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
    });

    return NextResponse.json({ data: updatedService });
  } catch (error) {
    console.error('Database error updating service:', error);
    return apiError('Failed to update service', 500);
  }
});

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Require authentication with content delete permission
  const authResult = await requireAuth(request, Permission.CONTENT_DELETE);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate path parameters
  const { id } = await params;
  const idResult = validatePathParam('id', id, ServiceIdSchema);
  if (!idResult.success) {
    return idResult.error;
  }

  try {
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: idResult.data },
    });

    if (!existingService) {
      return apiError('Service not found', 404);
    }

    // Delete the service
    await prisma.service.delete({
      where: { id: idResult.data },
    });

    return NextResponse.json({ 
      data: { message: 'Service deleted successfully' }
    });
  } catch (error) {
    console.error('Database error deleting service:', error);
    return apiError('Failed to delete service', 500);
  }
});