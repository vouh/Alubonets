import DashboardShell from '@/components/dashboard/DashboardShell'
import { ORGANIZER_NAV } from '@/lib/dashboard/nav'
import { actionUpsertProject } from '@/app/actions/domain'

export default async function OrganizerProjectsPage() {
  return (
    <DashboardShell role="ORGANIZER" title="Projects" nav={ORGANIZER_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Create / update project</h2>
          <form action={actionUpsertProject} className="grid gap-3">
            <input name="title" placeholder="Title" required className="border rounded-lg px-3 py-2" />
            <textarea
              name="description"
              placeholder="Description"
              required
              className="border rounded-lg px-3 py-2"
            />
            <select name="status" className="border rounded-lg px-3 py-2">
              <option value="UPCOMING">UPCOMING</option>
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <button className="bg-primary text-on-primary rounded-lg px-4 py-2">Save project</button>
          </form>
        </section>
      </div>
    </DashboardShell>
  )
}
