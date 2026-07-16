import type { NavItem } from '@/components/dashboard/DashboardShell'

export const ADMIN_NAV: NavItem[] = [
  { icon: 'dashboard', label: 'Overview', href: '/admin' },
  { icon: 'group', label: 'Members', href: '/admin/members' },
  { icon: 'pending_actions', label: 'Approvals', href: '/admin/approvals' },
  { icon: 'photo_library', label: 'Gallery queue', href: '/admin/gallery-queue' },
  { icon: 'admin_panel_settings', label: 'Roles', href: '/admin/roles' },
]

export const EXECUTIVE_NAV: NavItem[] = [
  { icon: 'dashboard', label: 'Overview', href: '/dashboard/executive' },
  { icon: 'work', label: 'Projects', href: '/dashboard/executive/projects' },
  { icon: 'campaign', label: 'Announcements', href: '/dashboard/executive/announcements' },
]

export const TREASURER_NAV: NavItem[] = [
  { icon: 'account_balance', label: 'Finance', href: '/dashboard/treasurer' },
  { icon: 'payments', label: 'Contributions', href: '/dashboard/treasurer/contributions' },
  { icon: 'volunteer_activism', label: 'Welfare', href: '/dashboard/treasurer/welfare' },
]

export const SECRETARY_NAV: NavItem[] = [
  { icon: 'description', label: 'Records', href: '/dashboard/secretary' },
  { icon: 'campaign', label: 'Announcements', href: '/dashboard/secretary/announcements' },
  { icon: 'groups', label: 'Meetings', href: '/dashboard/secretary/meetings' },
]

export const ORGANIZER_NAV: NavItem[] = [
  { icon: 'event', label: 'Events', href: '/dashboard/organizer' },
  { icon: 'photo_library', label: 'Gallery', href: '/dashboard/organizer/gallery' },
  { icon: 'work', label: 'Projects', href: '/dashboard/organizer/projects' },
]

export const MEMBER_NAV: NavItem[] = [
  { icon: 'home', label: 'Home', href: '/dashboard/member' },
  { icon: 'payments', label: 'Contributions', href: '/dashboard/member/contributions' },
  { icon: 'volunteer_activism', label: 'Welfare', href: '/dashboard/member/welfare' },
]
