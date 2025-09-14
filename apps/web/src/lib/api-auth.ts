import { NextRequest } from 'next/server';
import { prisma } from '@codex/database';

export interface ApiAuthResult {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
  permissions?: string;
  error?: string;
}

export async function validateApiKey(request: NextRequest): Promise<ApiAuthResult> {
  try {
    // Check for API key in headers
    const authHeader = request.headers.get('authorization');
    const apiKeyHeader = request.headers.get('x-api-key');
    
    let apiKey: string | null = null;
    
    // Check Authorization header (Bearer token format)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7);
    }
    // Check X-API-Key header
    else if (apiKeyHeader) {
      apiKey = apiKeyHeader;
    }
    // Check query parameter as fallback
    else {
      const url = new URL(request.url);
      apiKey = url.searchParams.get('api_key');
    }

    if (!apiKey) {
      return {
        authenticated: false,
        error: 'No API key provided',
      };
    }

    // Validate the API key in the database
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!keyRecord) {
      return {
        authenticated: false,
        error: 'Invalid API key',
      };
    }

    // Check if the key has expired
    if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
      return {
        authenticated: false,
        error: 'API key has expired',
      };
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      authenticated: true,
      user: keyRecord.user,
      permissions: keyRecord.permissions || 'read',
    };
  } catch (error) {
    console.error('Error validating API key:', error);
    return {
      authenticated: false,
      error: 'Internal server error',
    };
  }
}

// Helper function to check if user has specific permission
export function hasPermission(permissions: string, requiredPermission: string): boolean {
  if (permissions === 'admin') return true; // Admin has all permissions
  if (permissions === 'write' && requiredPermission === 'read') return true; // Write includes read
  return permissions === requiredPermission;
}