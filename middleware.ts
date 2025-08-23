import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the token from cookies (you can adjust this based on your auth strategy)
  const token = request.cookies.get('auth-token')?.value
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register']
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dash']
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route)
  
  // If user is trying to access a protected route without authentication
  if (isProtectedRoute && !token) {
    // Redirect to registration page for new users
    return NextResponse.redirect(new URL('/register', request.url))
  }
  
  // If user is authenticated and trying to access public routes like login/register
  if (token && (pathname === '/login' || pathname === '/register')) {
    // Redirect to dashboard if already authenticated
    return NextResponse.redirect(new URL('/dash', request.url))
  }
  
  // If user is authenticated and trying to access the landing page
  if (token && pathname === '/') {
    // Redirect to dashboard if already authenticated
    return NextResponse.redirect(new URL('/dash', request.url))
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