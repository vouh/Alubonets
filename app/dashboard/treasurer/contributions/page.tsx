import DashboardShell from '@/components/dashboard/DashboardShell'
import { TREASURER_NAV } from '@/lib/dashboard/nav'
import { actionCreateContribution } from '@/app/actions/domain'
import { getTreasurerDashboardData } from '@/lib/data/queries'
import CsvImportForm from '@/components/dashboard/CsvImportForm'
import MpesaStkForm from '@/components/dashboard/MpesaStkForm'

export default async function TreasurerContributionsPage() {
  const data = await getTreasurerDashboardData()

  return (
    <DashboardShell role="TREASURER" title="Contributions" nav={TREASURER_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">Record contribution</h2>
          <form action={actionCreateContribution} className="grid gap-3 md:grid-cols-2">
            <select name="userId" required className="border rounded-lg px-3 py-2">
              <option value="">Select member</option>
              {data.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.email})
                </option>
              ))}
            </select>
            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Amount"
              required
              className="border rounded-lg px-3 py-2"
            />
            <input name="category" placeholder="Category" className="border rounded-lg px-3 py-2" />
            <select name="paymentMethod" className="border rounded-lg px-3 py-2">
              <option value="CASH">CASH</option>
              <option value="MPESA">MPESA</option>
              <option value="BANK">BANK</option>
              <option value="OTHER">OTHER</option>
            </select>
            <input name="mpesaRef" placeholder="M-Pesa ref" className="border rounded-lg px-3 py-2" />
            <input
              name="description"
              placeholder="Description"
              className="border rounded-lg px-3 py-2"
            />
            <button className="bg-primary text-on-primary rounded-lg px-4 py-2 md:col-span-2">
              Save contribution
            </button>
          </form>
        </section>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-3">CSV import</h2>
          <p className="text-sm text-on-surface-variant mb-2">
            Columns: email, amount, description, category, paymentMethod, mpesaRef
          </p>
          <CsvImportForm />
        </section>

        <section className="rounded-xl border bg-surface p-4 overflow-x-auto">
          <h2 className="font-semibold mb-3">Recent contributions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-on-surface-variant">
                <th className="py-2">Member</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Ref</th>
                <th>Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="py-2">{c.user.fullName}</td>
                  <td>{c.amount.toLocaleString()}</td>
                  <td>{c.paymentMethod}</td>
                  <td>{c.mpesaRef || '—'}</td>
                  <td>{c.paidAt.toLocaleDateString()}</td>
                  <td>
                    <a className="text-primary underline" href={`/api/pdf/receipt/${c.id}`}>
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border bg-surface p-4">
          <h2 className="font-semibold mb-2">M-Pesa STK Push</h2>
          <MpesaStkForm />
        </section>
      </div>
    </DashboardShell>
  )
}
