'use client'

import DashboardShell from '@/components/dashboard/DashboardShell'
import StatCard from '@/components/dashboard/StatCard'

const NAV = [
  { icon: 'dashboard', label: 'Meetings Home', active: true },
  { icon: 'event_note', label: 'Agendas' },
  { icon: 'edit_note', label: 'Minutes' },
  { icon: 'group', label: 'Attendance' },
  { icon: 'task_alt', label: 'Action points' },
  { icon: 'folder', label: 'Documents' },
  { icon: 'history', label: 'Versions' },
]

export default function SecretaryDashboardPage() {
  return (
    <DashboardShell role="SECRETARY" title="Secretary — Meetings & Documents" nav={NAV}>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        <StatCard label="Meetings This Month" value="6" icon="event" />
        <StatCard label="Draft Reports" value="3" icon="draft" accent="orange" />
        <StatCard label="Published Minutes" value="24" icon="verified" accent="green" />
        <StatCard label="Documents Uploaded" value="58" icon="folder" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Meeting agenda creator</h3>
          <input className="auth-field !rounded-lg mb-sm" placeholder="Meeting title" />
          <input className="auth-field !rounded-lg mb-sm" type="datetime-local" />
          <textarea
            className="auth-field !rounded-lg !h-28 mb-sm"
            placeholder="Agenda items…"
          />
          <button type="button" className="bg-primary text-on-primary font-label-bold text-[13px] px-lg py-sm rounded-lg">
            Create meeting notice
          </button>
        </div>

        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Minutes editor</h3>
          <textarea
            className="auth-field !rounded-lg !h-40 mb-sm"
            defaultValue="Rich text minutes draft — discussion notes, resolutions, attendance…"
          />
          <div className="flex flex-wrap gap-sm">
            {['Save draft', 'Publish minutes', 'Export Word', 'Export PDF'].map(a => (
              <button
                key={a}
                type="button"
                className="bg-primary-fixed text-primary font-label-bold text-[12px] px-md py-sm rounded-lg"
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Attendance</h3>
          <ul className="text-[13px] space-y-sm">
            <li className="flex justify-between"><span>Present</span><strong>42</strong></li>
            <li className="flex justify-between"><span>Apologies</span><strong>6</strong></li>
            <li className="flex justify-between"><span>Absent</span><strong>8</strong></li>
          </ul>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Action points</h3>
          <ul className="text-[13px] space-y-sm text-on-surface-variant">
            <li>• Secretary to circulate draft minutes by Friday</li>
            <li>• Treasurer to share Q2 statement</li>
            <li>• Organizer to confirm Family Day venue</li>
          </ul>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Document repository</h3>
          <ul className="text-[13px] space-y-sm">
            <li className="flex justify-between border-b border-outline-variant/40 py-sm">
              <span>Constitution_v3.pdf</span>
              <span className="text-on-surface-variant">v3</span>
            </li>
            <li className="flex justify-between py-sm">
              <span>AGM_Minutes_2025.docx</span>
              <span className="text-on-surface-variant">v1</span>
            </li>
          </ul>
          <button type="button" className="mt-md w-full border border-primary text-primary font-label-bold text-[13px] py-sm rounded-lg">
            Upload official document
          </button>
        </div>
      </div>
    </DashboardShell>
  )
}
