'use client'

import { useState } from 'react'

export type EventRow = {
  id: string
  title: string
  description?: string | null
  location?: string | null
  startsAt: string
  imageUrl?: string | null
  isPublic?: boolean
}

type Props = {
  events: EventRow[]
  emptyMessage?: string
  dimPast?: boolean
}

export default function EventsGrid({ events, emptyMessage = 'No events.', dimPast = false }: Props) {
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null)

  if (events.length === 0) {
    return <p className="text-[13px] text-on-surface-variant dark:text-blue-200/50 py-2">{emptyMessage}</p>
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {events.map((e) => (
          <EventCard
            key={e.id}
            event={e}
            dimPast={dimPast}
            onViewImage={
              e.imageUrl ? () => setLightbox({ src: e.imageUrl!, title: e.title }) : undefined
            }
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-2xl w-full"
            onClick={(ev) => ev.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="mt-3 text-center text-white/80 text-[13px] font-medium">{lightbox.title}</p>
            <button
              type="button"
              className="absolute -top-3 -right-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full p-1.5 transition-colors"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function EventCard({
  event,
  dimPast,
  onViewImage,
}: {
  event: EventRow
  dimPast: boolean
  onViewImage?: () => void
}) {
  const date = new Date(event.startsAt)
  const month = date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()
  const day = date.getDate()
  const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  const showPrivate = event.isPublic === false

  return (
    <div className={`rounded-xl border border-outline-variant dark:border-[#1a2d4f] bg-surface dark:bg-[#0d1729] overflow-hidden flex flex-col ${dimPast ? 'opacity-55' : ''}`}>
      {/* Image */}
      {event.imageUrl ? (
        <div
          className="relative group overflow-hidden cursor-pointer"
          onClick={onViewImage}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onViewImage?.()}
          aria-label={`View image for ${event.title}`}
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200">
            <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" style={{ fontSize: 36 }}>
              visibility
            </span>
          </div>
          {showPrivate && (
            <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>lock</span>
              Members only
            </span>
          )}
        </div>
      ) : (
        <div className="w-full h-20 bg-gradient-to-br from-primary/8 to-primary/4 dark:from-primary/15 dark:to-primary/5 flex items-center justify-center relative">
          <span className="material-symbols-outlined icon-fill text-primary/25 dark:text-primary-fixed-dim/20" style={{ fontSize: 40 }}>
            event
          </span>
          {showPrivate && (
            <span className="absolute top-2 left-2 bg-primary/10 text-primary dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>lock</span>
              Members only
            </span>
          )}
        </div>
      )}

      {/* Body */}
      <div className="p-3 flex items-start gap-3 flex-1">
        {/* Calendar chip */}
        <div className="flex w-10 shrink-0 flex-col items-center rounded-lg border border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36] py-1.5 text-center">
          <span className="text-[9px] font-semibold text-secondary dark:text-orange-300 uppercase leading-none tracking-wide">
            {month}
          </span>
          <span className="text-[16px] font-bold text-primary dark:text-blue-50 leading-tight">
            {day}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-on-surface dark:text-blue-50 leading-snug line-clamp-1">
            {event.title}
          </p>
          <p className="text-[11px] text-on-surface-variant dark:text-blue-200/50 mt-0.5">
            {time}{event.location ? ` · ${event.location}` : ''}
          </p>
          {event.description && (
            <p className="text-[11px] text-on-surface-variant dark:text-blue-200/40 mt-1 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
