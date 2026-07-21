'use client'

import { useRef, useState } from 'react'
import { actionUpsertProject } from '@/app/actions/domain'

type MemberOption = { id: string; fullName: string }

type ProjectRow = {
  id: string
  title: string
  description: string
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED'
  imageUrl?: string | null
  updatedAt: string
}

type Props = {
  members?: MemberOption[]
  initial?: ProjectRow
  onSuccess?: (p: ProjectRow) => void
}

export default function UpsertProjectForm({ members = [], initial, onSuccess }: Props) {
  const existingId = initial?.id

  const [title, setTitle]       = useState(initial?.title ?? '')
  const [description, setDesc]  = useState(initial?.description ?? '')
  const [status, setStatus]     = useState<'UPCOMING' | 'ONGOING' | 'COMPLETED'>(initial?.status ?? 'UPCOMING')
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [sendEmail, setSendEmail] = useState(true)
  const [emailAudience, setEmailAudience] = useState<'ALL' | 'SELECTED'>('ALL')
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  function toggleMember(id: string) {
    setSelectedMembers((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const pickerLabel =
    selectedMembers.size === 0
      ? 'Select members…'
      : selectedMembers.size === 1
        ? members.find((m) => selectedMembers.has(m.id))?.fullName || '1 member'
        : `${selectedMembers.size} members selected`

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title || !description) return

    // Optimistic: call onSuccess immediately with draft data
    onSuccess?.({
      id: existingId ?? `opt-${Date.now()}`,
      title,
      description,
      status,
      imageUrl: imageUrl || null,
      updatedAt: new Date().toISOString(),
    })

    const fd = new FormData()
    if (existingId) fd.set('id', existingId)
    fd.set('title', title)
    fd.set('description', description)
    fd.set('status', status)
    if (imageUrl) fd.set('imageUrl', imageUrl)
    fd.set('sendEmail', sendEmail && !existingId ? 'on' : 'off')
    fd.set('emailAudience', emailAudience)
    if (emailAudience === 'SELECTED') {
      selectedMembers.forEach((id) => fd.append('emailMemberId', id))
    }
    actionUpsertProject(fd).catch(console.error)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Title <span className="text-secondary">*</span>
          </label>
          <input
            name="title" required placeholder="Project title"
            value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-[13px] bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Status</label>
          <select
            name="status" value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-[13px] bg-surface text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
          Description <span className="text-secondary">*</span>
        </label>
        <textarea
          name="description" required placeholder="Project description" rows={3}
          value={description} onChange={(e) => setDesc(e.target.value)}
          className="w-full border border-outline-variant rounded-lg px-3 py-2 text-[13px] bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Image URL (optional)</label>
        <input
          type="url" name="imageUrl" placeholder="https://…"
          value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border border-outline-variant rounded-lg px-3 py-2 text-[13px] bg-surface text-on-surface focus:outline-none focus:border-primary"
        />
      </div>

      {/* Email toggle — only for new projects */}
      {!existingId && (
        <div className="space-y-2 rounded-xl border border-outline-variant p-3">
          <button
            type="button"
            onClick={() => setSendEmail((v) => !v)}
            className="flex items-center gap-3 w-full text-left"
          >
            <div className={`relative flex-shrink-0 w-9 h-5 rounded-full transition-colors ${sendEmail ? 'bg-blue-500' : 'bg-outline/40'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${sendEmail ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>mail</span>
                Email members about this project
              </p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                {sendEmail ? 'Will send email when project is saved' : 'No email will be sent'}
              </p>
            </div>
          </button>

          {sendEmail && (
            <div className="space-y-2 pt-1 border-t border-outline-variant/40">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                  <input type="radio" checked={emailAudience === 'ALL'} onChange={() => setEmailAudience('ALL')} />
                  All members
                </label>
                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                  <input type="radio" checked={emailAudience === 'SELECTED'} onChange={() => setEmailAudience('SELECTED')} />
                  Specific members
                </label>
              </div>

              {emailAudience === 'SELECTED' && members.length > 0 && (
                <div className="relative" ref={pickerRef}>
                  <button
                    type="button"
                    onClick={() => setPickerOpen((o) => !o)}
                    className="flex items-center justify-between gap-2 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-[12px] text-left hover:border-primary/40 transition-colors"
                  >
                    <span className={selectedMembers.size === 0 ? 'text-on-surface-variant' : 'text-on-surface'}>
                      {pickerLabel}
                    </span>
                    <span className="material-symbols-outlined text-outline" style={{ fontSize: 16 }}>
                      {pickerOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {pickerOpen && (
                    <div className="absolute z-30 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-outline-variant bg-surface shadow-lg">
                      {members.map((m) => (
                        <label
                          key={m.id}
                          className="flex items-center gap-3 px-3 py-2 text-[12px] cursor-pointer hover:bg-surface-container border-b border-outline-variant/30 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMembers.has(m.id)}
                            onChange={() => toggleMember(m.id)}
                          />
                          <span>{m.fullName}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        className="bg-primary text-on-primary rounded-lg px-4 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity"
      >
        {existingId ? 'Save changes' : 'Save project'}
      </button>
    </form>
  )
}
