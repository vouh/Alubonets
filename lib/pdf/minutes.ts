import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { Meeting, User } from '@prisma/client'

export type MeetingForPdf = Meeting & {
  recorder?: Pick<User, 'fullName' | 'email'> | null
}

const PAGE_W = 595
const PAGE_H = 842
const MARGIN_X = 50
const MARGIN_TOP = 780
const MARGIN_BOTTOM = 60
const NAVY = rgb(0, 0.12, 0.31)
const MUTED = rgb(0.3, 0.32, 0.36)

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const paragraphs = text.replace(/\r\n/g, '\n').split('\n')
  const lines: string[] = []
  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push('')
      continue
    }
    const words = para.split(/\s+/)
    let current = ''
    for (const word of words) {
      const next = current ? `${current} ${word}` : word
      if (font.widthOfTextAtSize(next, size) <= maxWidth) {
        current = next
      } else {
        if (current) lines.push(current)
        current = word
      }
    }
    if (current) lines.push(current)
  }
  return lines
}

type DrawCtx = {
  pdf: PDFDocument
  page: PDFPage
  font: PDFFont
  bold: PDFFont
  y: number
}

function ensureSpace(ctx: DrawCtx, needed: number) {
  if (ctx.y - needed < MARGIN_BOTTOM) {
    ctx.page = ctx.pdf.addPage([PAGE_W, PAGE_H])
    ctx.y = MARGIN_TOP
  }
}

function drawSection(ctx: DrawCtx, title: string, body?: string | null) {
  if (!body?.trim()) return
  ensureSpace(ctx, 40)
  ctx.page.drawText(title.toUpperCase(), {
    x: MARGIN_X,
    y: ctx.y,
    size: 11,
    font: ctx.bold,
    color: NAVY,
  })
  ctx.y -= 18
  const lines = wrapText(body.trim(), ctx.font, 10, PAGE_W - MARGIN_X * 2)
  for (const line of lines) {
    ensureSpace(ctx, 14)
    if (line) {
      ctx.page.drawText(line, {
        x: MARGIN_X,
        y: ctx.y,
        size: 10,
        font: ctx.font,
        color: rgb(0.1, 0.1, 0.12),
      })
    }
    ctx.y -= 13
  }
  ctx.y -= 10
}

export async function buildMeetingMinutesPdf(meeting: MeetingForPdf): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([PAGE_W, PAGE_H])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const ctx: DrawCtx = { pdf, page, font, bold, y: MARGIN_TOP }

  // Letterhead bar
  ctx.page.drawRectangle({
    x: 0,
    y: PAGE_H - 36,
    width: PAGE_W,
    height: 36,
    color: NAVY,
  })
  ctx.page.drawText('ALUBONETS SELF-HELP GROUP', {
    x: MARGIN_X,
    y: PAGE_H - 24,
    size: 11,
    font: bold,
    color: rgb(1, 1, 1),
  })

  ctx.y = PAGE_H - 64
  ctx.page.drawText('Meeting Minutes', {
    x: MARGIN_X,
    y: ctx.y,
    size: 18,
    font: bold,
    color: NAVY,
  })
  ctx.y -= 28

  ctx.page.drawText(meeting.title, {
    x: MARGIN_X,
    y: ctx.y,
    size: 14,
    font: bold,
    color: rgb(0.05, 0.05, 0.08),
  })
  ctx.y -= 18

  const meta = [
    `Date: ${meeting.heldAt.toLocaleString()}`,
    meeting.location ? `Venue: ${meeting.location}` : null,
    `Attendance: ${meeting.attendance}`,
    `Status: ${meeting.status}`,
    meeting.recorder ? `Recorded by: ${meeting.recorder.fullName}` : null,
  ].filter(Boolean) as string[]

  for (const line of meta) {
    ctx.page.drawText(line, { x: MARGIN_X, y: ctx.y, size: 10, font, color: MUTED })
    ctx.y -= 14
  }
  ctx.y -= 8

  // Divider
  ctx.page.drawLine({
    start: { x: MARGIN_X, y: ctx.y },
    end: { x: PAGE_W - MARGIN_X, y: ctx.y },
    thickness: 0.8,
    color: rgb(0.75, 0.76, 0.8),
  })
  ctx.y -= 22

  drawSection(ctx, 'Opening', meeting.opening)
  drawSection(ctx, 'Attendees', meeting.attendees)
  drawSection(ctx, 'Agenda', meeting.agenda)
  drawSection(ctx, 'Discussion / Minutes', meeting.minutes)
  drawSection(ctx, 'Resolutions', meeting.resolutions)
  if (meeting.nextMeetingAt) {
    drawSection(
      ctx,
      'Next meeting',
      meeting.nextMeetingAt.toLocaleString()
    )
  }

  ensureSpace(ctx, 40)
  ctx.page.drawText('— End of minutes —', {
    x: MARGIN_X,
    y: ctx.y,
    size: 9,
    font,
    color: MUTED,
  })

  return pdf.save()
}

export function minutesFilename(meeting: Pick<Meeting, 'id' | 'title' | 'heldAt'>) {
  const date = meeting.heldAt.toISOString().slice(0, 10)
  const slug = meeting.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return `minutes-${slug || meeting.id}-${date}.pdf`
}
