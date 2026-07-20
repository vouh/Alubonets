import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Events — Alubonets SHG',
  description: 'Upcoming and past events organised by Alubonets Self-Help Group.',
}

function CalendarChip({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr)
  const month = d.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()
  const day = d.getDate()
  return (
    <div className="flex w-12 shrink-0 flex-col items-center rounded-xl border border-primary/20 bg-primary/5 py-2 text-center">
      <span className="text-[10px] font-semibold text-secondary uppercase leading-none tracking-wide">{month}</span>
      <span className="text-[20px] font-bold text-primary leading-tight">{day}</span>
    </div>
  )
}

type EventRow = {
  id: string
  title: string
  description?: string | null
  location?: string | null
  startsAt: string
  imageUrl?: string | null
}

function EventCard({ event }: { event: EventRow }) {
  const date = new Date(event.startsAt)
  const time = date.toLocaleString(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <article className="rounded-2xl border border-outline-variant bg-surface overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      {event.imageUrl ? (
        <div className="overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-28 bg-gradient-to-br from-primary/8 to-primary/3 flex items-center justify-center">
          <span className="material-symbols-outlined icon-fill text-primary/25" style={{ fontSize: 48 }}>
            event
          </span>
        </div>
      )}
      <div className="p-4 flex gap-3 flex-1">
        <CalendarChip dateStr={event.startsAt} />
        <div className="min-w-0">
          <h3 className="font-semibold text-[15px] text-on-surface leading-snug">{event.title}</h3>
          <p className="text-[13px] text-on-surface-variant mt-0.5">
            {time}{event.location ? ` · ${event.location}` : ''}
          </p>
          {event.description && (
            <p className="text-[13px] text-on-surface-variant/80 mt-2 line-clamp-3 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default async function PublicEventsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const now = new Date().toISOString()

  const { data } = await supabase
    .from('events')
    .select('id, title, startsAt, location, description, imageUrl')
    .eq('isPublic', true)
    .order('startsAt', { ascending: true })

  const all = data ?? []
  const upcoming = all.filter((e) => e.startsAt >= now)
  const past = all.filter((e) => e.startsAt < now).reverse().slice(0, 6)

  return (
    <main className="flex-grow">
      {/* Hero */}
      <section className="bg-primary text-on-primary py-xl px-md md:px-lg">
        <div className="max-w-container-max mx-auto">
          <p className="font-label-bold text-[12px] uppercase tracking-[0.14em] text-secondary-container mb-xs">
            Community
          </p>
          <h1 className="font-h1-mobile text-h1-mobile md:font-h2 md:text-h2 text-on-primary">
            Events
          </h1>
          <p className="text-on-primary/80 mt-sm text-[15px] max-w-xl">
            Stay up to date with meetings, celebrations and activities organised by Alubonets.
          </p>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-md md:px-lg py-xl space-y-xxl">

        {/* Upcoming */}
        <section>
          <h2 className="font-h3 text-[20px] text-primary mb-lg flex items-center gap-2">
            <span className="material-symbols-outlined icon-fill text-secondary-container" style={{ fontSize: 22 }}>
              event_upcoming
            </span>
            Upcoming events
          </h2>
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-xl text-center">
              <span className="material-symbols-outlined icon-fill text-outline/60 block mb-3" style={{ fontSize: 40 }}>
                calendar_month
              </span>
              <p className="text-on-surface-variant font-medium">No upcoming events at the moment.</p>
              <p className="text-on-surface-variant/70 text-[13px] mt-1">Check back soon — events are added regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h2 className="font-h3 text-[18px] text-on-surface-variant mb-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-outline" style={{ fontSize: 20 }}>history</span>
              Recent past events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {past.map((e) => (
                <article
                  key={e.id}
                  className="rounded-2xl border border-outline-variant bg-surface overflow-hidden flex flex-col opacity-65"
                >
                  {e.imageUrl ? (
                    <img src={e.imageUrl} alt={e.title} className="w-full h-36 object-cover grayscale" />
                  ) : (
                    <div className="w-full h-20 bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline/40" style={{ fontSize: 36 }}>event</span>
                    </div>
                  )}
                  <div className="p-4 flex gap-3">
                    <CalendarChip dateStr={e.startsAt} />
                    <div className="min-w-0">
                      <h3 className="font-medium text-[14px] text-on-surface line-through decoration-outline">{e.title}</h3>
                      <p className="text-[12px] text-on-surface-variant mt-0.5">
                        {new Date(e.startsAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                        {e.location ? ` · ${e.location}` : ''}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
