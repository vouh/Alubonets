import DashboardShell from '@/components/dashboard/DashboardShell'
import { ORGANIZER_NAV } from '@/lib/dashboard/nav'
import { actionCreateGallery } from '@/app/actions/domain'
import { getOrganizerDashboardData } from '@/lib/data/queries'

export default async function OrganizerGalleryPage() {
  const data = await getOrganizerDashboardData()

  return (
    <DashboardShell role="ORGANIZER" title="Gallery" nav={ORGANIZER_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Add gallery photo (URL)</h2>
          <form action={actionCreateGallery} className="grid gap-3 md:grid-cols-2">
            <input
              name="url"
              placeholder="Image URL"
              required
              className="border rounded-lg px-3 py-2 md:col-span-2"
            />
            <input name="caption" placeholder="Caption" className="border rounded-lg px-3 py-2" />
            <input name="category" placeholder="Category" className="border rounded-lg px-3 py-2" />
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" name="publish" /> Publish immediately
            </label>
            <button className="bg-primary text-on-primary rounded-lg px-4 py-2 md:col-span-2">
              Upload metadata
            </button>
          </form>
        </section>

        <section className="rounded-xl border bg-surface p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.gallery.map((g) => (
            <figure key={g.id} className="border rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt={g.caption || 'Gallery'} className="h-36 w-full object-cover" />
              <figcaption className="p-2 text-xs">
                {g.caption || 'Untitled'} · {g.isPublic ? 'Public' : 'Pending'}
              </figcaption>
            </figure>
          ))}
        </section>
      </div>
    </DashboardShell>
  )
}
