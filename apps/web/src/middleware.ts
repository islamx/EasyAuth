import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('easyauth_token');
  const { pathname } = request.nextUrl;

  const isAppRoute = pathname.startsWith('/app');
  const isAuthRoute = pathname === '/signin' || pathname === '/signup';

  if (isAppRoute && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/signin', '/signup'],
};
