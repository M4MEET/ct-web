import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AnyBlock } from '@codex/content';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const block = await prisma.block.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!block) {
      return NextResponse.json(
        { error: 'Block not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error fetching block:', error);
    return NextResponse.json(
      { error: 'Failed to fetch block' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate the block data
    // Skip validation for now
    const blockData = body.data;

    const block = await prisma.block.update({
      where: {
        id: params.id,
      },
      data: {
        type: blockData.type,
        data: blockData,
        order: body.order,
      },
    });

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error updating block:', error);
    return NextResponse.json(
      { error: 'Failed to update block' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.block.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: 'Block deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json(
      { error: 'Failed to delete block' },
      { status: 500 }
    );
  }
}