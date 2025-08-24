import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Since this app uses localStorage for tokens (client-side only),
  // we cannot check authentication in middleware (server-side)
  // Instead, let each page handle its own authentication
  
  // Only handle public route redirections that don't require auth checks
  
  // If user is on root path, redirect to login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
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
} 