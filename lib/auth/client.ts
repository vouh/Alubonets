import { AUTH_COOKIE, ROLE_HOME, type AuthUser, type Role } from './types'

export { AUTH_COOKIE, ROLE_HOME }
export type { AuthUser, Role }

export async function loginRequest(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Invalid credentials')
  }
  return data as { user: AuthUser; redirectTo: string }
}

export async function logoutRequest() {
  await fetch('/api/auth/logout', { method: 'POST' })
}

export async function meRequest(): Promise<AuthUser | null> {
  const res = await fetch('/api/auth/me')
  if (!res.ok) return null
  const data = await res.json()
  return data.user ?? null
}

export function homeForRole(role: Role) {
  return ROLE_HOME[role]
}
