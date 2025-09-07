import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';

console.log('Forms API loaded - prisma:', prisma);
console.log('Prisma formSubmission:', prisma?.formSubmission);
console.log('Prisma keys:', Object.keys(prisma || {}));
console.log('DATABASE_URL:', process.env.DATABASE_URL);

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where condition
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        include: {
          attachments: true,
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.formSubmission.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        submissions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch form submissions',
        error: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid IDs provided' },
        { status: 400 }
      );
    }

    // Delete submissions (cascades to attachments)
    await prisma.formSubmission.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${ids.length} submission(s)`,
    });
  } catch (error) {
    console.error('Error deleting form submissions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete form submissions' },
      { status: 500 }
    );
  }
}