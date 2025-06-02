import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Block all access to /api/*
  if (url.pathname.startsWith('/api/')) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  return NextResponse.next();
}

// Only apply middleware to /api routes
export const config = {
  matcher: ['/api/:path*'],
};
