import type { AuthUser, Role } from './types'

/** Local test accounts — used when email/DB services are not connected */
export type TestAccount = AuthUser & { password: string }

export const TEST_ACCOUNTS: TestAccount[] = [
  {
    id: 'usr_admin',
    email: 'admin@alubonets.com',
    password: 'admin123',
    fullName: 'Gina Admin',
    role: 'ADMIN',
    initials: 'GA',
  },
  {
    id: 'usr_executive',
    email: 'executive@alubonets.com',
    password: 'exec123',
    fullName: 'James Executive',
    role: 'EXECUTIVE',
    initials: 'JE',
  },
  {
    id: 'usr_treasurer',
    email: 'treasurer@alubonets.com',
    password: 'treas123',
    fullName: 'David Treasurer',
    role: 'TREASURER',
    initials: 'DT',
  },
  {
    id: 'usr_secretary',
    email: 'secretary@alubonets.com',
    password: 'sec123',
    fullName: 'Sarah Secretary',
    role: 'SECRETARY',
    initials: 'SS',
  },
  {
    id: 'usr_organizer',
    email: 'organizer@alubonets.com',
    password: 'org123',
    fullName: 'Mary Organizer',
    role: 'ORGANIZER',
    initials: 'MO',
  },
  {
    id: 'usr_member',
    email: 'member@alubonets.com',
    password: 'member123',
    fullName: 'Peter Member',
    role: 'MEMBER',
    initials: 'PM',
  },
]

export function findTestAccount(email: string, password: string): AuthUser | null {
  const account = TEST_ACCOUNTS.find(
    a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
  )
  if (!account) return null
  const { password: _pw, ...user } = account
  return user
}

export function accountsForRole(role: Role) {
  return TEST_ACCOUNTS.filter(a => a.role === role).map(({ password: _pw, ...u }) => u)
}
