import DashboardShell from '@/components/dashboard/DashboardShell'
import { ADMIN_NAV } from '@/lib/dashboard/nav'
import { setMemberDashboardAccess, setMemberStatus } from '@/app/actions/members'
import { prisma } from '@/lib/prisma'
import { ALL_ROLES, ROLE_LABEL } from '@/lib/auth/types'
import type { Role } from '@/lib/auth/types'

export default async function AdminMembersPage() {
  const users = await prisma.user.findMany({
    orderBy: { fullName: 'asc' },
  })

  return (
    <DashboardShell role="ADMIN" title="Members" nav={ADMIN_NAV}>
      <div className="space-y-4 p-4 md:p-6 overflow-x-auto">
        <p className="text-sm text-on-surface-variant">
          Directory of all members. Suspend temporarily blocks login; restore returns them to ACTIVE.
        </p>
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-on-surface-variant border-b">
              <th className="py-2 pr-2">Name</th>
              <th className="pr-2">Email</th>
              <th className="pr-2">Role</th>
              <th className="pr-2">Status</th>
              <th className="pr-2">Extra dashboards</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-outline-variant/30 align-top">
                <td className="py-3 pr-2">
                  <p className="font-medium">{u.fullName}</p>
                  {u.isSuperAdmin && (
                    <span className="text-[10px] uppercase text-secondary font-bold">Super Admin</span>
                  )}
                </td>
                <td className="pr-2">{u.email}</td>
                <td className="pr-2">{ROLE_LABEL[u.role as Role]}</td>
                <td className="pr-2">{u.status}</td>
                <td className="pr-2">
                  <form
                    action={async (fd) => {
                      'use server'
                      const selected = ALL_ROLES.filter((r) => fd.get(`access_${r}`) === 'on')
                      await setMemberDashboardAccess({
                        userId: u.id,
                        dashboardAccess: selected,
                      })
                    }}
                    className="space-y-1"
                  >
                    <div className="flex flex-wrap gap-2 max-w-xs">
                      {ALL_ROLES.filter((r) => r !== u.role).map((r) => (
                        <label key={r} className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            name={`access_${r}`}
                            defaultChecked={u.dashboardAccess.includes(r)}
                          />
                          {r}
                        </label>
                      ))}
                    </div>
                    <button type="submit" className="text-primary text-xs font-semibold">
                      Save access
                    </button>
                  </form>
                </td>
                <td className="space-y-1">
                  {u.status === 'SUSPENDED' ? (
                    <form
                      action={async () => {
                        'use server'
                        await setMemberStatus({ userId: u.id, status: 'ACTIVE' })
                      }}
                    >
                      <button type="submit" className="text-xs px-2 py-1 border rounded-lg">
                        Restore
                      </button>
                    </form>
                  ) : u.status === 'ACTIVE' ? (
                    <form
                      action={async () => {
                        'use server'
                        await setMemberStatus({ userId: u.id, status: 'SUSPENDED' })
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs px-2 py-1 border border-red-300 text-red-700 rounded-lg"
                      >
                        Suspend
                      </button>
                    </form>
                  ) : (
                    <span className="text-xs text-on-surface-variant">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  )
}
