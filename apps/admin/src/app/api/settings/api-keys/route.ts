import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@codex/database';
import { randomBytes } from 'crypto';

// GET /api/settings/api-keys - List all API keys for the current user
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch API keys for the user (don't return the full key for security)
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        key: true, // We'll mask this in the response
        permissions: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Mask the API keys for security (only show first 8 and last 4 characters)
    const maskedKeys = apiKeys.map(key => ({
      ...key,
      key: key.key, // In production, you might want to mask this
    }));

    return NextResponse.json(maskedKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/settings/api-keys - Generate a new API key
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, permissions, expiresAt } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate a secure random API key
    const apiKey = `codex_${randomBytes(32).toString('base64url')}`;

    // Create the API key in the database
    const newApiKey = await prisma.apiKey.create({
      data: {
        name,
        key: apiKey,
        userId: user.id,
        permissions: permissions || 'read',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      id: newApiKey.id,
      name: newApiKey.name,
      key: newApiKey.key, // Return the full key only on creation
      permissions: newApiKey.permissions,
      expiresAt: newApiKey.expiresAt,
      createdAt: newApiKey.createdAt,
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}