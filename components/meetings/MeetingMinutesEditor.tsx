'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  actionCreateMeeting,
  actionPublishMeetingMinutes,
  actionUpdateMeeting,
} from '@/app/actions/meetings'

export type MeetingEditorValues = {
  id?: string
  title: string
  heldAt: string
  attendance: number
  location: string
  opening: string
  attendees: string
  agenda: string
  minutes: string
  resolutions: string
  nextMeetingAt: string
  status?: 'DRAFT' | 'FINAL'
  publishedDocumentId?: string | null
}

function toLocalInput(isoOrLocal: string) {
  if (!isoOrLocal) return ''
  const d = new Date(isoOrLocal)
  if (Number.isNaN(d.getTime())) return isoOrLocal
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function MeetingMinutesEditor({
  initial,
  mode,
}: {
  initial: MeetingEditorValues
  mode: 'create' | 'edit'
}) {
  const router = useRouter()
  const [values, setValues] = useState({
    ...initial,
    heldAt: toLocalInput(initial.heldAt),
    nextMeetingAt: initial.nextMeetingAt ? toLocalInput(initial.nextMeetingAt) : '',
  })
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const set = (key: keyof MeetingEditorValues, value: string | number) => {
    setValues((v) => ({ ...v, [key]: value }))
  }

  const previewDate = useMemo(() => {
    try {
      return values.heldAt ? new Date(values.heldAt).toLocaleString() : '—'
    } catch {
      return '—'
    }
  }, [values.heldAt])

  const onSave = async () => {
    setError('')
    setMessage('')
    setSaving(true)
    try {
      const fd = new FormData()
      if (values.id) fd.set('id', values.id)
      fd.set('title', values.title)
      fd.set('heldAt', values.heldAt)
      fd.set('attendance', String(values.attendance || 0))
      fd.set('location', values.location)
      fd.set('opening', values.opening)
      fd.set('attendees', values.attendees)
      fd.set('agenda', values.agenda)
      fd.set('minutes', values.minutes)
      fd.set('resolutions', values.resolutions)
      fd.set('nextMeetingAt', values.nextMeetingAt)

      if (mode === 'create') {
        const meeting = await actionCreateMeeting(fd)
        setMessage('Draft saved.')
        router.push(`/dashboard/secretary/meetings/${meeting.id}`)
        router.refresh()
      } else {
        await actionUpdateMeeting(fd)
        setMessage('Draft saved.')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  const onPublish = async () => {
    if (!values.id) {
      setError('Save the draft before publishing.')
      return
    }
    setError('')
    setMessage('')
    setPublishing(true)
    try {
      // Persist latest edits first
      const fd = new FormData()
      fd.set('id', values.id)
      fd.set('title', values.title)
      fd.set('heldAt', values.heldAt)
      fd.set('attendance', String(values.attendance || 0))
      fd.set('location', values.location)
      fd.set('opening', values.opening)
      fd.set('attendees', values.attendees)
      fd.set('agenda', values.agenda)
      fd.set('minutes', values.minutes)
      fd.set('resolutions', values.resolutions)
      fd.set('nextMeetingAt', values.nextMeetingAt)
      await actionUpdateMeeting(fd)
      await actionPublishMeetingMinutes(values.id)
      setValues((v) => ({ ...v, status: 'FINAL' }))
      setMessage('Published as Final — PDF stored in documents library.')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <Link
            href="/dashboard/secretary/meetings"
            className="text-sm text-primary font-label-bold inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            All meetings
          </Link>
          {values.status && (
            <span
              className={`text-[11px] uppercase tracking-wide font-label-bold px-2.5 py-1 rounded-full ${
                values.status === 'FINAL'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {values.status}
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-outline-variant/50 bg-surface p-4 space-y-3">
          <div>
            <label className="text-[12px] font-label-bold text-on-surface-variant">Title</label>
            <input
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-label-bold text-on-surface-variant">Held at</label>
              <input
                type="datetime-local"
                value={values.heldAt}
                onChange={(e) => set('heldAt', e.target.value)}
                className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-[12px] font-label-bold text-on-surface-variant">
                Attendance count
              </label>
              <input
                type="number"
                min={0}
                value={values.attendance}
                onChange={(e) => set('attendance', Number(e.target.value))}
                className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-[12px] font-label-bold text-on-surface-variant">Venue</label>
            <input
              value={values.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Alubonets Hall, Nairobi"
              className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-label-bold text-on-surface-variant">Opening</label>
            <textarea
              value={values.opening}
              onChange={(e) => set('opening', e.target.value)}
              rows={2}
              className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-label-bold text-on-surface-variant">
              Attendee list
            </label>
            <textarea
              value={values.attendees}
              onChange={(e) => set('attendees', e.target.value)}
              rows={2}
              className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-label-bold text-on-surface-variant">Agenda</label>
            <textarea
              value={values.agenda}
              onChange={(e) => set('agenda', e.target.value)}
              rows={3}
              className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-label-bold text-on-surface-variant">
              Discussion / minutes
            </label>
            <textarea
              value={values.minutes}
              onChange={(e) => set('minutes', e.target.value)}
              rows={5}
              className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-label-bold text-on-surface-variant">
              Resolutions
            </label>
            <textarea
              value={values.resolutions}
              onChange={(e) => set('resolutions', e.target.value)}
              rows={3}
              className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-label-bold text-on-surface-variant">
              Next meeting
            </label>
            <input
              type="datetime-local"
              value={values.nextMeetingAt}
              onChange={(e) => set('nextMeetingAt', e.target.value)}
              className="mt-1 w-full border border-outline-variant rounded-xl px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-error text-[12px]">{error}</p>}
          {message && <p className="text-primary text-[12px]">{message}</p>}

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-label-bold disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save draft'}
            </button>
            {values.id && (
              <>
                <a
                  href={`/api/pdf/minutes/${values.id}`}
                  className="px-4 py-2 rounded-full border border-outline-variant text-sm font-label-bold"
                >
                  Download PDF
                </a>
                <button
                  type="button"
                  onClick={onPublish}
                  disabled={publishing}
                  className="px-4 py-2 rounded-full bg-secondary-container text-on-primary text-sm font-label-bold disabled:opacity-60"
                >
                  {publishing ? 'Publishing…' : 'Mark final & publish'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Letterhead preview */}
      <div className="lg:sticky lg:top-4 self-start">
        <p className="text-[11px] uppercase tracking-wide text-on-surface-variant font-label-bold mb-2 px-1">
          Preview
        </p>
        <article className="rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,31,80,0.14)] bg-white border border-outline-variant/30">
          <div className="bg-primary text-on-primary px-6 py-3">
            <p className="text-[11px] font-label-bold tracking-[0.12em] uppercase opacity-90">
              Alubonets Self-Help Group
            </p>
          </div>
          <div className="px-6 py-5 space-y-4 min-h-[420px]">
            <div>
              <p className="text-[12px] uppercase tracking-wide text-on-surface-variant font-label-bold">
                Meeting Minutes
              </p>
              <h2 className="font-h3 text-[22px] text-primary mt-1 leading-tight">
                {values.title || 'Untitled meeting'}
              </h2>
              <p className="text-[13px] text-on-surface-variant mt-2">{previewDate}</p>
              {values.location && (
                <p className="text-[13px] text-on-surface-variant">{values.location}</p>
              )}
              <p className="text-[13px] text-on-surface-variant">
                Attendance: {values.attendance || 0}
              </p>
            </div>
            <div className="h-px bg-outline-variant/60" />
            {[
              { label: 'Opening', body: values.opening },
              { label: 'Attendees', body: values.attendees },
              { label: 'Agenda', body: values.agenda },
              { label: 'Discussion', body: values.minutes },
              { label: 'Resolutions', body: values.resolutions },
            ].map(
              (s) =>
                s.body.trim() && (
                  <section key={s.label}>
                    <h3 className="text-[11px] uppercase tracking-wide font-label-bold text-primary mb-1">
                      {s.label}
                    </h3>
                    <p className="text-[13px] text-on-surface whitespace-pre-wrap leading-relaxed">
                      {s.body}
                    </p>
                  </section>
                )
            )}
            {!values.opening &&
              !values.attendees &&
              !values.agenda &&
              !values.minutes &&
              !values.resolutions && (
                <p className="text-sm text-on-surface-variant italic">
                  Start writing on the left — the letterhead preview updates live.
                </p>
              )}
          </div>
        </article>
      </div>
    </div>
  )
}
