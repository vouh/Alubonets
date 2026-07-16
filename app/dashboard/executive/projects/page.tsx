import DashboardShell from '@/components/dashboard/DashboardShell'
import { EXECUTIVE_NAV } from '@/lib/dashboard/nav'
import { getExecutiveDashboardData } from '@/lib/data/queries'
import { actionUpsertProject } from '@/app/actions/domain'

export default async function ExecutiveProjectsPage() {
  const data = await getExecutiveDashboardData()

  return (
    <DashboardShell role="EXECUTIVE" title="Projects" nav={EXECUTIVE_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <section className="rounded-xl border bg-surface p-4 overflow-x-auto">
          <h2 className="font-semibold mb-3">All projects</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-on-surface-variant">
                <th className="py-2">Title</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-on-surface-variant text-xs line-clamp-1">{p.description}</p>
                  </td>
                  <td>{p.status}</td>
                  <td>{p.updatedAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Add / update project</h2>
          <form action={actionUpsertProject} className="grid gap-3 md:grid-cols-2">
            <input name="title" placeholder="Title" required className="border rounded-lg px-3 py-2" />
            <select name="status" className="border rounded-lg px-3 py-2">
              <option value="UPCOMING">UPCOMING</option>
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <textarea
              name="description"
              placeholder="Description"
              required
              className="border rounded-lg px-3 py-2 md:col-span-2"
              rows={3}
            />
            <button className="bg-primary text-on-primary rounded-lg px-4 py-2 md:col-span-2">
              Save project
            </button>
          </form>
        </section>
      </div>
    </DashboardShell>
  )
}
