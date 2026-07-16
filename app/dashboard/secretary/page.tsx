import DashboardShell from '@/components/dashboard/DashboardShell'
import { SECRETARY_NAV } from '@/lib/dashboard/nav'
import { actionCreateDocument } from '@/app/actions/domain'
import { getSecretaryDashboardData } from '@/lib/data/queries'
import Link from 'next/link'

export default async function SecretaryPage() {
  const data = await getSecretaryDashboardData()

  return (
    <DashboardShell role="SECRETARY" title="Secretary" nav={SECRETARY_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Documents', value: data.documents.length },
            { label: 'Meetings', value: data.meetings.length },
            { label: 'Avg attendance', value: data.attendanceAvg },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-surface p-4">
              <p className="text-xs text-on-surface-variant uppercase">{s.label}</p>
              <p className="text-2xl font-semibold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Link
            href="/dashboard/secretary/announcements"
            className="rounded-xl border bg-surface p-4"
          >
            <p className="font-semibold">Announcements</p>
            <p className="text-sm text-on-surface-variant mt-1">Publish and review notices</p>
          </Link>
          <Link href="/dashboard/secretary/meetings" className="rounded-xl border bg-surface p-4">
            <p className="font-semibold">Meetings</p>
            <p className="text-sm text-on-surface-variant mt-1">Minutes, attendance, DOCX export</p>
          </Link>
        </div>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Add document (URL)</h2>
          <form action={actionCreateDocument} className="grid gap-3 md:grid-cols-2">
            <input name="title" placeholder="Title" required className="border rounded-lg px-3 py-2" />
            <input name="category" placeholder="Category" className="border rounded-lg px-3 py-2" />
            <input
              name="fileUrl"
              placeholder="https://..."
              required
              className="border rounded-lg px-3 py-2 md:col-span-2"
            />
            <button className="bg-primary text-on-primary rounded-lg px-4 py-2 md:col-span-2">
              Save document
            </button>
          </form>
        </section>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Documents</h2>
          <ul className="space-y-2 text-sm">
            {data.documents.map((d) => (
              <li key={d.id} className="flex justify-between gap-2 border-b pb-2">
                <span>
                  {d.title}{' '}
                  <span className="text-on-surface-variant">({d.category || 'General'})</span>
                </span>
                <a href={d.fileUrl} className="text-primary underline" target="_blank" rel="noreferrer">
                  Open
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  )
}
