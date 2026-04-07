import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('/images/')
  ) {
    return NextResponse.next();
  }

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const res = await fetch(`${API_BASE_URL}/api/seo/public/redirects`, {
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const redirect = result.data.find((r: any) => r.source === pathname);
        if (redirect) {
          return NextResponse.redirect(new URL(redirect.target, request.url), 301);
        }
      }
    }
  } catch (error) {
    console.error('Middleware redirect check failed:', error);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
