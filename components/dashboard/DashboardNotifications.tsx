'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

type NotifItem = {
  id: string
  type: 'event' | 'project' | 'gallery'
  title: string
  description: string
  imageUrl: string | null
  href: string
  createdAt: string
}

const SEEN_KEY = 'alubonets-notif-seen-v1'
const SEEN_TTL = 24 * 60 * 60 * 1000   // 24 hrs — once dismissed, gone for 24 hrs
const ITEM_TTL = 48 * 60 * 60 * 1000   // 48 hrs — items older than this never show

function getSeenMap(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '{}') }
  catch { return {} }
}

function saveSeen(map: Record<string, number>) {
  localStorage.setItem(SEEN_KEY, JSON.stringify(map))
}

function markSeen(id: string) {
  const map = getSeenMap()
  map[id] = Date.now()
  // prune entries older than ITEM_TTL
  const cutoff = Date.now() - ITEM_TTL
  for (const k of Object.keys(map)) if (map[k] < cutoff) delete map[k]
  saveSeen(map)
}

function isRecentlySeen(id: string): boolean {
  const ts = getSeenMap()[id]
  return !!ts && Date.now() - ts < SEEN_TTL
}

const CFG = {
  event:   { icon: 'event',         label: 'New event',   bg: 'bg-primary/10',     color: 'text-primary' },
  project: { icon: 'work',          label: 'New project', bg: 'bg-green-100 dark:bg-green-900/20', color: 'text-green-700 dark:text-green-400' },
  gallery: { icon: 'photo_library', label: 'New photo',   bg: 'bg-purple-100 dark:bg-purple-900/20', color: 'text-purple-700 dark:text-purple-400' },
}

export default function DashboardNotifications() {
  const [items, setItems] = useState<NotifItem[]>([])

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then(({ items: fetched }: { items: NotifItem[] }) => {
        setItems(fetched.filter((i) => !isRecentlySeen(i.id)))
      })
      .catch(() => {})
  }, [])

  const dismiss = useCallback((id: string) => {
    markSeen(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setItems((prev) => { prev.forEach((i) => markSeen(i.id)); return [] })
  }, [])

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[300] flex flex-col gap-2 w-[300px]">
      {items.length > 1 && (
        <div className="flex justify-end">
          <button
            onClick={dismissAll}
            className="text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full border border-outline-variant/40 shadow-sm"
          >
            Dismiss all ({items.length})
          </button>
        </div>
      )}
      {items.slice(0, 4).map((item) => (
        <NotifCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
      ))}
    </div>
  )
}

function NotifCard({ item, onDismiss }: { item: NotifItem; onDismiss: () => void }) {
  const cfg = CFG[item.type]

  useEffect(() => {
    const t = setTimeout(onDismiss, 12_000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface dark:bg-[#0d1729] shadow-2xl overflow-hidden animate-in slide-in-from-right-4 fade-in duration-300">
      {/* Body */}
      <div className="p-3.5 flex items-start gap-3">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
            <span className={`material-symbols-outlined icon-fill ${cfg.color}`} style={{ fontSize: 22 }}>
              {cfg.icon}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${cfg.color}`}>{cfg.label}</p>
          <p className="text-[13px] font-semibold text-on-surface dark:text-blue-50 leading-snug line-clamp-2">{item.title}</p>
          <p className="text-[11px] text-on-surface-variant dark:text-blue-200/50 mt-0.5 line-clamp-1">{item.description}</p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-outline hover:text-on-surface transition-colors mt-0.5"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
        </button>
      </div>
      {/* Footer link */}
      <Link
        href={item.href}
        onClick={onDismiss}
        className="flex items-center justify-between px-3.5 py-2 bg-surface-container dark:bg-[#111f36] border-t border-outline-variant/30 hover:bg-surface-container-high dark:hover:bg-[#1a2d4f] transition-colors"
      >
        <span className="text-[12px] font-semibold text-primary">View details</span>
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>arrow_forward</span>
      </Link>
    </div>
  )
}
