import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic Auth protect /admin and /api/admin/*
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to admin paths
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  
  if (!isAdminPath) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization') || '';
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'change-me';
  const expected = Buffer.from(`${expectedUser}:${expectedPass}`).toString('base64');

  if (!authHeader.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
    });
  }

  const received = authHeader.replace('Basic ', '').trim();
  if (received !== expected) {
    return new NextResponse('Unauthorized', { 
      status: 401, 
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' } 
    });
  }

  return NextResponse.next();
}

// Be very specific with the matcher - only match admin routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};