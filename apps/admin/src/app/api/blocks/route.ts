import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AnyBlock } from '@codex/content';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the block data
    // Skip validation for now
    const blockData = body.data;

    const block = await prisma.block.create({
      data: {
        type: blockData.type,
        data: blockData,
        order: body.order || 0,
        pageId: body.pageId || null,
        postId: body.postId || null,
        serviceId: body.serviceId || null,
        caseId: body.caseId || null,
      },
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error('Error creating block:', error);
    return NextResponse.json(
      { error: 'Failed to create block' },
      { status: 500 }
    );
  }
}