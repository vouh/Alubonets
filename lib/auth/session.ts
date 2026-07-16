import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { createServerClient as createServiceClient } from '@/lib/supabase-server'
import type { AuthUser, Role } from './types'
import { isAppRole, toAuthUser } from './helpers'
import type { MemberStatus, User } from '@prisma/client'

export type SessionProfile = AuthUser & {
  status: MemberStatus
  authUserId: string | null
  isSuperAdmin: boolean
  dashboardAccess: Role[]
}

export type AppMetadataPayload = {
  role: Role
  status: MemberStatus
  isSuperAdmin: boolean
  dashboardAccess: Role[]
}

export async function syncAppMetadata(
  authUserId: string,
  payload: AppMetadataPayload | Role,
  status?: MemberStatus,
  isSuperAdmin?: boolean,
  dashboardAccess?: Role[]
) {
  const admin = createServiceClient()
  const meta: AppMetadataPayload =
    typeof payload === 'string'
      ? {
          role: payload,
          status: status!,
          isSuperAdmin: isSuperAdmin ?? false,
          dashboardAccess: dashboardAccess ?? [],
        }
      : payload

  await admin.auth.admin.updateUserById(authUserId, {
    app_metadata: meta,
  })
}

export async function syncUserMetadata(user: User) {
  if (!user.authUserId) return
  await syncAppMetadata(user.authUserId, {
    role: user.role,
    status: user.status,
    isSuperAdmin: user.isSuperAdmin,
    dashboardAccess: user.dashboardAccess as Role[],
  })
}

export async function getSessionProfile(): Promise<SessionProfile | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return null

  let profile = await prisma.user.findFirst({
    where: {
      OR: [{ authUserId: authUser.id }, { email: authUser.email ?? undefined }],
    },
  })

  if (!profile && authUser.email) {
    profile = await prisma.user.create({
      data: {
        authUserId: authUser.id,
        email: authUser.email,
        fullName:
          (authUser.user_metadata?.full_name as string | undefined) ||
          (authUser.user_metadata?.name as string | undefined) ||
          authUser.email.split('@')[0],
        role: 'MEMBER',
        status: 'PENDING',
        isSuperAdmin: false,
        dashboardAccess: [],
      },
    })
    await syncUserMetadata(profile)
  }

  if (!profile) return null

  if (!profile.authUserId) {
    profile = await prisma.user.update({
      where: { id: profile.id },
      data: { authUserId: authUser.id },
    })
  }

  const meta = authUser.app_metadata ?? {}
  const needsSync =
    !isAppRole(meta.role) ||
    meta.role !== profile.role ||
    meta.status !== profile.status ||
    Boolean(meta.isSuperAdmin) !== profile.isSuperAdmin ||
    JSON.stringify(meta.dashboardAccess ?? []) !== JSON.stringify(profile.dashboardAccess)

  if (profile.authUserId && needsSync) {
    await syncUserMetadata(profile)
  }

  return {
    ...toAuthUser(profile),
    status: profile.status,
    authUserId: profile.authUserId,
    isSuperAdmin: profile.isSuperAdmin ?? false,
    dashboardAccess: (profile.dashboardAccess ?? []) as Role[],
  }
}

export async function requireSessionProfile() {
  const profile = await getSessionProfile()
  if (!profile) throw new Error('Unauthorized')
  return profile
}

export async function requireActiveRole(roles?: Role[]) {
  const profile = await requireSessionProfile()
  if (profile.status !== 'ACTIVE') {
    throw new Error('Account is not active')
  }
  if (!roles) return profile
  if (profile.isSuperAdmin || profile.role === 'ADMIN') return profile
  if (roles.includes(profile.role)) return profile
  // Extra dashboard grants: allow actions for roles the user may oversee
  if ((profile.dashboardAccess ?? []).some((r) => roles.includes(r))) return profile
  throw new Error('Forbidden')
}

export async function requireAdmin() {
  const profile = await requireActiveRole(['ADMIN'])
  if (profile.role !== 'ADMIN' && !profile.isSuperAdmin) {
    throw new Error('Forbidden')
  }
  return profile
}

export async function getPrismaUserByAuthId(authUserId: string): Promise<User | null> {
  return prisma.user.findFirst({ where: { authUserId } })
}

export async function clearSessionCookie() {}
export async function setSessionCookie(_user: AuthUser) {
  return ''
}
export async function getSessionUser(): Promise<AuthUser | null> {
  const profile = await getSessionProfile()
  if (!profile || profile.status !== 'ACTIVE') return null
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    role: profile.role,
    initials: profile.initials,
    isSuperAdmin: profile.isSuperAdmin,
    dashboardAccess: profile.dashboardAccess,
    status: profile.status,
  }
}
