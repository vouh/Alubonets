import DashboardShell from '@/components/dashboard/DashboardShell'
import { TREASURER_NAV } from '@/lib/dashboard/nav'
import { getTreasurerDashboardData, getContributionChartSeries } from '@/lib/data/queries'
import { BudgetDoughnutChart, ContributionTrendChart } from '@/components/dashboard/Charts'
import Link from 'next/link'

export default async function TreasurerPage() {
  const data = await getTreasurerDashboardData()
  const chart = await getContributionChartSeries()
  const catLabels = data.byCategory.map((c) => c.category || 'Uncategorized')
  const catValues = data.byCategory.map((c) => c._sum.amount ?? 0)

  return (
    <DashboardShell role="TREASURER" title="Treasurer Finance" nav={TREASURER_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Total (KES)', value: Math.round(data.total).toLocaleString() },
            { label: 'This month', value: Math.round(data.monthTotal).toLocaleString() },
            { label: 'Records', value: data.count },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-surface p-4">
              <p className="text-xs text-on-surface-variant uppercase">{s.label}</p>
              <p className="text-2xl font-semibold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-surface p-4">
            <h2 className="font-semibold mb-3">Trend</h2>
            <ContributionTrendChart
              labels={chart.labels.length ? chart.labels : ['—']}
              values={chart.values.length ? chart.values : [0]}
            />
          </div>
          <div className="rounded-xl border bg-surface p-4">
            <h2 className="font-semibold mb-3">By category</h2>
            <BudgetDoughnutChart
              labels={catLabels.length ? catLabels : ['None']}
              values={catValues.length ? catValues : [0]}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Link
            href="/dashboard/treasurer/contributions"
            className="rounded-xl border bg-surface p-4"
          >
            <p className="font-semibold">Contributions</p>
            <p className="text-sm text-on-surface-variant mt-1">
              Record, import CSV, receipts, M-Pesa
            </p>
          </Link>
          <Link href="/dashboard/treasurer/welfare" className="rounded-xl border bg-surface p-4">
            <p className="font-semibold">Welfare</p>
            <p className="text-sm text-on-surface-variant mt-1">
              {data.pendingWelfare.length} pending review
              {data.pendingWelfare.length === 1 ? '' : 's'}
            </p>
          </Link>
        </div>
      </div>
    </DashboardShell>
  )
}
