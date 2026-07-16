import DashboardShell from '@/components/dashboard/DashboardShell'
import { EXECUTIVE_NAV } from '@/lib/dashboard/nav'
import { getExecutiveDashboardData } from '@/lib/data/queries'
import { actionCreateAnnouncement } from '@/app/actions/domain'

export default async function ExecutiveAnnouncementsPage() {
  const data = await getExecutiveDashboardData()

  return (
    <DashboardShell role="EXECUTIVE" title="Announcements" nav={EXECUTIVE_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Publish announcement</h2>
          <form action={actionCreateAnnouncement} className="grid gap-3">
            <input name="title" placeholder="Title" required className="border rounded-lg px-3 py-2" />
            <textarea
              name="content"
              placeholder="Content"
              required
              rows={3}
              className="border rounded-lg px-3 py-2"
            />
            <button className="bg-primary text-on-primary rounded-lg px-4 py-2">Publish</button>
          </form>
        </section>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Latest announcements</h2>
          <ul className="space-y-2">
            {data.announcements.map((a) => (
              <li key={a.id} className="border-b pb-2">
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-on-surface-variant">{a.content}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  )
}
