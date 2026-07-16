import DashboardShell from '@/components/dashboard/DashboardShell'
import { EXECUTIVE_NAV } from '@/lib/dashboard/nav'
import { getExecutiveDashboardData, getContributionChartSeries } from '@/lib/data/queries'
import { ContributionTrendChart } from '@/components/dashboard/Charts'
import Link from 'next/link'

export default async function ExecutivePage() {
  const data = await getExecutiveDashboardData()
  const chart = await getContributionChartSeries()

  return (
    <DashboardShell role="EXECUTIVE" title="Executive Committee" nav={EXECUTIVE_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Active members', value: data.members },
            {
              label: 'Contributions (KES)',
              value: Math.round(data.totalContributions).toLocaleString(),
            },
            { label: 'Projects', value: data.projects.length },
            { label: 'Upcoming events', value: data.upcomingEvents },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-surface p-4">
              <p className="text-xs text-on-surface-variant uppercase">{s.label}</p>
              <p className="text-2xl font-semibold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Contribution trend</h2>
          <ContributionTrendChart
            labels={chart.labels.length ? chart.labels : ['—']}
            values={chart.values.length ? chart.values : [0]}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Link href="/dashboard/executive/projects" className="rounded-xl border bg-surface p-4">
            <p className="font-semibold">Projects</p>
            <p className="text-sm text-on-surface-variant mt-1">
              {data.projects.length} tracked · manage status and new work
            </p>
          </Link>
          <Link
            href="/dashboard/executive/announcements"
            className="rounded-xl border bg-surface p-4"
          >
            <p className="font-semibold">Announcements</p>
            <p className="text-sm text-on-surface-variant mt-1">
              {data.announcements.length} recent updates
            </p>
          </Link>
        </div>
      </div>
    </DashboardShell>
  )
}
