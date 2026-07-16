import DashboardShell from '@/components/dashboard/DashboardShell'
import { SECRETARY_NAV } from '@/lib/dashboard/nav'
import { actionCreateMeeting } from '@/app/actions/domain'
import { getSecretaryDashboardData } from '@/lib/data/queries'

export default async function SecretaryMeetingsPage() {
  const data = await getSecretaryDashboardData()

  return (
    <DashboardShell role="SECRETARY" title="Meetings" nav={SECRETARY_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Record meeting</h2>
          <form action={actionCreateMeeting} className="grid gap-3 md:grid-cols-2">
            <input name="title" placeholder="Title" required className="border rounded-lg px-3 py-2" />
            <input name="heldAt" type="datetime-local" required className="border rounded-lg px-3 py-2" />
            <input
              name="attendance"
              type="number"
              placeholder="Attendance"
              className="border rounded-lg px-3 py-2"
            />
            <textarea
              name="agenda"
              placeholder="Agenda"
              className="border rounded-lg px-3 py-2 md:col-span-2"
            />
            <textarea
              name="minutes"
              placeholder="Minutes"
              className="border rounded-lg px-3 py-2 md:col-span-2"
            />
            <button className="bg-primary text-on-primary rounded-lg px-4 py-2 md:col-span-2">
              Save meeting
            </button>
          </form>
        </section>

        <section className="rounded-xl border bg-surface p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Meetings</h2>
            <a href="/api/export/meetings" className="text-sm text-primary underline">
              Export DOCX
            </a>
          </div>
          <ul className="space-y-2 text-sm">
            {data.meetings.map((m) => (
              <li key={m.id} className="border-b pb-2">
                <p className="font-medium">
                  {m.title} · {m.heldAt.toLocaleDateString()} · {m.attendance} present
                </p>
                {m.minutes && <p className="text-on-surface-variant">{m.minutes}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  )
}
