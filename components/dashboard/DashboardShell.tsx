'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { ADMIN_SIDEBAR_LOGO } from '@/lib/constants'
import { logoutRequest, meRequest, type AuthUser, type Role } from '@/lib/auth/client'
import { ROLE_LABEL } from '@/lib/auth/types'
import DashboardNav from './DashboardNav'
import WorkspaceSwitcher from './WorkspaceSwitcher'

export type NavItem = {
  icon: string
  label: string
  href?: string
  badge?: string
  active?: boolean
}

type Props = {
  role: Role
  title: string
  nav: NavItem[]
  children: ReactNode
}

export default function DashboardShell({ role, title, nav, children }: Props) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isDark, setIsDark] = useState(false)
  const [welcome, setWelcome] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('adminTheme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved === 'dark' || (!saved && prefersDark)
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  useEffect(() => {
    meRequest().then((u) => {
      if (!u) {
        router.replace('/login')
        return
      }
      setUser(u)
      const hour = new Date().getHours()
      const g = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
      setWelcome(`${g}, ${u.fullName.split(' ')[0]}.`)
    })
  }, [router])

  useEffect(() => {
    document.body.classList.add('overflow-hidden', 'h-full')
    return () => document.body.classList.remove('overflow-hidden', 'h-full')
  }, [])

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('adminTheme', next ? 'dark' : 'light')
    setIsDark(next)
  }

  const onLogout = async () => {
    await logoutRequest()
    router.push('/login')
    router.refresh()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#060c1a] flex items-center justify-center">
        <p className="text-on-surface-variant text-sm">Loading dashboard…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background text-on-background dark:bg-[#060c1a] dark:text-blue-50">
      <aside className="bg-primary dark:bg-[#0c1e42] text-on-primary w-56 fixed left-0 top-0 h-screen flex flex-col z-50 border-r border-white/[0.08] shadow-[2px_0_16px_rgba(0,0,0,0.28)]">
        <div className="px-md pt-lg pb-md flex items-center gap-sm border-b border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ADMIN_SIDEBAR_LOGO}
            alt="Alubonets"
            className="h-11 w-11 rounded-full bg-white/10 p-1 flex-shrink-0"
          />
          <div>
            <p className="font-h3 text-[19px] font-bold text-on-primary leading-none">Alubonets</p>
            <p className="text-[11px] text-primary-fixed-dim/60 mt-0.5 font-caption">
              {ROLE_LABEL[role]}
            </p>
          </div>
        </div>

        <DashboardNav nav={nav} />

        <div className="px-md py-md border-t border-white/10 space-y-sm">
          <Link
            href="/"
            className="flex items-center gap-sm text-primary-fixed-dim/60 hover:text-on-primary text-[13px] font-body-md transition-colors w-full"
          >
            <span className="material-symbols-outlined text-[17px]">public</span>
            Public site
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-sm text-primary-fixed-dim/60 hover:text-on-primary text-[13px] font-body-md transition-colors w-full group"
          >
            <span className="material-symbols-outlined text-[17px] group-hover:text-secondary-container transition-colors">
              logout
            </span>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="ml-56 flex-1 flex flex-col min-h-screen min-w-0">
        <header
          className="bg-surface-container-lowest dark:bg-[#0d1729] border-b border-outline-variant dark:border-[#1a2d4f] sticky top-0 z-40 flex items-center justify-between px-lg"
          style={{ height: 52 }}
        >
          <div className="relative flex-1 max-w-xs">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              style={{ fontSize: 17 }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search…"
              className="w-full pl-9 pr-md py-1.5 bg-surface-container dark:bg-[#111f36] dark:text-blue-50 rounded-lg border border-outline-variant/60 dark:border-[#1e3461] focus:outline-none focus:ring-1 focus:ring-primary text-[13px] font-body-md"
            />
          </div>
          <div className="flex items-center gap-md">
            <WorkspaceSwitcher user={user} />
            <button
              type="button"
              onClick={toggleTheme}
              className="text-on-surface-variant dark:text-blue-200/60 hover:text-primary transition-colors"
              title="Toggle theme"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              type="button"
              className="relative text-on-surface-variant dark:text-blue-200/60 hover:text-primary transition-colors"
              title="Notifications"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                notifications
              </span>
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[9px] font-bold px-1 rounded-full leading-[14px]">
                3
              </span>
            </button>
            <Link
              href="/profile"
              className="flex items-center gap-sm hover:opacity-90 transition-opacity"
              title="My profile"
            >
              <div className="text-right hidden sm:block">
                <p className="font-label-bold text-[12px] text-on-surface dark:text-blue-50 leading-tight">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-on-surface-variant">{ROLE_LABEL[user.role]}</p>
              </div>
              <div className="h-8 w-8 rounded-full border border-outline-variant bg-primary text-on-primary flex items-center justify-center font-label-bold text-[12px]">
                {user.initials}
              </div>
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-secondary-container/40 bg-secondary-container text-on-primary px-md py-1.5 font-label-bold text-[12px] hover:opacity-90 active:scale-95 transition-all shadow-sm"
              title="Sign out"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                logout
              </span>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-lg space-y-lg overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-h2 text-h2 text-primary dark:text-primary-fixed-dim">{title}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-blue-200/60 mt-xs">
                {welcome}
              </p>
            </div>
            <span className="font-caption text-caption text-on-surface-variant bg-surface-container dark:bg-[#0d1729] px-md py-xs rounded-full border border-outline-variant dark:border-[#1a2d4f]">
              July 2026
            </span>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
