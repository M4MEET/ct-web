import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public routes that don't require authentication
const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/api/auth',
];

// Check if a path is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes and static assets
  if (
    isPublicRoute(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|js|css|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  try {
    // Check if user has a valid session
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      // No valid session, redirect to sign in
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }

    // User is authenticated, check role-based access for admin routes
    if (pathname.startsWith('/admin')) {
      const userRole = token.role as string;
      
      // Allow access for admin roles (OWNER, ADMIN, EDITOR, AUTHOR)
      const allowedRoles = ['OWNER', 'ADMIN', 'EDITOR', 'AUTHOR'];
      
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Insufficient permissions
        return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', request.url));
      }
    }

    // Add user info to headers for API routes to use
    const response = NextResponse.next();
    response.headers.set('x-user-id', token.sub || '');
    response.headers.set('x-user-role', (token.role as string) || 'AUTHOR');
    response.headers.set('x-user-email', (token.email as string) || '');

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, redirect to sign in
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (all API routes should handle auth themselves)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};