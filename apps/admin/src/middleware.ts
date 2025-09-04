import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Temporarily disabled middleware for development
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};