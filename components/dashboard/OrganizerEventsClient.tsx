'use client'

import { useState, useTransition } from 'react'
import { actionDeleteEvent, actionDeleteEvents } from '@/app/actions/domain'
import CreateEventForm from './CreateEventForm'
import EventsGrid, { EventRow } from './EventsGrid'

type Props = {
  upcoming: EventRow[]
  past: EventRow[]
}

export default function OrganizerEventsClient({ upcoming, past }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAll(events: EventRow[]) {
    setSelected(new Set(events.map((e) => e.id)))
  }

  function clearSelection() {
    setSelected(new Set())
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await actionDeleteEvent(id)
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    })
  }

  function handleBulkDelete() {
    const ids = [...selected]
    startTransition(async () => {
      await actionDeleteEvents(ids)
      clearSelection()
    })
  }

  function handleDeleteAllPast() {
    const ids = past.map((e) => e.id)
    startTransition(async () => {
      await actionDeleteEvents(ids)
      clearSelection()
    })
  }

  const anySelected = selected.size > 0

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-4xl mx-auto">

      {/* Past events cleanup banner */}
      {past.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-amber-500 dark:text-amber-400 flex-shrink-0" style={{ fontSize: 18 }}>
              schedule
            </span>
            <p className="text-[12px] text-amber-800 dark:text-amber-300 truncate">
              {past.length} past event{past.length > 1 ? 's' : ''} — consider cleaning up old records
            </p>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={handleDeleteAllPast}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>delete_sweep</span>
            Delete all past
          </button>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[16px] font-bold text-on-surface dark:text-blue-50">Events</h1>
          <p className="text-[12px] text-on-surface-variant dark:text-blue-200/50 mt-0.5">
            {upcoming.length} upcoming · {past.length} past
          </p>
        </div>
        <div className="flex items-center gap-2">
          {anySelected && (
            <>
              <span className="text-[12px] text-on-surface-variant dark:text-blue-200/50">
                {selected.size} selected
              </span>
              <button
                type="button"
                disabled={isPending}
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-3 py-2 text-[12px] font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                Delete ({selected.size})
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="text-[12px] text-on-surface-variant dark:text-blue-200/40 hover:text-on-surface dark:hover:text-blue-200 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary text-on-primary px-4 py-2 text-[13px] font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 17 }}>add_circle</span>
            Add new event
          </button>
        </div>
      </div>

      {/* Upcoming */}
      <section className="rounded-2xl border border-outline-variant dark:border-[#1a2d4f] bg-surface dark:bg-[#0d1729] p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined icon-fill text-primary" style={{ fontSize: 18 }}>event_upcoming</span>
            <h2 className="font-semibold text-[13px] text-on-surface dark:text-blue-50 uppercase tracking-wider">
              Upcoming ({upcoming.length})
            </h2>
          </div>
          {upcoming.length > 0 && (
            <button
              type="button"
              onClick={() => selected.size === upcoming.length ? clearSelection() : selectAll(upcoming)}
              className="text-[11px] text-on-surface-variant dark:text-blue-200/40 hover:text-primary dark:hover:text-blue-300 transition-colors"
            >
              {upcoming.length > 0 && upcoming.every(e => selected.has(e.id)) ? 'Deselect all' : 'Select all'}
            </button>
          )}
        </div>
        <EventsGrid
          events={upcoming}
          emptyMessage="No upcoming events yet. Add one with the button above."
          selectable
          selected={selected}
          onToggleSelect={toggleSelect}
          onDelete={handleDelete}
        />
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section className="rounded-2xl border border-outline-variant dark:border-[#1a2d4f] bg-surface dark:bg-[#0d1729] p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline dark:text-blue-200/40" style={{ fontSize: 18 }}>history</span>
              <h2 className="font-semibold text-[13px] text-on-surface-variant dark:text-blue-200/60 uppercase tracking-wider">
                Past ({past.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => past.every(e => selected.has(e.id)) ? clearSelection() : selectAll(past)}
              className="text-[11px] text-on-surface-variant dark:text-blue-200/40 hover:text-primary dark:hover:text-blue-300 transition-colors"
            >
              {past.every(e => selected.has(e.id)) ? 'Deselect all' : 'Select all'}
            </button>
          </div>
          <EventsGrid
            events={past.slice(0, 12)}
            emptyMessage=""
            dimPast
            selectable
            selected={selected}
            onToggleSelect={toggleSelect}
            onDelete={handleDelete}
          />
        </section>
      )}

      {/* Create event modal */}
      {open && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-outline-variant dark:border-[#1a2d4f] bg-surface dark:bg-[#0d1729] p-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <span className="material-symbols-outlined icon-fill text-primary" style={{ fontSize: 18 }}>add_circle</span>
                </div>
                <div>
                  <h2 className="font-semibold text-[14px] text-on-surface dark:text-blue-50">Create event</h2>
                  <p className="text-[11px] text-on-surface-variant dark:text-blue-200/50">
                    Add a cover photo and choose who sees it
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 hover:bg-surface-container dark:hover:bg-[#111f36] text-on-surface-variant dark:text-blue-200/60 transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            <CreateEventForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
