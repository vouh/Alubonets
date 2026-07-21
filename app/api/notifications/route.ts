import { NextResponse } from 'next/server'
import { getSessionProfile } from '@/lib/auth/session'
import { getRecentItems, getOldAnnouncementsCount } from '@/lib/data/queries'

export const dynamic = 'force-dynamic'

const MANAGER_ROLES = ['ADMIN', 'SECRETARY', 'EXECUTIVE', 'ORGANIZER']

export async function GET() {
  const profile = await getSessionProfile()
  if (!profile) return NextResponse.json({ items: [] }, { status: 401 })

  const isManager = MANAGER_ROLES.includes(profile.role)
  // Managers see 48 h of activity; regular members only see the last 6 h
  // (toasts feel urgent — once a member has seen them they stay gone via SEEN_TTL)
  const windowHours = isManager ? 48 : 6

  const [{ events, projects, photos }, cleanupCount] = await Promise.all([
    getRecentItems(windowHours),
    isManager ? getOldAnnouncementsCount() : Promise.resolve(0),
  ])

  const items = [
    ...events.map((e) => ({
      id: `event-${e.id}`,
      type: 'event' as const,
      title: e.title,
      description: e.location ?? 'New upcoming event',
      imageUrl: e.imageUrl ?? null,
      href: `/events/${e.id}`,
      createdAt: e.createdAt.toISOString(),
    })),
    ...projects.map((p) => ({
      id: `project-${p.id}`,
      type: 'project' as const,
      title: p.title,
      description: p.status.charAt(0) + p.status.slice(1).toLowerCase(),
      imageUrl: p.imageUrl ?? null,
      href: `/projects/${p.id}`,
      createdAt: p.createdAt.toISOString(),
    })),
    ...photos.map((p) => ({
      id: `gallery-${p.id}`,
      type: 'gallery' as const,
      title: p.caption ?? 'New photo added',
      description: p.category ?? 'Gallery',
      imageUrl: p.url,
      href: '/gallery',
      createdAt: p.uploadedAt.toISOString(),
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return NextResponse.json({ items, cleanupCount })
}
