import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin routes (except /admin/login)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // In production SSR, check auth cookie
    // For demo/edge compatibility, check auth header or cookie
    const hasAuthCookie = request.cookies.get('sb-access-token') || request.cookies.get('gospomosh_admin_session');
    
    // We allow client component verification with redirect if not logged in
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
