import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip static assets and internal requests
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
    // Fetch redirect matrix from backend
    // Note: In production you should cache this in Redis or Edge Config
    const res = await fetch(`${API_BASE_URL}/api/seo/public/redirects`, {
      next: { revalidate: 300 } // Cache for 5 mins
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
    // Fail silently to prevent site crash if SEO service is down
    console.error('Middleware redirect check failed:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
