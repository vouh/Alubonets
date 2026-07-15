import { cookies } from 'next/headers'
import { AUTH_COOKIE } from './types'
import { signToken, toAuthUser, verifyToken } from './jwt'
import type { AuthUser } from './types'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

export async function setSessionCookie(user: AuthUser) {
  const token = await signToken(user)
  const jar = await cookies()
  jar.set(AUTH_COOKIE, token, COOKIE_OPTS)
  return token
}

export async function clearSessionCookie() {
  const jar = await cookies()
  jar.set(AUTH_COOKIE, '', { ...COOKIE_OPTS, maxAge: 0 })
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const jar = await cookies()
  const token = jar.get(AUTH_COOKIE)?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  return toAuthUser(payload)
}
