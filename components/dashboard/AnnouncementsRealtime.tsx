'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type AnnouncementRow = {
  id: string
  title: string
  content: string
  publishedAt?: Date | string
}

export default function AnnouncementsRealtime({
  initial,
}: {
  initial: AnnouncementRow[]
}) {
  const [items, setItems] = useState(initial)

  useEffect(() => {
    setItems(initial)
  }, [initial])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('member-announcements')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        (payload) => {
          const row = payload.new as AnnouncementRow & { broadcast?: boolean }
          if (row.broadcast === false) return
          setItems((prev) => [row, ...prev].slice(0, 8))
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  if (items.length === 0) {
    return <p className="text-sm text-on-surface-variant">No announcements yet.</p>
  }

  return (
    <ul className="space-y-2">
      {items.map((a) => (
        <li key={a.id} className="border-b pb-2">
          <p className="font-medium">{a.title}</p>
          <p className="text-sm text-on-surface-variant">{a.content}</p>
        </li>
      ))}
    </ul>
  )
}
