import DashboardShell from '@/components/dashboard/DashboardShell'
import { ADMIN_NAV } from '@/lib/dashboard/nav'
import { setMemberDashboardAccess, setMemberRole, setSuperAdminFlag } from '@/app/actions/members'
import { prisma } from '@/lib/prisma'
import { ALL_ROLES, ROLE_LABEL } from '@/lib/auth/types'
import type { Role } from '@/lib/auth/types'
import { getSessionProfile } from '@/lib/auth/session'

export default async function AdminRolesPage() {
  const actor = await getSessionProfile()
  const users = await prisma.user.findMany({
    where: { status: { in: ['ACTIVE', 'PENDING', 'SUSPENDED'] } },
    orderBy: { fullName: 'asc' },
  })

  return (
    <DashboardShell role="ADMIN" title="Roles & dashboard access" nav={ADMIN_NAV}>
      <div className="space-y-4 p-4 md:p-6 overflow-x-auto">
        <p className="text-sm text-on-surface-variant">
          Primary role sets the home dashboard. Extra dashboard access is for oversight. Only a Super
          Admin can assign the Admin role or Super Admin flag.
        </p>
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-on-surface-variant border-b">
              <th className="py-2">Member</th>
              <th>Primary role</th>
              <th>Dashboard access</th>
              <th>Super Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-outline-variant/30 align-top">
                <td className="py-3 pr-3">
                  <p className="font-medium">{u.fullName}</p>
                  <p className="text-xs text-on-surface-variant">{u.email}</p>
                </td>
                <td className="pr-3">
                  <form
                    action={async (fd) => {
                      'use server'
                      await setMemberRole({
                        userId: u.id,
                        role: String(fd.get('role')) as Role,
                      })
                    }}
                    className="flex gap-2 items-center"
                  >
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="border rounded px-2 py-1 bg-surface"
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="text-primary text-xs font-semibold">
                      Save
                    </button>
                  </form>
                </td>
                <td className="pr-3">
                  <form
                    action={async (fd) => {
                      'use server'
                      const selected = ALL_ROLES.filter((r) => fd.get(`access_${r}`) === 'on')
                      await setMemberDashboardAccess({
                        userId: u.id,
                        dashboardAccess: selected,
                      })
                    }}
                  >
                    <div className="flex flex-wrap gap-2 max-w-sm mb-1">
                      {ALL_ROLES.map((r) => (
                        <label key={r} className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            name={`access_${r}`}
                            defaultChecked={u.dashboardAccess.includes(r) || u.role === r}
                            disabled={u.role === r}
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
                <td>
                  {actor?.isSuperAdmin ? (
                    <form
                      action={async () => {
                        'use server'
                        await setSuperAdminFlag({
                          userId: u.id,
                          isSuperAdmin: !u.isSuperAdmin,
                        })
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs px-2 py-1 border rounded-lg"
                        disabled={u.id === actor.id && u.isSuperAdmin}
                      >
                        {u.isSuperAdmin ? 'Revoke' : 'Grant'}
                      </button>
                    </form>
                  ) : (
                    <span className="text-xs">{u.isSuperAdmin ? 'Yes' : '—'}</span>
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
