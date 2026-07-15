import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, ROLE_HOME, type Role } from '@/lib/auth/types'
import { verifyToken } from '@/lib/auth/jwt'

function allowedDashboard(role: Role, pathname: string) {
  if (role === 'ADMIN') {
    // Admins may open any dashboard for oversight
    return pathname.startsWith('/dashboard')
  }
  const home = ROLE_HOME[role]
  return pathname === home || pathname.startsWith(`${home}/`)
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Role dashboards under /dashboard/* require JWT
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  const payload = await verifyToken(token)
  if (!payload) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    const res = NextResponse.redirect(url)
    res.cookies.set(AUTH_COOKIE, '', { path: '/', maxAge: 0 })
    return res
  }

  if (!allowedDashboard(payload.role, pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = ROLE_HOME[payload.role]
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
