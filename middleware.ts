import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, ROLE_HOME, type Role } from '@/lib/auth/types'
import { verifyToken } from '@/lib/auth/jwt'
import { updateSession } from '@/utils/supabase/middleware'

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith('/dashboard') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/')
  )
}

function allowedPath(role: Role, pathname: string) {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return role === 'ADMIN'
  }
  if (role === 'ADMIN') {
    // Admins may open any dashboard for oversight
    return pathname.startsWith('/dashboard')
  }
  const home = ROLE_HOME[role]
  return pathname === home || pathname.startsWith(`${home}/`)
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(({ name, value }) => {
    to.cookies.set(name, value)
  })
  return to
}

export async function middleware(req: NextRequest) {
  // Keep Supabase Auth cookies fresh on matched routes
  const supabaseResponse = await updateSession(req)

  const { pathname } = req.nextUrl

  if (!isProtectedPath(pathname)) {
    return supabaseResponse
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return copyCookies(supabaseResponse, NextResponse.redirect(url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    const res = copyCookies(supabaseResponse, NextResponse.redirect(url))
    res.cookies.set(AUTH_COOKIE, '', { path: '/', maxAge: 0 })
    return res
  }

  if (!allowedPath(payload.role, pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = ROLE_HOME[payload.role]
    return copyCookies(supabaseResponse, NextResponse.redirect(url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets.
     * Needed so Supabase can refresh the session on page navigations.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
