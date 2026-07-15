'use client'

import DashboardShell from '@/components/dashboard/DashboardShell'
import StatCard from '@/components/dashboard/StatCard'
import {
  BudgetUtilChart,
  ChartCard,
  ContributionTrendChart,
} from '@/components/dashboard/Charts'

const NAV = [
  { icon: 'dashboard', label: 'Overview', active: true },
  { icon: 'assignment', label: 'Projects' },
  { icon: 'payments', label: 'Contributions' },
  { icon: 'event', label: 'Activities' },
  { icon: 'forum', label: 'Feedback' },
  { icon: 'gavel', label: 'Approvals' },
  { icon: 'analytics', label: 'Reports' },
]

export default function ExecutiveDashboardPage() {
  return (
    <DashboardShell role="EXECUTIVE" title="Executive Oversight" nav={NAV}>
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-md">
        <StatCard label="Total Members" value="245" icon="group" />
        <StatCard label="Active Members" value="227" icon="verified_user" accent="green" />
        <StatCard label="Pending Registrations" value="18" icon="hourglass_empty" accent="orange" />
        <StatCard label="Total Contributions" value="KES 1.2M" icon="payments" />
        <StatCard label="Ongoing Projects" value="3" icon="assignment" />
        <StatCard label="Upcoming Events" value="4" icon="event" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
            Project status tracker
          </h3>
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-on-surface-variant uppercase text-[11px] tracking-wide">
                <th className="pb-sm">Project</th>
                <th className="pb-sm">Status</th>
                <th className="pb-sm">Budget</th>
                <th className="pb-sm text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {[
                ['Youth Skills Hub', 'Ongoing', 'KES 220k'],
                ['Welfare Support Fund', 'Ongoing', 'KES 180k'],
                ['Community Borehole', 'Upcoming', 'KES 450k'],
              ].map(([name, status, budget]) => (
                <tr key={name}>
                  <td className="py-sm font-label-bold">{name}</td>
                  <td className="py-sm">{status}</td>
                  <td className="py-sm">{budget}</td>
                  <td className="py-sm text-right">
                    <button type="button" className="text-secondary font-label-bold text-[12px] hover:underline">
                      View
                    </button>
                    {status === 'Upcoming' && (
                      <button type="button" className="ml-sm text-primary font-label-bold text-[12px] hover:underline">
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
            Contribution compliance
          </h3>
          <p className="text-[28px] font-bold text-primary">87%</p>
          <p className="text-[13px] text-on-surface-variant mb-md">members up to date</p>
          <div className="h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full w-[87%] bg-secondary-container rounded-full" />
          </div>
          <p className="text-[12px] text-on-surface-variant mt-md">
            Read-only finance view — transactions cannot be edited.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
            Upcoming activities
          </h3>
          <ul className="space-y-sm text-[13px]">
            <li className="flex justify-between border-b border-outline-variant/40 py-sm">
              <span>Executive meeting</span>
              <span className="text-on-surface-variant">Jul 18</span>
            </li>
            <li className="flex justify-between border-b border-outline-variant/40 py-sm">
              <span>Family Day RSVP close</span>
              <span className="text-on-surface-variant">Jul 22</span>
            </li>
            <li className="flex justify-between py-sm">
              <span>Quarterly review</span>
              <span className="text-on-surface-variant">Jul 28</span>
            </li>
          </ul>
        </div>

        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
            Member suggestions
          </h3>
          <ul className="space-y-sm text-[13px] text-on-surface-variant">
            <li>“Add WhatsApp notifications for meetings.” — Peter M.</li>
            <li>“Publish Q2 contribution summary sooner.” — Mary N.</li>
            <li>“Youth mentorship monthly clinic.” — James M.</li>
          </ul>
          <button type="button" className="mt-md text-secondary font-label-bold text-[13px] hover:underline">
            Review feedback
          </button>
        </div>

        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
            Governance approvals
          </h3>
          <ul className="space-y-sm text-[13px]">
            <li className="flex justify-between py-sm border-b border-outline-variant/40">
              <span>Bylaw amendment draft</span>
              <button type="button" className="text-primary font-bold text-[12px]">
                Review
              </button>
            </li>
            <li className="flex justify-between py-sm">
              <span>Q3 budget ceiling</span>
              <button type="button" className="text-primary font-bold text-[12px]">
                Review
              </button>
            </li>
          </ul>
          <button
            type="button"
            className="mt-md w-full bg-primary text-on-primary font-label-bold text-[13px] py-sm rounded-lg"
          >
            Download summary report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <ChartCard title="Contribution trends">
          <ContributionTrendChart />
        </ChartCard>
        <ChartCard title="Project budget utilization">
          <BudgetUtilChart />
        </ChartCard>
        <ChartCard title="Member participation rate">
          <BudgetUtilChart />
        </ChartCard>
      </div>
    </DashboardShell>
  )
}
