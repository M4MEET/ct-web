import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { z } from 'zod';

const updateSubmissionSchema = z.object({
  status: z.enum(['unread', 'read', 'inProgress', 'responded', 'archived']).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional().nullable(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      include: {
        attachments: true,
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Form submission not found' },
        { status: 404 }
      );
    }

    // Mark as read if it was unread
    if (submission.status === 'unread') {
      await prisma.formSubmission.update({
        where: { id },
        data: { status: 'read' },
      });
      submission.status = 'read';
    }

    return NextResponse.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error('Error fetching form submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch form submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validationResult = updateSubmissionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid data',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Check if submission exists
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      return NextResponse.json(
        { success: false, message: 'Form submission not found' },
        { status: 404 }
      );
    }

    // If assignedTo is provided, verify the user exists
    if (updateData.assignedTo) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: updateData.assignedTo },
      });

      if (!assignedUser) {
        return NextResponse.json(
          { success: false, message: 'Assigned user not found' },
          { status: 400 }
        );
      }
    }

    const updatedSubmission = await prisma.formSubmission.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        attachments: true,
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSubmission,
      message: 'Form submission updated successfully',
    });
  } catch (error) {
    console.error('Error updating form submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update form submission' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if submission exists
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      return NextResponse.json(
        { success: false, message: 'Form submission not found' },
        { status: 404 }
      );
    }

    // Delete submission (cascades to attachments)
    await prisma.formSubmission.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Form submission deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting form submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete form submission' },
      { status: 500 }
    );
  }
}