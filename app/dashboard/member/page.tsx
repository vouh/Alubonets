'use client'

import DashboardShell from '@/components/dashboard/DashboardShell'
import StatCard from '@/components/dashboard/StatCard'

const NAV = [
  { icon: 'dashboard', label: 'My portal', active: true },
  { icon: 'payments', label: 'My contributions' },
  { icon: 'campaign', label: 'Announcements' },
  { icon: 'event', label: 'Events' },
  { icon: 'assignment', label: 'Projects' },
  { icon: 'folder', label: 'Documents' },
  { icon: 'volunteer_activism', label: 'Welfare' },
  { icon: 'person', label: 'Profile' },
]

export default function MemberDashboardPage() {
  return (
    <DashboardShell role="MEMBER" title="Member Portal" nav={NAV}>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        <StatCard label="My Contributions" value="KES 12,500" icon="payments" accent="green" />
        <StatCard label="Pending Balance" value="KES 1,500" icon="account_balance_wallet" accent="orange" />
        <StatCard label="Upcoming Events" value="3" icon="event" />
        <StatCard label="New Announcements" value="5" icon="campaign" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] overflow-hidden">
          <div className="px-lg py-md border-b border-outline-variant/40 flex justify-between items-center">
            <h3 className="font-h3 text-[18px] text-primary">Contribution history</h3>
            <button type="button" className="text-secondary font-label-bold text-[13px] hover:underline">
              Download statement
            </button>
          </div>
          <table className="w-full text-[13px] text-left">
            <thead>
              <tr className="bg-surface-container-low text-[11px] uppercase text-on-surface-variant">
                <th className="px-lg py-sm">Date</th>
                <th className="px-lg py-sm">Amount</th>
                <th className="px-lg py-sm">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {[
                ['Jul 01, 2026', '2,000'],
                ['Jun 01, 2026', '2,000'],
                ['May 01, 2026', '2,000'],
              ].map(([d, a]) => (
                <tr key={d}>
                  <td className="px-lg py-sm">{d}</td>
                  <td className="px-lg py-sm font-label-bold">KES {a}</td>
                  <td className="px-lg py-sm">
                    <button type="button" className="text-primary font-bold text-[12px] hover:underline">
                      Download receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-lg">
          <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
            <h3 className="font-h3 text-[18px] text-primary mb-md">Recent announcements</h3>
            <ul className="text-[13px] space-y-sm text-on-surface-variant">
              <li>• Family Day registration opens July 15</li>
              <li>• Contribution reminder for July dues</li>
              <li>• AGM minutes published in Documents</li>
            </ul>
          </div>
          <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
            <h3 className="font-h3 text-[18px] text-primary mb-md">Upcoming events</h3>
            <ul className="text-[13px] space-y-sm">
              {['Family Day — Jul 26', 'Youth Clinic — Aug 2', 'Monthly meeting — Aug 9'].map(e => (
                <li key={e} className="flex justify-between items-center border-b border-outline-variant/40 py-sm last:border-0">
                  <span>{e}</span>
                  <button type="button" className="text-[12px] font-bold text-secondary-container">
                    RSVP
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Projects & comments</h3>
          <p className="text-[13px] text-on-surface-variant mb-sm">Youth Skills Hub — Ongoing</p>
          <textarea className="auth-field !rounded-lg !h-20 mb-sm" placeholder="Comment on project…" />
          <button type="button" className="bg-primary text-on-primary font-label-bold text-[13px] px-lg py-sm rounded-lg">
            Comment on project
          </button>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Document downloads</h3>
          <ul className="text-[13px] space-y-sm">
            <li>
              <button type="button" className="text-primary hover:underline">
                Constitution.pdf
              </button>
            </li>
            <li>
              <button type="button" className="text-primary hover:underline">
                Member handbook.pdf
              </button>
            </li>
          </ul>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Welfare request</h3>
          <textarea className="auth-field !rounded-lg !h-24 mb-sm" placeholder="Describe your request…" />
          <button type="button" className="w-full bg-secondary-container text-on-primary font-label-bold text-[13px] py-sm rounded-lg">
            Submit welfare request
          </button>
          <button type="button" className="w-full mt-sm border border-primary text-primary font-label-bold text-[13px] py-sm rounded-lg">
            Update profile
          </button>
          <p className="text-[11px] text-on-surface-variant mt-md">
            You can only view your own financial records.
          </p>
        </div>
      </div>
    </DashboardShell>
  )
}
