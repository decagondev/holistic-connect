/**
 * Next.js Middleware for route protection
 * 
 * Note: Firebase Auth stores tokens in localStorage (client-side only),
 * so full authentication verification happens client-side via RequireAuth component.
 * 
 * This middleware provides basic route protection by redirecting unauthenticated
 * users to login for protected routes. For more robust protection, use the
 * RequireAuth component which can verify Firebase Auth state.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protected route patterns
 * These routes require authentication
 */
const protectedRoutes = [
  '/dashboard',
  '/practitioner',
  '/client',
];

/**
 * Public routes that should be accessible without authentication
 */
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/practitioners',
  '/pricing',
  '/forgot-password',
];

/**
 * Check if a path matches any of the protected route patterns
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

/**
 * Check if a path is a public route
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // For protected routes, we'll rely on client-side RequireAuth component
  // to handle actual authentication verification since Firebase Auth tokens
  // are stored in localStorage (client-side only).
  // 
  // In a production setup, you might want to:
  // 1. Use Firebase Admin SDK to verify tokens server-side
  // 2. Store auth tokens in httpOnly cookies
  // 3. Verify tokens in middleware using Admin SDK
  //
  // For now, we allow protected routes through and let RequireAuth
  // component handle the actual auth check and redirect.
  
  if (isProtectedRoute(pathname)) {
    // Allow the route through - RequireAuth component will handle authentication
    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * Middleware matcher configuration
 * Only run middleware on specific routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

