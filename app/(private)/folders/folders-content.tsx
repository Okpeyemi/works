"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  FolderAddIcon,
  Folder01Icon,
  MoreHorizontalIcon,
  Edit02Icon,
  Delete01Icon,
  Share01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import type { Folder } from "@/lib/types"
import type { SidebarUser } from "@/components/app-sidebar"
import { formatDate } from "@/lib/utils"
import { createFolder, updateFolder, trashFolder } from "@/lib/actions/folders"
import { ShareDialog } from "@/components/share-dialog"
import { toast } from "sonner"

// ─── New Folder Dialog ────────────────────────────────────────────────────────

function NewFolderDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      await createFolder({ name: trimmed })
      setName("")
      setOpen(false)
      toast.success("Folder created")
    } catch {
      toast.error("Failed to create folder")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setName("") }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
          <DialogDescription>Create a new folder to organize your links.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); handleCreate() }} className="space-y-3 py-2">
          <div className="space-y-2">
            <Label htmlFor="folder-name" className="text-sm font-medium">Folder name</Label>
            <Input id="folder-name" placeholder="Untitled folder" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" size="sm" disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Edit Folder Dialog ───────────────────────────────────────────────────────

function EditFolderDialog({ folder, open, onOpenChange }: { folder: Folder; open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = React.useState(folder.name)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => { if (open) setName(folder.name) }, [open, folder])

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      await updateFolder(folder.id, { name: trimmed })
      toast.success("Folder renamed")
      onOpenChange(false)
    } catch {
      toast.error("Failed to rename folder")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rename folder</DialogTitle>
          <DialogDescription>Enter a new name for this folder.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-3 py-2">
          <div className="space-y-2">
            <Label htmlFor="folder-rename" className="text-sm font-medium">Folder name</Label>
            <Input id="folder-rename" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" size="sm" disabled={loading || !name.trim()}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Folders Content ──────────────────────────────────────────────────────────

interface FoldersContentProps {
  user: SidebarUser | null
  folders: Folder[]
  linksCountMap: Record<string, number>
}

export function FoldersContent({ user, folders, linksCountMap }: FoldersContentProps) {
  const [editingFolder, setEditingFolder] = React.useState<Folder | null>(null)
  const [sharingFolder, setSharingFolder] = React.useState<Folder | null>(null)

  return (
    <DashboardShell title="Folders" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Folders" }]} user={user}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Folders</h2>
          <p className="text-xs text-muted-foreground">{folders.length} folders</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative max-w-xs w-full">
            <HugeiconsIcon icon={Search01Icon} size={15} color="currentColor" strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Input placeholder="Search folders..." className="pl-8 h-8 text-xs w-56" />
          </div>
          <NewFolderDialog>
            <Button size="sm" className="gap-1.5">
              <HugeiconsIcon icon={FolderAddIcon} size={15} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              New Folder
            </Button>
          </NewFolderDialog>
        </div>
      </div>

      {/* ── Empty state ── */}
      {folders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-14 rounded-xl bg-muted flex items-center justify-center mb-3">
            <HugeiconsIcon icon={Folder01Icon} size={24} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No folders yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Create your first folder to organize your links.
          </p>
          <NewFolderDialog>
            <Button size="sm" className="mt-4 gap-1.5">
              <HugeiconsIcon icon={FolderAddIcon} size={15} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              Create your first folder
            </Button>
          </NewFolderDialog>
        </div>
      )}

      {/* ── Folder Grid ── */}
      {folders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {/* Create folder card */}
          <NewFolderDialog>
            <div className="flex flex-col rounded-xl border-2 border-dashed border-border bg-muted/20 overflow-hidden cursor-pointer hover:border-primary/40 hover:bg-muted/40 transition-all group min-h-[140px]">
              <div className="flex flex-1 flex-col items-center justify-center gap-2.5">
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-11 rounded-xl text-muted-foreground group-hover:text-foreground transition-colors pointer-events-none"
                  tabIndex={-1}
                >
                  <HugeiconsIcon icon={FolderAddIcon} size={22} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                </Button>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  New Folder
                </span>
              </div>
            </div>
          </NewFolderDialog>

          {folders.map((folder) => {
            const count = linksCountMap[folder.id] ?? 0

            return (
              <div
                key={folder.id}
                className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex-1 p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="size-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                      <HugeiconsIcon icon={Folder01Icon} size={20} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`More options for ${folder.name}`}>
                          <HugeiconsIcon icon={MoreHorizontalIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="gap-2 text-xs" onSelect={() => setEditingFolder(folder)}>
                          <HugeiconsIcon icon={Edit02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs" onSelect={() => setSharingFolder(folder)}>
                          <HugeiconsIcon icon={Share01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-xs text-destructive" onClick={() => trashFolder(folder.id).then(() => toast.success("Folder moved to trash")).catch(() => toast.error("Failed to delete folder"))}>
                          <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{folder.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {count} links · {formatDate(folder.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Link01Icon} size={12} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
                    <span className="text-[10px] text-muted-foreground">{count} links</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Edit Folder Dialog ── */}
      {editingFolder && (
        <EditFolderDialog
          folder={editingFolder}
          open={!!editingFolder}
          onOpenChange={(open) => { if (!open) setEditingFolder(null) }}
        />
      )}

      {/* ── Share Folder Dialog ── */}
      <ShareDialog
        open={!!sharingFolder}
        onOpenChange={(open) => { if (!open) setSharingFolder(null) }}
        folderId={sharingFolder?.id}
        itemTitle={sharingFolder?.name ?? ""}
        itemType="folder"
      />
    </DashboardShell>
  )
}
