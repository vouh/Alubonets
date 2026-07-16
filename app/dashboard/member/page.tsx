import DashboardShell from '@/components/dashboard/DashboardShell'
import { MEMBER_NAV } from '@/lib/dashboard/nav'
import { getMemberDashboardData } from '@/lib/data/queries'
import { getSessionProfile } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AnnouncementsRealtime from '@/components/dashboard/AnnouncementsRealtime'

export default async function MemberPage() {
  const profile = await getSessionProfile()
  if (!profile) redirect('/login')
  const data = await getMemberDashboardData(profile.id)

  return (
    <DashboardShell role="MEMBER" title="Member" nav={MEMBER_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-surface p-4">
            <p className="text-xs text-on-surface-variant uppercase">My contributions</p>
            <p className="text-2xl font-semibold mt-1">
              KES {Math.round(data.total).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border bg-surface p-4">
            <p className="text-xs text-on-surface-variant uppercase">Welfare requests</p>
            <p className="text-2xl font-semibold mt-1">{data.welfare.length}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Link href="/dashboard/member/contributions" className="rounded-xl border bg-surface p-4">
            <p className="font-semibold">Contributions</p>
            <p className="text-sm text-on-surface-variant mt-1">History and statement PDF</p>
          </Link>
          <Link href="/dashboard/member/welfare" className="rounded-xl border bg-surface p-4">
            <p className="font-semibold">Welfare</p>
            <p className="text-sm text-on-surface-variant mt-1">Request support and track status</p>
          </Link>
        </div>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Announcements</h2>
          <AnnouncementsRealtime initial={data.announcements} />
        </section>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Upcoming events</h2>
          <ul className="space-y-2 text-sm">
            {data.events.map((e) => (
              <li key={e.id}>
                {e.title} — {e.startsAt.toLocaleString()}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Documents</h2>
          <ul className="space-y-2 text-sm">
            {data.documents.map((d) => (
              <li key={d.id}>
                <a href={d.fileUrl} className="text-primary underline" target="_blank" rel="noreferrer">
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  )
}
