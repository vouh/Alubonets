'use client'

import { TEST_ACCOUNTS } from '@/lib/auth/users'
import {
  ApprovalStatusChart,
  ChartCard,
  FamilyBranchChart,
  MemberGrowthChart,
} from '@/components/dashboard/Charts'

const ACTIVITY = [
  { user: 'Sarah Wangari', action: 'Submitted registration', time: '12 min ago' },
  { user: 'David Treasurer', action: 'Recorded contribution KES 2,000', time: '1 hr ago' },
  { user: 'Mary Organizer', action: 'Created event: Family Day', time: '3 hrs ago' },
  { user: 'Gina Admin', action: 'Approved member Peter W.', time: 'Yesterday' },
]

const GALLERY_QUEUE = [
  { title: 'AGM group photo', by: 'Mary Organizer', date: 'Jul 10' },
  { title: 'Welfare visit', by: 'Peter Member', date: 'Jul 8' },
  { title: 'Youth workshop', by: 'Sarah Secretary', date: 'Jul 5' },
]

/** Additional admin sections (appended — does not replace existing dashboard) */
export default function AdminExtras() {
  return (
    <div className="space-y-lg">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        {[
          { label: 'Suspended Accounts', value: '5', hint: 'Need follow-up', icon: 'person_off' },
          { label: 'Projects', value: '9', hint: '3 ongoing', icon: 'assignment' },
          { label: 'Events', value: '4', hint: 'This month', icon: 'event' },
          { label: 'Pending Approvals', value: '18', hint: 'Requires review', icon: 'pending_actions' },
        ].map(c => (
          <div
            key={c.label}
            className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-md"
          >
            <div className="flex justify-between items-start">
              <p className="font-caption text-[11px] text-on-surface-variant uppercase tracking-wider">
                {c.label}
              </p>
              <span className="material-symbols-outlined text-primary text-[18px]">{c.icon}</span>
            </div>
            <p className="font-h3 text-h3 text-on-surface dark:text-blue-50 mt-sm">{c.value}</p>
            <p className="text-[11px] text-on-surface-variant mt-xs">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
            Recent user activity
          </h3>
          <ul className="space-y-md">
            {ACTIVITY.map(a => (
              <li key={a.user + a.time} className="flex gap-sm text-[13px]">
                <span className="material-symbols-outlined text-secondary-container text-[18px]">
                  history
                </span>
                <div>
                  <p className="font-label-bold text-on-surface dark:text-blue-50">{a.user}</p>
                  <p className="text-on-surface-variant">{a.action}</p>
                  <p className="text-[11px] text-on-surface-variant/70">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
            Role management
          </h3>
          <div className="space-y-sm">
            {TEST_ACCOUNTS.map(a => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-sm py-sm border-b border-outline-variant/40 last:border-0"
              >
                <div>
                  <p className="font-label-bold text-[13px] text-on-surface dark:text-blue-50">
                    {a.fullName}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">{a.email}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide bg-primary-fixed text-primary px-sm py-xs rounded-full">
                  {a.role}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-sm mt-md">
            <button
              type="button"
              className="bg-primary text-on-primary font-label-bold text-[12px] py-sm rounded-lg"
            >
              Assign role
            </button>
            <button
              type="button"
              className="border border-outline-variant font-label-bold text-[12px] py-sm rounded-lg"
            >
              Deactivate
            </button>
          </div>
        </div>

        <div className="space-y-lg">
          <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
            <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
              Gallery approval queue
            </h3>
            {GALLERY_QUEUE.map(g => (
              <div
                key={g.title}
                className="flex items-center justify-between gap-sm py-sm border-b border-outline-variant/40 last:border-0"
              >
                <div>
                  <p className="font-label-bold text-[13px]">{g.title}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    {g.by} · {g.date}
                  </p>
                </div>
                <div className="flex gap-xs">
                  <button
                    type="button"
                    className="text-[11px] font-bold text-[#166534] bg-[#dcfce7] px-2 py-1 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="text-[11px] font-bold text-on-error-container bg-error-container px-2 py-1 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
            <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
              Notification templates
            </h3>
            <ul className="space-y-sm text-[13px] text-on-surface-variant">
              <li className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  mail
                </span>
                Registration approval
              </li>
              <li className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  mail
                </span>
                2FA OTP code
              </li>
              <li className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  mail
                </span>
                Announcement digest
              </li>
            </ul>
            <div className="flex gap-sm mt-md">
              <button type="button" className="text-secondary font-label-bold text-[13px] hover:underline">
                Manage templates
              </button>
              <button type="button" className="text-primary font-label-bold text-[13px] hover:underline">
                Backup system
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <ChartCard title="Member growth by month">
          <MemberGrowthChart />
        </ChartCard>
        <ChartCard title="Members by family branch">
          <FamilyBranchChart />
        </ChartCard>
        <ChartCard title="Registration approval status">
          <ApprovalStatusChart />
        </ChartCard>
      </div>
    </div>
  )
}
