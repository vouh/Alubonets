import type { NavItem } from '@/components/dashboard/DashboardShell'
import type { Role } from '@/lib/auth/types'

const PROFILE_NAV: NavItem = { icon: 'account_circle', label: 'My profile', href: '/profile' }
const CONTRIBUTIONS_NAV: NavItem = {
  icon: 'payments',
  label: 'Contributions',
  href: '/contributions',
}

export const ADMIN_NAV: NavItem[] = [
  { icon: 'dashboard', label: 'Overview', href: '/admin' },
  { icon: 'group', label: 'Members', href: '/admin/members' },
  { icon: 'pending_actions', label: 'Approvals', href: '/admin/approvals' },
  { icon: 'photo_library', label: 'Gallery queue', href: '/admin/gallery-queue' },
  { icon: 'admin_panel_settings', label: 'Roles', href: '/admin/roles' },
  CONTRIBUTIONS_NAV,
  PROFILE_NAV,
]

export const EXECUTIVE_NAV: NavItem[] = [
  { icon: 'dashboard', label: 'Overview', href: '/dashboard/executive' },
  { icon: 'work', label: 'Projects', href: '/dashboard/executive/projects' },
  { icon: 'campaign', label: 'Announcements', href: '/dashboard/executive/announcements' },
  CONTRIBUTIONS_NAV,
  PROFILE_NAV,
]

export const TREASURER_NAV: NavItem[] = [
  { icon: 'account_balance', label: 'Finance', href: '/dashboard/treasurer' },
  { icon: 'payments', label: 'Contributions', href: '/dashboard/treasurer/contributions' },
  { icon: 'volunteer_activism', label: 'Welfare', href: '/dashboard/treasurer/welfare' },
  { icon: 'savings', label: 'My contributions', href: '/contributions' },
  PROFILE_NAV,
]

export const SECRETARY_NAV: NavItem[] = [
  { icon: 'description', label: 'Records', href: '/dashboard/secretary' },
  { icon: 'campaign', label: 'Announcements', href: '/dashboard/secretary/announcements' },
  { icon: 'groups', label: 'Meetings', href: '/dashboard/secretary/meetings' },
  CONTRIBUTIONS_NAV,
  PROFILE_NAV,
]

export const ORGANIZER_NAV: NavItem[] = [
  { icon: 'event', label: 'Events', href: '/dashboard/organizer' },
  { icon: 'photo_library', label: 'Gallery', href: '/dashboard/organizer/gallery' },
  { icon: 'work', label: 'Projects', href: '/dashboard/organizer/projects' },
  CONTRIBUTIONS_NAV,
  PROFILE_NAV,
]

export const MEMBER_NAV: NavItem[] = [
  { icon: 'home', label: 'Home', href: '/dashboard/member' },
  CONTRIBUTIONS_NAV,
  { icon: 'volunteer_activism', label: 'Welfare', href: '/dashboard/member/welfare' },
  PROFILE_NAV,
]

export function navForRole(role: Role): NavItem[] {
  switch (role) {
    case 'ADMIN':
      return ADMIN_NAV
    case 'EXECUTIVE':
      return EXECUTIVE_NAV
    case 'TREASURER':
      return TREASURER_NAV
    case 'SECRETARY':
      return SECRETARY_NAV
    case 'ORGANIZER':
      return ORGANIZER_NAV
    case 'MEMBER':
    default:
      return MEMBER_NAV
  }
}
