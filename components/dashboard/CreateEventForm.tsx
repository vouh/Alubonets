'use client'

import { useRef, useState } from 'react'
import { actionCreateEvent } from '@/app/actions/domain'
import { createClient } from '@/utils/supabase/client'

const MAX_BYTES = 2 * 1024 * 1024
const MAX_PX = 1024

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
      'image/jpeg',
      quality,
    )
  )
}

async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  let { width, height } = bitmap
  if (width > MAX_PX) {
    height = Math.round((height * MAX_PX) / width)
    width = MAX_PX
  }
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const outName = file.name.replace(/\.[^.]+$/, '.jpg')
  // Three targeted quality levels — at most 3 toBlob calls
  for (const q of [0.82, 0.6, 0.38]) {
    const blob = await toBlob(canvas, q)
    if (blob.size <= MAX_BYTES) return new File([blob], outName, { type: 'image/jpeg' })
  }
  // Last resort: return whatever 0.38 produces
  return new File([await toBlob(canvas, 0.38)], outName, { type: 'image/jpeg' })
}

export default function CreateEventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPublic, setIsPublic] = useState(true)
  const [sendNotif, setSendNotif] = useState(true)
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const [dateError, setDateError] = useState('')

  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadInfo, setUploadInfo] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    setUploadInfo('')
    try {
      const originalKb = Math.round(file.size / 1024)
      const compressed = await compressImage(file)
      const compressedKb = Math.round(compressed.size / 1024)
      const saved = originalKb - compressedKb
      const path = `event-covers/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const supabase = createClient()
      const { error } = await supabase.storage.from('gallery').upload(path, compressed, {
        contentType: 'image/jpeg',
        upsert: false,
      })
      if (error) throw error
      const { data } = supabase.storage.from('gallery').getPublicUrl(path)
      setImageUrl(data.publicUrl)
      setUploadInfo(
        saved > 0
          ? `Compressed ${originalKb} KB → ${compressedKb} KB (saved ${saved} KB)`
          : `${compressedKb} KB`
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      setUploadError(msg)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd0 = new FormData(e.currentTarget)
    const startsAtVal = String(fd0.get('startsAt') || '')
    if (startsAtVal && new Date(startsAtVal) < new Date()) {
      setDateError('Event date cannot be in the past')
      return
    }
    setDateError('')
    setPending(true)
    setDone(false)
    try {
      const fd = new FormData(e.currentTarget)
      fd.set('isPublic', isPublic ? 'on' : 'off')
      fd.set('sendNotification', sendNotif ? 'on' : 'off')
      fd.set('imageUrl', imageUrl)
      await actionCreateEvent(fd)
      ;(e.target as HTMLFormElement).reset()
      setIsPublic(true)
      setSendNotif(true)
      setImageUrl('')
      setDone(true)
      setTimeout(() => {
        setDone(false)
        onSuccess?.()
      }, 1500)
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
          <div className={`flex items-center gap-2 rounded-xl border bg-surface-container dark:bg-[#111f36] px-3 py-2.5 focus-within:ring-1 transition-all ${dateError ? 'border-red-400 dark:border-red-600 focus-within:border-red-400 focus-within:ring-red-400' : 'border-outline-variant dark:border-[#1e3461] focus-within:border-primary focus-within:ring-primary'}`}>
            <span className="material-symbols-outlined text-outline dark:text-blue-200/40" style={{ fontSize: 15 }}>schedule</span>
            <input
              name="startsAt"
              type="datetime-local"
              required
              onChange={() => dateError && setDateError('')}
              className="flex-1 bg-transparent outline-none text-[13px] text-on-surface dark:text-blue-50"
            />
          </div>
          {dateError && (
            <p className="text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>error</span>
              {dateError}
            </p>
          )}
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

        {/* Cover image — upload + URL fallback */}
        <div className="sm:col-span-2 space-y-2">
          <label className="block text-[11px] font-semibold text-on-surface-variant dark:text-blue-200/60 uppercase tracking-wider">
            Cover image{' '}
            <span className="text-outline dark:text-blue-200/40 font-normal normal-case tracking-normal">(optional)</span>
          </label>

          {/* Preview */}
          {imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-outline-variant dark:border-[#1e3461] h-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Cover preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setImageUrl(''); if (fileRef.current) fileRef.current.value = '' }}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                aria-label="Remove image"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
              </button>
            </div>
          )}

          {/* Upload button row */}
          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36] px-3 py-2 text-[12px] font-medium text-on-surface dark:text-blue-200 hover:border-primary/40 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                {uploading ? 'hourglass_top' : 'upload'}
              </span>
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>

            {/* Paste URL fallback */}
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36] px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <span className="material-symbols-outlined text-outline dark:text-blue-200/40" style={{ fontSize: 14 }}>link</span>
              <input
                type="url"
                placeholder="or paste a URL…"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[13px] text-on-surface dark:text-blue-50 placeholder:text-outline dark:placeholder:text-blue-200/30"
              />
            </div>
          </div>

          {uploadError && (
            <p className="text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
              {uploadError}
            </p>
          )}
          {uploadInfo && !uploadError && (
            <p className="text-[11px] text-green-600 dark:text-green-400 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>compress</span>
              {uploadInfo}
            </p>
          )}
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
        disabled={pending || uploading}
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
