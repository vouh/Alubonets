'use client'

import { useEffect, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { actionDeleteProject } from '@/app/actions/domain'
import UpsertProjectForm from './UpsertProjectForm'

type MemberOption = { id: string; fullName: string }

export type ProjectRow = {
  id: string
  title: string
  description: string
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED'
  imageUrl?: string | null
  updatedAt: string
}

const STATUS_COLORS: Record<string, string> = {
  UPCOMING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  ONGOING:  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  COMPLETED:'bg-surface-container dark:bg-[#1a2d4f] text-on-surface-variant dark:text-blue-200/60',
}

export default function OrganizerProjectsClient({
  projects: initialProjects,
  members,
}: {
  projects: ProjectRow[]
  members: MemberOption[]
}) {
  const [localProjects, setLocalProjects] = useState(initialProjects)
  const [open, setOpen]     = useState(false)
  const [editing, setEditing] = useState<ProjectRow | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => { setLocalProjects(initialProjects) }, [initialProjects])

  function openCreate() { setEditing(null); setOpen(true) }
  function openEdit(p: ProjectRow) { setEditing(p); setOpen(true) }
  function closeModal() { setOpen(false); setEditing(null) }

  function handleDelete(id: string) {
    setLocalProjects((prev) => prev.filter((p) => p.id !== id))
    startTransition(() => { actionDeleteProject(id) })
  }

  function handleSave(project: ProjectRow) {
    if (editing) {
      setLocalProjects((prev) => prev.map((p) => p.id === editing.id ? project : p))
    } else {
      setLocalProjects((prev) => [project, ...prev])
    }
    closeModal()
  }

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[16px] font-bold text-on-surface dark:text-blue-50">Projects</h1>
          <p className="text-[12px] text-on-surface-variant dark:text-blue-200/50 mt-0.5">
            {localProjects.length} project{localProjects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-primary text-on-primary px-4 py-2 text-[13px] font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined icon-fill" style={{ fontSize: 17 }}>add_circle</span>
          New project
        </button>
      </div>

      {/* Projects list */}
      {localProjects.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant dark:border-[#1a2d4f] bg-surface-container-low dark:bg-[#0a1628] py-12 text-center">
          <span className="material-symbols-outlined text-on-surface-variant/30 dark:text-blue-200/20" style={{ fontSize: 40 }}>work_outline</span>
          <p className="text-[13px] text-on-surface-variant dark:text-blue-200/40 mt-2">No projects yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {localProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isPending={isPending}
              onEdit={() => openEdit(project)}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-outline-variant dark:border-[#1a2d4f] bg-surface dark:bg-[#0d1729] p-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <span className="material-symbols-outlined icon-fill text-primary" style={{ fontSize: 18 }}>
                    {editing ? 'edit' : 'add_circle'}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-[14px] text-on-surface dark:text-blue-50">
                    {editing ? 'Edit project' : 'New project'}
                  </h2>
                  <p className="text-[11px] text-on-surface-variant dark:text-blue-200/50 truncate max-w-[220px]">
                    {editing ? editing.title : 'Fill in the project details'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1.5 hover:bg-surface-container dark:hover:bg-[#111f36] text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            <UpsertProjectForm
              key={editing?.id ?? 'new'}
              members={members}
              initial={editing ?? undefined}
              onSuccess={handleSave}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function ProjectCard({
  project, isPending, onEdit, onDelete,
}: {
  project: ProjectRow
  isPending: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const date = new Date(project.updatedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="rounded-2xl border border-outline-variant dark:border-[#1a2d4f] bg-surface dark:bg-[#0d1729] p-4 flex gap-4">
      {project.imageUrl && (
        <img src={project.imageUrl} alt={project.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-[14px] text-on-surface dark:text-blue-50 truncate">{project.title}</p>
            <p className="text-[12px] text-on-surface-variant dark:text-blue-200/50 mt-0.5 line-clamp-2">{project.description}</p>
          </div>
          <span className={`flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_COLORS[project.status]}`}>
            {project.status}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[11px] text-on-surface-variant dark:text-blue-200/30">Updated {date}</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1 rounded-lg border border-outline-variant dark:border-[#1e3461] bg-surface-container dark:bg-[#111f36] px-2.5 py-1.5 text-[11px] font-semibold text-on-surface dark:text-blue-200 hover:border-primary/40 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>edit</span>
              Edit
            </button>
            {confirming ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => { setConfirming(false); onDelete() }}
                  className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-50"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-lg border border-outline-variant bg-surface-container px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="flex items-center gap-1 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>delete</span>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
