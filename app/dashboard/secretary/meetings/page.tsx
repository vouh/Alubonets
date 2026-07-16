import DashboardShell from '@/components/dashboard/DashboardShell'
import { SECRETARY_NAV } from '@/lib/dashboard/nav'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function SecretaryMeetingsPage() {
  const meetings = await prisma.meeting.findMany({
    orderBy: { heldAt: 'desc' },
    include: { publishedDocument: { select: { id: true, fileUrl: true } } },
  })

  return (
    <DashboardShell role="SECRETARY" title="Meetings" nav={SECRETARY_NAV}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-on-surface-variant max-w-xl">
            Draft minutes as structured text, preview the letterhead, download a PDF anytime, and
            publish a Final copy to the documents library.
          </p>
          <div className="flex gap-2">
            <a
              href="/api/export/meetings"
              className="px-3 py-2 rounded-lg border text-sm font-label-bold"
            >
              Export all DOCX
            </a>
            <Link
              href="/dashboard/secretary/meetings/new"
              className="px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-label-bold"
            >
              New meeting
            </Link>
          </div>
        </div>

        <section className="rounded-2xl border border-outline-variant/40 bg-surface overflow-hidden">
          {meetings.length === 0 ? (
            <p className="p-6 text-sm text-on-surface-variant">No meetings yet.</p>
          ) : (
            <ul className="divide-y divide-outline-variant/40">
              {meetings.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{m.title}</p>
                      <span
                        className={`text-[10px] uppercase tracking-wide font-label-bold px-2 py-0.5 rounded-full ${
                          m.status === 'FINAL'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {m.heldAt.toLocaleString()}
                      {m.location ? ` · ${m.location}` : ''} · {m.attendance} present
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/secretary/meetings/${m.id}`}
                      className="text-sm text-primary font-label-bold px-2 py-1"
                    >
                      Open
                    </Link>
                    <a
                      href={`/api/pdf/minutes/${m.id}`}
                      className="text-sm text-on-surface-variant font-label-bold px-2 py-1"
                    >
                      PDF
                    </a>
                    {m.publishedDocument?.fileUrl && (
                      <a
                        href={m.publishedDocument.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-on-surface-variant font-label-bold px-2 py-1"
                      >
                        Library
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardShell>
  )
}
