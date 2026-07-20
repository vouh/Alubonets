'use client'

import { useState } from 'react'
import { actionCreateEvent } from '@/app/actions/domain'

export default function CreateEventForm() {
  const [isPublic, setIsPublic] = useState(true)
  const [sendNotif, setSendNotif] = useState(true)
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setDone(false)
    try {
      const fd = new FormData(e.currentTarget)
      fd.set('isPublic', isPublic ? 'on' : 'off')
      fd.set('sendNotification', sendNotif ? 'on' : 'off')
      await actionCreateEvent(fd)
      ;(e.target as HTMLFormElement).reset()
      setIsPublic(true)
      setSendNotif(true)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Title */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-on-surface-variant dark:text-blue-200/60 uppercase tracking-wider">
            Title <span className="text-secondary">*</span>
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36] px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <input
              name="title"
              placeholder="e.g. Quarterly General Meeting"
              required
              className="flex-1 bg-transparent outline-none text-[13px] text-on-surface dark:text-blue-50 placeholder:text-outline dark:placeholder:text-blue-200/30"
            />
          </div>
        </div>

        {/* Date & time */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-on-surface-variant dark:text-blue-200/60 uppercase tracking-wider">
            Date &amp; time <span className="text-secondary">*</span>
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36] px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-outline dark:text-blue-200/40" style={{ fontSize: 15 }}>schedule</span>
            <input
              name="startsAt"
              type="datetime-local"
              required
              className="flex-1 bg-transparent outline-none text-[13px] text-on-surface dark:text-blue-50"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-on-surface-variant dark:text-blue-200/60 uppercase tracking-wider">
            Location
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36] px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-outline dark:text-blue-200/40" style={{ fontSize: 15 }}>location_on</span>
            <input
              name="location"
              placeholder="e.g. Community Hall"
              className="flex-1 bg-transparent outline-none text-[13px] text-on-surface dark:text-blue-50 placeholder:text-outline dark:placeholder:text-blue-200/30"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-on-surface-variant dark:text-blue-200/60 uppercase tracking-wider">
            Description
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36] px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <input
              name="description"
              placeholder="Short description"
              className="flex-1 bg-transparent outline-none text-[13px] text-on-surface dark:text-blue-50 placeholder:text-outline dark:placeholder:text-blue-200/30"
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-[11px] font-semibold text-on-surface-variant dark:text-blue-200/60 uppercase tracking-wider">
            Cover image URL <span className="text-outline dark:text-blue-200/40 font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36] px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-outline dark:text-blue-200/40" style={{ fontSize: 15 }}>image</span>
            <input
              name="imageUrl"
              type="url"
              placeholder="https://…"
              className="flex-1 bg-transparent outline-none text-[13px] text-on-surface dark:text-blue-50 placeholder:text-outline dark:placeholder:text-blue-200/30"
            />
          </div>
        </div>
      </div>

      {/* Visibility toggles */}
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setIsPublic((v) => !v)}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
            isPublic
              ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
              : 'border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36]'
          }`}
        >
          <div
            className={`relative flex-shrink-0 w-9 h-5 rounded-full transition-colors ${
              isPublic ? 'bg-primary' : 'bg-outline/40 dark:bg-[#2a3f66]'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                isPublic ? 'translate-x-[18px]' : 'translate-x-0.5'
              }`}
            />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-on-surface dark:text-blue-50 flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>public</span>
              Show on public page
            </p>
            <p className="text-[11px] text-on-surface-variant dark:text-blue-200/50 mt-0.5">
              {isPublic ? 'Visible to everyone on the website' : 'Hidden from public — members only'}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSendNotif((v) => !v)}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
            sendNotif
              ? 'border-secondary-container/60 bg-secondary-container/5 dark:bg-secondary-container/10'
              : 'border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36]'
          }`}
        >
          <div
            className={`relative flex-shrink-0 w-9 h-5 rounded-full transition-colors ${
              sendNotif ? 'bg-secondary-container' : 'bg-outline/40 dark:bg-[#2a3f66]'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                sendNotif ? 'translate-x-[18px]' : 'translate-x-0.5'
              }`}
            />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-on-surface dark:text-blue-50 flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>notifications</span>
              Notify members
            </p>
            <p className="text-[11px] text-on-surface-variant dark:text-blue-200/50 mt-0.5">
              {sendNotif ? 'Send notification to all active members' : 'No notification will be sent'}
            </p>
          </div>
        </button>
      </div>

      {done && (
        <p className="text-[12px] text-green-600 dark:text-green-400 flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>
          Event created{sendNotif ? ' and members notified' : ''}.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary py-2.5 text-[13px] font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          {pending ? 'hourglass_top' : 'add'}
        </span>
        {pending ? 'Saving…' : 'Save event'}
      </button>
    </form>
  )
}
