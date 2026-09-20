import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect customer and provider dashboards
  if (pathname.startsWith('/dashboard')) {
    const authCookie = request.cookies.get('skillconnect_auth_token');

    // 1. Unauthenticated users redirected to /login
    if (!authCookie || !authCookie.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Decode and verify JWT payload structure and expiration
    try {
      const parts = authCookie.value.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      // Safe base64url decoding in standard Web/Edge environments
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      // Check token expiration
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < nowSeconds) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.set('skillconnect_auth_token', '', { maxAge: 0, path: '/' });
        return response;
      }

      const userRole = (payload.role || '').toUpperCase();

      // Enforce role: customer -> customer dashboard
      if (pathname.startsWith('/dashboard/customer')) {
        if (userRole !== 'CUSTOMER') {
          // If provider attempts to access customer dashboard, redirect to provider dashboard
          if (userRole === 'PROVIDER') {
            return NextResponse.redirect(new URL('/dashboard/provider', request.url));
          }
          return NextResponse.redirect(new URL('/login', request.url));
        }
      }

      // Enforce role: provider -> provider dashboard
      if (pathname.startsWith('/dashboard/provider')) {
        if (userRole !== 'PROVIDER') {
          // If customer attempts to access provider dashboard, redirect to customer dashboard
          if (userRole === 'CUSTOMER') {
            return NextResponse.redirect(new URL('/dashboard/customer', request.url));
          }
          return NextResponse.redirect(new URL('/login', request.url));
        }
      }
    } catch {
      // Malformed or tampered token: clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('skillconnect_auth_token', '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
