'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { type FormEvent, useEffect, useState } from 'react'
import { ADMIN_LOGIN_LOGO } from '@/lib/constants'
import { homeForRole, loginRequest, meRequest, type AuthUser } from '@/lib/auth/client'
import { TEST_ACCOUNTS } from '@/lib/auth/users'

type Props = {
  title?: string
  showTestAccounts?: boolean
}

export default function LoginForm({ title = 'Member Login', showTestAccounts = true }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('admin@alubonets.com')
  const [password, setPassword] = useState('admin123')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    meRequest().then((user: AuthUser | null) => {
      if (user) {
        const next = searchParams.get('next')
        router.replace(next && next.startsWith('/') ? next : homeForRole(user.role))
      }
    })
  }, [router, searchParams])

  const onLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user, redirectTo } = await loginRequest(email, password)
      const next = searchParams.get('next')
      if (next && next.startsWith('/')) {
        router.push(next)
      } else {
        router.push(redirectTo || homeForRole(user.role))
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fill = (e: string, p: string) => {
    setEmail(e)
    setPassword(p)
    setError('')
  }

  return (
    <div className="fixed inset-0 z-[200] bg-primary flex items-center justify-center min-h-screen px-md overflow-y-auto py-xl">
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center">
          <div className="mb-[-30px] relative z-10 bg-surface rounded-2xl px-md py-sm shadow-xl border border-outline-variant/30">
            <img src={ADMIN_LOGIN_LOGO} alt="Alubonets SHG" className="h-12 w-auto object-contain" />
          </div>
        </div>
        <div className="bg-surface rounded-2xl pt-[52px] pb-lg px-lg shadow-2xl border border-white/10">
          <div className="text-center mb-lg">
            <h1 className="font-h3 text-h3 text-secondary-container">{title}</h1>
            <p className="font-caption text-caption text-on-surface-variant mt-xs">
              Sign in with your role account — JWT session redirect
            </p>
          </div>
          <form onSubmit={onLogin} className="flex flex-col gap-md">
            <div>
              <label className="block font-label-bold text-label-bold text-on-surface-variant mb-xs text-[13px]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@alubonets.com"
                required
                className="w-full px-md py-[10px] bg-surface border border-secondary-container rounded-lg text-on-surface placeholder-on-surface/30 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary-container/40 font-body-md text-[14px] transition-all"
              />
            </div>
            <div>
              <label className="block font-label-bold text-label-bold text-on-surface-variant mb-xs text-[13px]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-md py-[10px] pr-[44px] bg-surface border border-secondary-container rounded-lg text-on-surface placeholder-on-surface/30 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary-container/40 font-body-md text-[14px] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-sm top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-xs"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPw ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            {error && (
              <p className="text-error text-center font-caption text-caption text-[12px]">{error}</p>
            )}
            <div className="flex justify-center mt-xs">
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary-container text-on-secondary font-label-bold text-label-bold py-[11px] px-xl rounded-full hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-sm min-h-[44px] shadow-md disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[17px]">lock_open</span>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </div>
          </form>

          {showTestAccounts && (
            <div className="mt-lg pt-md border-t border-outline-variant/40">
              <p className="font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider mb-sm text-center">
                Test emails (no email service required)
              </p>
              <div className="flex flex-col gap-xs max-h-48 overflow-y-auto">
                {TEST_ACCOUNTS.map(a => (
                  <button
                    key={a.email}
                    type="button"
                    onClick={() => fill(a.email, a.password)}
                    className="text-left px-sm py-xs rounded-lg hover:bg-surface-container text-[12px] font-body-md text-on-surface border border-transparent hover:border-outline-variant/50 transition-colors"
                  >
                    <span className="font-semibold text-primary">{a.role}</span>
                    <span className="text-on-surface-variant"> — {a.email} / {a.password}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="text-center mt-lg">
          <Link
            href="/"
            className="font-caption text-caption text-primary-fixed-dim/50 hover:text-primary-fixed-dim transition-colors"
          >
            ← Return to public site
          </Link>
        </p>
      </div>
    </div>
  )
}
