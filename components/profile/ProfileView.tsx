'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { updateMyProfile } from '@/app/actions/profile'
import { ROLE_HOME, ROLE_LABEL, type Role } from '@/lib/auth/types'

export type ProfileViewData = {
  id: string
  fullName: string
  email: string
  phone: string | null
  location: string | null
  avatarUrl: string | null
  role: Role
  status: string
  isSuperAdmin: boolean
  initials: string
  contributionCount: number
  contributionTotal: number
  welfareCount: number
  recentContributions: {
    id: string
    amount: number
    category: string | null
    paidAt: string
  }[]
}

export default function ProfileView({ data }: { data: ProfileViewData }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState(data.fullName)
  const [phone, setPhone] = useState(data.phone ?? '')
  const [location, setLocation] = useState(data.location ?? '')
  const [avatarUrl, setAvatarUrl] = useState(data.avatarUrl ?? '')

  const home = ROLE_HOME[data.role]
  const locationLine = data.location?.trim() || 'Alubonets SHG · Kenya'

  const onSave = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await updateMyProfile({
        fullName,
        phone: phone || null,
        location: location || null,
        avatarUrl: avatarUrl || null,
      })
      setEditing(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eef0f6] text-on-surface">
      {/* Banner */}
      <div className="h-[28vh] min-h-[160px] max-h-[220px] bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(176,198,255,0.45), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(254,128,21,0.2), transparent 50%)',
          }}
        />
        <div className="relative z-10 max-w-lg mx-auto px-4 pt-4 flex items-center justify-between">
          <Link
            href={home}
            className="inline-flex items-center gap-1 text-primary-fixed-dim/90 text-sm font-label-bold hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Dashboard
          </Link>
        </div>
      </div>

      <div className="relative max-w-lg mx-auto px-4 -mt-16 pb-16 space-y-4">
        {/* Main card */}
        <section className="bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,31,80,0.12)] px-5 pt-2 pb-6 relative">
          {/* Avatar overlapping banner */}
          <div className="flex justify-center -mt-12 mb-2">
            {data.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.avatarUrl}
                alt=""
                className="h-[104px] w-[104px] rounded-full object-cover border-[5px] border-white shadow-md bg-surface-container"
              />
            ) : (
              <div className="h-[104px] w-[104px] rounded-full border-[5px] border-white shadow-md bg-primary text-on-primary flex items-center justify-center font-h3 text-[32px]">
                {data.initials}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('profile-history')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-1.5 text-primary font-label-bold text-[12px] tracking-wide uppercase hover:opacity-80"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              History
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing((v) => !v)
                setError('')
                setFullName(data.fullName)
                setPhone(data.phone ?? '')
                setLocation(data.location ?? '')
                setAvatarUrl(data.avatarUrl ?? '')
              }}
              className="inline-flex items-center gap-1.5 text-primary font-label-bold text-[12px] tracking-wide uppercase hover:opacity-80"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit
            </button>
          </div>

          <div className="text-center px-2">
            <h1 className="font-h2 text-[28px] leading-tight text-on-surface tracking-tight">
              {data.fullName}
            </h1>
            <p className="mt-1 text-[14px] text-on-surface-variant">{locationLine}</p>
            <p className="mt-1 text-[13px] text-on-surface-variant/80">
              {data.email}
              {data.phone ? ` · ${data.phone}` : ''}
            </p>
            <p className="mt-2 text-[12px] text-on-surface-variant">
              {ROLE_LABEL[data.role]}
              {data.isSuperAdmin ? ' · Super Admin' : ''} · {data.status}
            </p>
          </div>

          {editing && (
            <form onSubmit={onSave} className="mt-5 space-y-3 border-t border-outline-variant/40 pt-4">
              <div>
                <label className="text-[12px] font-label-bold text-on-surface-variant">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-[12px] font-label-bold text-on-surface-variant">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-[12px] font-label-bold text-on-surface-variant">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Nairobi, Kenya"
                  className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-[12px] font-label-bold text-on-surface-variant">
                  Avatar URL
                </label>
                <input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
                />
              </div>
              {error && <p className="text-error text-[12px] text-center">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 border rounded-full py-2.5 text-sm font-label-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-on-primary rounded-full py-2.5 text-sm font-label-bold disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-outline-variant/50 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[22px] font-h3 font-bold text-on-surface leading-none">
                {data.contributionCount}
              </p>
              <p className="mt-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant font-label-bold">
                Contributions
              </p>
            </div>
            <div>
              <p className="text-[22px] font-h3 font-bold text-on-surface leading-none">
                {Math.round(data.contributionTotal).toLocaleString()}
              </p>
              <p className="mt-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant font-label-bold">
                KES total
              </p>
            </div>
            <div>
              <p className="text-[22px] font-h3 font-bold text-on-surface leading-none">
                {data.welfareCount}
              </p>
              <p className="mt-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant font-label-bold">
                Welfare
              </p>
            </div>
          </div>
        </section>

        {/* Membership card */}
        <section className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,31,80,0.08)] px-4 py-3.5 flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-secondary-container text-[22px] icon-fill">
              verified
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-bold text-[13px] uppercase tracking-wide text-on-surface">
              Membership
            </p>
            <p className="text-[12px] text-on-surface-variant truncate">
              {ROLE_LABEL[data.role]} · {data.status}
              {data.contributionTotal > 0
                ? ` · KES ${Math.round(data.contributionTotal).toLocaleString()} contributed`
                : ''}
            </p>
          </div>
          <p className="text-[10px] text-on-surface-variant text-right max-w-[110px] leading-snug hidden sm:block">
            Keep contributions current to stay in good standing.
          </p>
        </section>

        {/* History */}
        <section id="profile-history" className="pt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-h3 text-[20px] text-on-surface">Contribution history</h2>
            <Link
              href={
                data.role === 'MEMBER'
                  ? '/dashboard/member/contributions'
                  : data.role === 'TREASURER'
                    ? '/dashboard/treasurer/contributions'
                    : home
              }
              className="text-primary font-label-bold text-[12px] uppercase tracking-wide hover:opacity-80"
            >
              Open
            </Link>
          </div>
          {data.recentContributions.length === 0 ? (
            <p className="text-sm text-on-surface-variant px-1">No contributions recorded yet.</p>
          ) : (
            <ul className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,31,80,0.06)] divide-y divide-outline-variant/40 overflow-hidden">
              {data.recentContributions.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{c.category || 'Contribution'}</p>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(c.paidAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-bold">KES {c.amount.toLocaleString()}</p>
                    <a
                      href={`/api/pdf/receipt/${c.id}`}
                      className="text-[11px] text-primary underline"
                    >
                      Receipt
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
