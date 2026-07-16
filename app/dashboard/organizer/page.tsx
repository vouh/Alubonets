import DashboardShell from '@/components/dashboard/DashboardShell'
import { ORGANIZER_NAV } from '@/lib/dashboard/nav'
import { actionCreateEvent } from '@/app/actions/domain'
import { getOrganizerDashboardData } from '@/lib/data/queries'
import Link from 'next/link'

export default async function OrganizerPage() {
  const data = await getOrganizerDashboardData()

  return (
    <DashboardShell role="ORGANIZER" title="Organizer" nav={ORGANIZER_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Events', value: data.events.length },
            { label: 'Upcoming', value: data.upcoming.length },
            { label: 'Gallery items', value: data.gallery.length },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-surface p-4">
              <p className="text-xs text-on-surface-variant uppercase">{s.label}</p>
              <p className="text-2xl font-semibold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Link href="/dashboard/organizer/gallery" className="rounded-xl border bg-surface p-4">
            <p className="font-semibold">Gallery</p>
            <p className="text-sm text-on-surface-variant mt-1">Upload and review photos</p>
          </Link>
          <Link href="/dashboard/organizer/projects" className="rounded-xl border bg-surface p-4">
            <p className="font-semibold">Projects</p>
            <p className="text-sm text-on-surface-variant mt-1">Create and update group projects</p>
          </Link>
        </div>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Create event</h2>
          <form action={actionCreateEvent} className="grid gap-3 md:grid-cols-2">
            <input name="title" placeholder="Title" required className="border rounded-lg px-3 py-2" />
            <input name="startsAt" type="datetime-local" required className="border rounded-lg px-3 py-2" />
            <input name="location" placeholder="Location" className="border rounded-lg px-3 py-2" />
            <input name="description" placeholder="Description" className="border rounded-lg px-3 py-2" />
            <button className="bg-primary text-on-primary rounded-lg px-4 py-2 md:col-span-2">
              Save event
            </button>
          </form>
        </section>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Upcoming events</h2>
          <ul className="space-y-2 text-sm">
            {data.upcoming.map((e) => (
              <li key={e.id} className="border-b pb-2">
                <p className="font-medium">{e.title}</p>
                <p className="text-on-surface-variant">
                  {e.startsAt.toLocaleString()}
                  {e.location ? ` · ${e.location}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  )
}
