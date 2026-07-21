import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { ORGANIZER_NAV } from '@/lib/dashboard/nav'
import { getSessionProfile } from '@/lib/auth/session'
import OrganizerEventsClient from '@/components/dashboard/OrganizerEventsClient'

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
      <OrganizerEventsClient upcoming={upcoming} past={past} />
    </DashboardShell>
  )
}
