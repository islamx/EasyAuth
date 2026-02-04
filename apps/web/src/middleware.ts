import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('easyauth_token');
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/signin' || pathname === '/signup';

  // Only redirect to /app when we have the cookie (same-origin). Cross-origin (e.g. Vercel + Render)
  // stores the cookie on the API domain, so it won't be in request.cookies here; /app page will
  // call /auth/me and redirect to signin if 401.
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/signin', '/signup'],
};
