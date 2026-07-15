'use client'

import DashboardShell from '@/components/dashboard/DashboardShell'
import StatCard from '@/components/dashboard/StatCard'
import { ChartCard, IncomeExpenseChart, ContributionTrendChart } from '@/components/dashboard/Charts'

const NAV = [
  { icon: 'dashboard', label: 'Finance Home', active: true },
  { icon: 'payments', label: 'Contributions' },
  { icon: 'receipt_long', label: 'Reconciliation' },
  { icon: 'request_quote', label: 'Expenses' },
  { icon: 'description', label: 'Statements' },
  { icon: 'upload_file', label: 'CSV Import' },
  { icon: 'analytics', label: 'Reports' },
]

export default function TreasurerDashboardPage() {
  return (
    <DashboardShell role="TREASURER" title="Treasurer Finance" nav={NAV}>
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-md">
        <StatCard label="Total Contributions" value="KES 1.2M" icon="account_balance" />
        <StatCard label="Today's Collections" value="KES 45,000" icon="today" accent="green" />
        <StatCard label="Pending Reconciliation" value="7" icon="sync_problem" accent="orange" />
        <StatCard label="Welfare Disbursements" value="KES 120k" icon="volunteer_activism" />
        <StatCard label="Project Expenses" value="KES 350k" icon="payments" />
        <StatCard label="Cash Balance" value="KES 730k" icon="savings" accent="green" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
            Record contribution
          </h3>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <input className="auth-field !rounded-lg" placeholder="Member name / ID" />
            <input className="auth-field !rounded-lg" placeholder="Amount (KES)" type="number" />
            <input className="auth-field !rounded-lg" placeholder="M-Pesa ref (optional)" />
            <input className="auth-field !rounded-lg" placeholder="Description" />
            <button
              type="button"
              className="sm:col-span-2 bg-primary text-on-primary font-label-bold text-[13px] py-sm rounded-lg"
            >
              Record contribution
            </button>
          </form>
        </div>

        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">
            Add expense
          </h3>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <input className="auth-field !rounded-lg" placeholder="Expense category" />
            <input className="auth-field !rounded-lg" placeholder="Amount (KES)" type="number" />
            <input className="auth-field !rounded-lg sm:col-span-2" placeholder="Attach receipt URL" />
            <button
              type="button"
              className="sm:col-span-2 bg-secondary-container text-on-primary font-label-bold text-[13px] py-sm rounded-lg"
            >
              Add expense
            </button>
          </form>
        </div>
      </div>

      <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] overflow-hidden">
        <div className="px-lg py-md border-b border-outline-variant/40 flex justify-between items-center">
          <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim">
            Payment reconciliation
          </h3>
          <button type="button" className="text-secondary font-label-bold text-[13px] hover:underline">
            Reconcile payment
          </button>
        </div>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-surface-container-low text-[11px] uppercase text-on-surface-variant">
              <th className="px-lg py-sm">Ref</th>
              <th className="px-lg py-sm">Member</th>
              <th className="px-lg py-sm">Amount</th>
              <th className="px-lg py-sm">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {[
              ['MPESA-88321', 'Jane Auma', '2,000', 'Pending'],
              ['MPESA-88318', 'John Otieno', '1,500', 'Pending'],
              ['BANK-4412', 'Faith Wanjiru', '5,000', 'Matched'],
            ].map(row => (
              <tr key={row[0]}>
                <td className="px-lg py-sm font-label-bold">{row[0]}</td>
                <td className="px-lg py-sm">{row[1]}</td>
                <td className="px-lg py-sm">KES {row[2]}</td>
                <td className="px-lg py-sm">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
          <h3 className="font-h3 text-[18px] text-primary mb-md">Financial statements</h3>
          <div className="flex flex-wrap gap-sm">
            {['Generate statement', 'Export PDF', 'Export Excel/CSV', 'CSV import'].map(a => (
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
        <ChartCard title="Monthly collections">
          <ContributionTrendChart />
        </ChartCard>
        <ChartCard title="Income vs expenses">
          <IncomeExpenseChart />
        </ChartCard>
      </div>
    </DashboardShell>
  )
}
