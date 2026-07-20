import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { ORGANIZER_NAV } from '@/lib/dashboard/nav'
import { getSessionProfile } from '@/lib/auth/session'
import CreateEventForm from '@/components/dashboard/CreateEventForm'
import EventsGrid from '@/components/dashboard/EventsGrid'

export default async function OrganizerEventsPage() {
  const profile = await getSessionProfile()
  if (!profile) redirect('/login')

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const now = new Date().toISOString()

  const { data: allEvents } = await supabase
    .from('events')
    .select('id, title, startsAt, location, description, imageUrl, isPublic')
    .order('startsAt', { ascending: true })

  const events = allEvents ?? []
  const upcoming = events.filter((e) => e.startsAt >= now)
  const past = events.filter((e) => e.startsAt < now).reverse()

  return (
    <DashboardShell role="ORGANIZER" title="Events" nav={ORGANIZER_NAV}>
      <div className="space-y-5 p-4 md:p-6 max-w-4xl mx-auto">

        {/* Create form */}
        <section className="rounded-2xl border border-outline-variant dark:border-[#1a2d4f] bg-surface dark:bg-[#0d1729] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <span className="material-symbols-outlined icon-fill text-primary" style={{ fontSize: 18 }}>
                add_circle
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-[14px] text-on-surface dark:text-blue-50">Create event</h2>
              <p className="text-[11px] text-on-surface-variant dark:text-blue-200/50">
                Add a cover photo and choose who sees it
              </p>
            </div>
          </div>
          <CreateEventForm />
        </section>

        {/* Upcoming */}
        <section className="rounded-2xl border border-outline-variant dark:border-[#1a2d4f] bg-surface dark:bg-[#0d1729] p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined icon-fill text-primary" style={{ fontSize: 18 }}>
              event_upcoming
            </span>
            <h2 className="font-semibold text-[13px] text-on-surface dark:text-blue-50 uppercase tracking-wider">
              Upcoming ({upcoming.length})
            </h2>
          </div>
          <EventsGrid
            events={upcoming}
            emptyMessage="No upcoming events. Create one above."
          />
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section className="rounded-2xl border border-outline-variant dark:border-[#1a2d4f] bg-surface dark:bg-[#0d1729] p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-outline dark:text-blue-200/40" style={{ fontSize: 18 }}>
                history
              </span>
              <h2 className="font-semibold text-[13px] text-on-surface-variant dark:text-blue-200/60 uppercase tracking-wider">
                Past ({past.length})
              </h2>
            </div>
            <EventsGrid
              events={past.slice(0, 12)}
              emptyMessage=""
              dimPast
            />
          </section>
        )}
      </div>
    </DashboardShell>
  )
}
