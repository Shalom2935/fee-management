import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect all /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Try to get the token from cookies (adapt the cookie name if needed)
    const token = request.cookies.get('token')?.value
    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
