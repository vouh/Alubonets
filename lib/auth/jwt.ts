import { SignJWT, jwtVerify } from 'jose'
import type { AuthUser, JwtPayload, Role } from './types'

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'alubonets-dev-jwt-secret'
  return new TextEncoder().encode(secret)
}

export async function signToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  } satisfies Omit<JwtPayload, 'sub'>)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<(JwtPayload & { id: string }) | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    const sub = payload.sub
    const email = payload.email
    const fullName = payload.fullName
    const role = payload.role
    if (
      typeof sub !== 'string' ||
      typeof email !== 'string' ||
      typeof fullName !== 'string' ||
      typeof role !== 'string'
    ) {
      return null
    }
    return {
      sub,
      id: sub,
      email,
      fullName,
      role: role as Role,
    }
  } catch {
    return null
  }
}

export function toAuthUser(payload: JwtPayload & { id: string }): AuthUser {
  const parts = payload.fullName.trim().split(/\s+/)
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : payload.fullName.slice(0, 2).toUpperCase()

  return {
    id: payload.id,
    email: payload.email,
    fullName: payload.fullName,
    role: payload.role,
    initials,
  }
}
