import DashboardShell from '@/components/dashboard/DashboardShell'
import { ADMIN_NAV } from '@/lib/dashboard/nav'
import { getAdminDashboardData, getContributionChartSeries } from '@/lib/data/queries'
import {
  ApprovalStatusChart,
  ContributionTrendChart,
  MemberGrowthChart,
} from '@/components/dashboard/Charts'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatAuditAction } from '@/lib/audit-labels'

export default async function AdminPage() {
  const data = await getAdminDashboardData()
  const chart = await getContributionChartSeries()
  const statusCounts = await prisma.user.groupBy({
    by: ['status'],
    _count: true,
  })
  const statusMap = Object.fromEntries(statusCounts.map((s) => [s.status, s._count]))

  return (
    <DashboardShell role="ADMIN" title="Administrator" nav={ADMIN_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total members', value: data.totalMembers, href: '/admin/members' },
            { label: 'Active', value: data.activeMembers, href: '/admin/members' },
            { label: 'Pending', value: data.pendingMembers, href: '/admin/approvals' },
            {
              label: 'Contributions (KES)',
              value: Math.round(data.totalContributions).toLocaleString(),
              href: null,
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-outline-variant/40 bg-surface p-4">
              <p className="text-xs text-on-surface-variant uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-semibold mt-1">{s.value}</p>
              {s.href && (
                <Link href={s.href} className="text-xs text-primary mt-2 inline-block">
                  Open →
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-outline-variant/40 bg-surface p-4">
            <h2 className="font-semibold mb-3">Contribution trend</h2>
            <ContributionTrendChart
              labels={chart.labels.length ? chart.labels : ['—']}
              values={chart.values.length ? chart.values : [0]}
            />
          </div>
          <div className="rounded-xl border border-outline-variant/40 bg-surface p-4">
            <h2 className="font-semibold mb-3">Membership status</h2>
            <ApprovalStatusChart
              labels={['ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED']}
              values={[
                statusMap.ACTIVE ?? 0,
                statusMap.PENDING ?? 0,
                statusMap.INACTIVE ?? 0,
                statusMap.SUSPENDED ?? 0,
              ]}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          <Link
            href="/profile"
            className="rounded-xl border border-outline-variant/40 bg-surface p-4 hover:border-primary/40 transition-colors"
          >
            <p className="font-semibold">My profile</p>
            <p className="text-sm text-on-surface-variant mt-1">
              Name, photo, contributions summary
            </p>
          </Link>
          <Link
            href="/admin/approvals"
            className="rounded-xl border border-outline-variant/40 bg-surface p-4 hover:border-primary/40 transition-colors"
          >
            <p className="font-semibold">Approvals</p>
            <p className="text-sm text-on-surface-variant mt-1">
              {data.pendingMembers} pending registration{data.pendingMembers === 1 ? '' : 's'}
            </p>
          </Link>
          <Link
            href="/admin/gallery-queue"
            className="rounded-xl border border-outline-variant/40 bg-surface p-4 hover:border-primary/40 transition-colors"
          >
            <p className="font-semibold">Gallery queue</p>
            <p className="text-sm text-on-surface-variant mt-1">
              {data.galleryQueue.length} awaiting publish
            </p>
          </Link>
          <Link
            href="/admin/roles"
            className="rounded-xl border border-outline-variant/40 bg-surface p-4 hover:border-primary/40 transition-colors"
          >
            <p className="font-semibold">Roles & access</p>
            <p className="text-sm text-on-surface-variant mt-1">Assign primary role and dashboards</p>
          </Link>
        </div>

        <section className="rounded-xl border border-outline-variant/40 bg-surface p-4">
          <div className="flex items-center justify-between mb-3 gap-3">
            <h2 className="font-semibold">Recent activity</h2>
            <Link
              href="/admin/audit-logs"
              className="text-sm font-label-bold text-secondary-container hover:opacity-80"
            >
              View all →
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {data.recentAudit.length === 0 ? (
              <li className="text-on-surface-variant">No activity yet.</li>
            ) : (
              data.recentAudit.map((a) => (
                <li key={a.id} className="border-b border-outline-variant/20 pb-2">
                  <span className="font-medium">{formatAuditAction(a.action)}</span>
                  <span className="text-on-surface-variant">
                    {' '}
                    by {a.user.fullName} · {a.createdAt.toLocaleString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <div className="rounded-xl border border-outline-variant/40 bg-surface p-4">
          <h2 className="font-semibold mb-3">Open welfare requests</h2>
          <p className="text-2xl font-semibold">{data.openWelfare}</p>
          <MemberGrowthChart
            labels={['Active', 'Pending']}
            values={[data.activeMembers, data.pendingMembers]}
          />
        </div>
      </div>
    </DashboardShell>
  )
}
