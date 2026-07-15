'use client'

import DashboardShell from '@/components/dashboard/DashboardShell'
import StatCard from '@/components/dashboard/StatCard'

const NAV = [
  { icon: 'dashboard', label: 'Events Home', active: true },
  { icon: 'event', label: 'Create event' },
  { icon: 'calendar_month', label: 'Calendar' },
  { icon: 'rsvp', label: 'RSVPs' },
  { icon: 'image', label: 'Posters' },
  { icon: 'notifications', label: 'Reminders' },
  { icon: 'photo_library', label: 'Gallery submit' },
]

export default function OrganizerDashboardPage() {
  return (
    <DashboardShell role="ORGANIZER" title="Organizer — Events & RSVPs" nav={NAV}>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        <StatCard label="Upcoming Events" value="4" icon="event" />
        <StatCard label="RSVP Responses" value="132" icon="rsvp" accent="green" />
        <StatCard label="Pending Reminders" value="2" icon="notification_important" accent="orange" />
        <StatCard label="Gallery Submissions" value="11" icon="photo_library" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Event creation</h3>
          <form className="space-y-sm">
            <input className="auth-field !rounded-lg" placeholder="Event title" />
            <input className="auth-field !rounded-lg" type="datetime-local" />
            <input className="auth-field !rounded-lg" placeholder="Location" />
            <textarea className="auth-field !rounded-lg !h-24" placeholder="Description" />
            <input className="auth-field !rounded-lg" placeholder="Poster image URL" />
            <div className="flex flex-wrap gap-sm pt-sm">
              <button type="button" className="bg-primary text-on-primary font-label-bold text-[13px] px-lg py-sm rounded-lg">
                Create event
              </button>
              <button type="button" className="border border-primary text-primary font-label-bold text-[13px] px-lg py-sm rounded-lg">
                Edit event
              </button>
              <button type="button" className="bg-secondary-container text-on-primary font-label-bold text-[13px] px-lg py-sm rounded-lg">
                Send reminder
              </button>
            </div>
          </form>
        </div>

        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">RSVP attendee list</h3>
          <table className="w-full text-[13px] text-left">
            <thead>
              <tr className="text-[11px] uppercase text-on-surface-variant">
                <th className="pb-sm">Member</th>
                <th className="pb-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {[
                ['Peter Member', 'Going'],
                ['Faith Achieng', 'Maybe'],
                ['John Otieno', 'Going'],
                ['Grace Atieno', 'Declined'],
              ].map(([n, s]) => (
                <tr key={n}>
                  <td className="py-sm font-label-bold">{n}</td>
                  <td className="py-sm">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="mt-md text-secondary font-label-bold text-[13px] hover:underline">
            Export attendance list
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Calendar view</h3>
          <ul className="text-[13px] space-y-sm">
            <li className="flex justify-between py-sm border-b border-outline-variant/40">
              <span>Family Day</span>
              <span>Jul 26</span>
            </li>
            <li className="flex justify-between py-sm border-b border-outline-variant/40">
              <span>Youth Clinic</span>
              <span>Aug 2</span>
            </li>
            <li className="flex justify-between py-sm">
              <span>Harvest Thanksgiving</span>
              <span>Aug 16</span>
            </li>
          </ul>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Post-event summary</h3>
          <textarea className="auth-field !rounded-lg !h-28 mb-sm" placeholder="Summary notes…" />
          <button type="button" className="bg-primary text-on-primary font-label-bold text-[13px] px-lg py-sm rounded-lg w-full">
            Save summary
          </button>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Gallery submit</h3>
          <p className="text-[13px] text-on-surface-variant mb-md">
            Upload photos for admin approval before public gallery publish.
          </p>
          <button type="button" className="w-full border border-secondary-container text-secondary font-label-bold text-[13px] py-sm rounded-lg">
            Publish gallery photos (submit)
          </button>
        </div>
      </div>
    </DashboardShell>
  )
}
