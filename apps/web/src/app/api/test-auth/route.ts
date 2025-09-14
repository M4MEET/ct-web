import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const authResult = await validateApiKey(request);
  
  return NextResponse.json({
    authenticated: authResult.authenticated,
    error: authResult.error,
    user: authResult.user?.email,
    permissions: authResult.permissions,
  });
}