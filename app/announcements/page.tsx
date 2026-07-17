import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import AnnouncementComposer from '@/components/dashboard/AnnouncementComposer'
import MarkAnnouncementsRead from '@/components/dashboard/MarkAnnouncementsRead'
import { navForRole } from '@/lib/dashboard/nav'
import { getAnnouncementsForUser } from '@/lib/data/queries'
import { getSessionProfile } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import type { Role } from '@/lib/auth/types'

export const metadata = {
  title: 'Announcements',
}

export default async function AnnouncementsPage() {
  const profile = await getSessionProfile()
  if (!profile) redirect('/login?next=/announcements')
  if (profile.status === 'SUSPENDED') redirect('/login?error=suspended')

  const role = profile.role as Role
  const canSend = role === 'ADMIN' || profile.isSuperAdmin

  const [announcements, members] = await Promise.all([
    getAnnouncementsForUser(profile.id),
    canSend
      ? prisma.user.findMany({
          where: { status: 'ACTIVE', id: { not: profile.id } },
          select: { id: true, fullName: true, email: true },
          orderBy: { fullName: 'asc' },
        })
      : Promise.resolve([]),
  ])

  return (
    <DashboardShell role={role} title="Announcements" nav={navForRole(role)}>
      <MarkAnnouncementsRead />
      <div className="max-w-3xl mx-auto space-y-4 pb-10">
        {canSend && (
          <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 border-t-4 border-t-secondary-container">
            <h2 className="font-label-bold text-sm text-on-surface mb-3">Send a notification</h2>
            <AnnouncementComposer members={members} />
          </section>
        )}

        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
          <div className="px-4 py-3 border-b border-outline-variant bg-surface-container-low">
            <h2 className="font-label-bold text-sm text-on-surface">Announcements</h2>
          </div>
          {announcements.length === 0 ? (
            <p className="px-4 py-8 text-sm text-on-surface-variant text-center">
              No announcements yet.
            </p>
          ) : (
            <ul>
              {announcements.map((a) => {
                const receipt = a.receipts[0]
                const unread = receipt ? receipt.readAt === null : false
                return (
                  <li
                    key={a.id}
                    className={`px-4 py-3 border-b border-outline-variant/40 last:border-b-0 ${
                      unread ? 'bg-secondary-container/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-on-surface flex items-center gap-2">
                        {unread && (
                          <span
                            className="h-2 w-2 rounded-full bg-secondary-container shrink-0"
                            title="New"
                          />
                        )}
                        {a.title}
                      </p>
                      <time className="text-[12px] text-on-surface-variant shrink-0">
                        {a.publishedAt.toLocaleDateString()}
                      </time>
                    </div>
                    <p className="text-sm text-on-surface-variant mt-1 whitespace-pre-wrap">
                      {a.content}
                    </p>
                    <p className="text-[12px] text-on-surface-variant/70 mt-1">
                      — {a.author.fullName}
                      {!a.broadcast && ' · sent directly to you'}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </DashboardShell>
  )
}
