'use client'

import { useEffect, useRef, useState } from 'react'
import { actionSendAnnouncement } from '@/app/actions/domain'

type MemberOption = {
  id: string
  fullName: string
  email: string
}

export default function AnnouncementComposer({ members }: { members: MemberOption[] }) {
  const [audience, setAudience] = useState<'ALL' | 'SELECTED'>('ALL')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pickerOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [pickerOpen])

  const toggleMember = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectedLabel =
    selected.size === 0
      ? 'Select members…'
      : selected.size === 1
        ? members.find((m) => selected.has(m.id))?.fullName || '1 member'
        : `${selected.size} members selected`

  return (
    <form action={actionSendAnnouncement} className="grid gap-3">
      <input name="title" placeholder="Title" required className="border rounded-lg px-3 py-2" />
      <textarea
        name="content"
        placeholder="Write your announcement…"
        required
        rows={3}
        className="border rounded-lg px-3 py-2"
      />

      <input type="hidden" name="audience" value={audience} />
      {audience === 'SELECTED' &&
        [...selected].map((id) => <input key={id} type="hidden" name="memberIds" value={id} />)}

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name="audienceChoice"
            checked={audience === 'ALL'}
            onChange={() => setAudience('ALL')}
          />
          Broadcast to all members
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name="audienceChoice"
            checked={audience === 'SELECTED'}
            onChange={() => setAudience('SELECTED')}
          />
          Specific members
        </label>
      </div>

      {audience === 'SELECTED' && (
        <div className="relative" ref={pickerRef}>
          <button
            type="button"
            onClick={() => setPickerOpen((o) => !o)}
            className="w-full md:w-80 flex items-center justify-between border rounded-lg px-3 py-2 text-sm text-left bg-surface hover:bg-surface-container transition-colors"
          >
            <span className={selected.size === 0 ? 'text-on-surface-variant' : ''}>
              {selectedLabel}
            </span>
            <span className="material-symbols-outlined text-[18px]">
              {pickerOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {pickerOpen && (
            <div className="absolute z-30 mt-1 w-full md:w-80 max-h-64 overflow-y-auto rounded-lg border border-outline-variant bg-surface shadow-lg">
              {members.length === 0 ? (
                <p className="px-3 py-3 text-sm text-on-surface-variant">No active members.</p>
              ) : (
                members.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-surface-container border-b border-outline-variant/40 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(m.id)}
                      onChange={() => toggleMember(m.id)}
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium truncate">{m.fullName}</span>
                      <span className="block text-[12px] text-on-surface-variant truncate">
                        {m.email}
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>
      )}

      <button className="bg-primary text-on-primary rounded-lg px-4 py-2 justify-self-start">
        Send announcement
      </button>
    </form>
  )
}
