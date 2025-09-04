import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blocks } = body;
    
    // Simply return the blocks for preview
    // In a real implementation, you might want to validate blocks here
    
    return NextResponse.json({ blocks });
  } catch (error) {
    console.error('Error processing preview:', error);
    return NextResponse.json(
      { error: 'Failed to process preview' },
      { status: 500 }
    );
  }
}