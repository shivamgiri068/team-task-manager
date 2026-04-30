import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_ethara_task_manager_key_123!'
const secretKey = new TextEncoder().encode(JWT_SECRET)

// Add routes that don't require authentication
const publicRoutes = ['/login', '/register', '/']
const publicApiRoutes = ['/api/auth/login', '/api/auth/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isPublicRoute = publicRoutes.includes(pathname)
  const isPublicApiRoute = publicApiRoutes.includes(pathname)

  // Allow public routes
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    // Redirect to login if accessing protected page
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Return 401 for protected APIs
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { payload } = await jwtVerify(token, secretKey)
    
    // Add user info to request headers so API routes can access it
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.id as string)
    requestHeaders.set('x-user-role', payload.role as string)
    requestHeaders.set('x-user-email', payload.email as string)

    // Example RBAC: Only ADMIN can access /api/users
    if (pathname.startsWith('/api/users') && payload.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // Token is invalid or expired
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
