import DashboardShell from '@/components/dashboard/DashboardShell'
import { MEMBER_NAV } from '@/lib/dashboard/nav'
import { getMemberDashboardData } from '@/lib/data/queries'
import { getSessionProfile } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function MemberContributionsPage() {
  const profile = await getSessionProfile()
  if (!profile) redirect('/login')
  const data = await getMemberDashboardData(profile.id)

  return (
    <DashboardShell role="MEMBER" title="My contributions" nav={MEMBER_NAV}>
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-on-surface-variant">
            Total: KES {Math.round(data.total).toLocaleString()}
          </p>
          <a href={`/api/pdf/statement/${profile.id}`} className="text-sm text-primary underline">
            Statement PDF
          </a>
        </div>
        <section className="rounded-xl border bg-surface p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-on-surface-variant">
                <th className="py-2">Date</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {data.contributions.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="py-2">{c.paidAt.toLocaleDateString()}</td>
                  <td>{c.amount.toLocaleString()}</td>
                  <td>{c.category || '—'}</td>
                  <td>
                    <a href={`/api/pdf/receipt/${c.id}`} className="text-primary underline">
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardShell>
  )
}
