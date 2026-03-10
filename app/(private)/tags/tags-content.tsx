"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Tag01Icon,
  Edit02Icon,
  Delete01Icon,
  MoreHorizontalIcon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import type { Tag } from "@/lib/types"
import type { SidebarUser } from "@/components/app-sidebar"
import { createTag, deleteTag } from "@/lib/actions/tags"
import { toast } from "sonner"

// ─── Create Tag Dialog ────────────────────────────────────────────────────────

function CreateTagDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      await createTag({ name: trimmed })
      setName("")
      setOpen(false)
      toast.success("Tag created")
    } catch {
      toast.error("Failed to create tag")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setName("") }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create tag</DialogTitle>
          <DialogDescription>Add a new tag to categorize your links.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); handleCreate() }} className="space-y-3 py-2">
          <div className="space-y-2">
            <Label htmlFor="tag-name" className="text-sm font-medium">Tag name</Label>
            <Input id="tag-name" placeholder="e.g. frontend" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
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

// ─── Tags Content ─────────────────────────────────────────────────────────────

interface TagsContentProps {
  user: SidebarUser | null
  tags: Tag[]
  linksCountMap: Record<string, number>
}

export function TagsContent({ user, tags, linksCountMap }: TagsContentProps) {
  return (
    <DashboardShell title="Tags" user={user} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tags" }]}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tags</h2>
          <p className="text-xs text-muted-foreground">{tags.length} tags</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative max-w-xs w-full">
            <HugeiconsIcon icon={Search01Icon} size={15} color="currentColor" strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Input placeholder="Search tags..." className="pl-8 h-8 text-xs w-56" />
          </div>
          <CreateTagDialog>
            <Button size="sm" className="gap-1.5">
              <HugeiconsIcon icon={Tag01Icon} size={15} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              New Tag
            </Button>
          </CreateTagDialog>
        </div>
      </div>

      {/* ── Empty state ── */}
      {tags.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-14 rounded-xl bg-muted flex items-center justify-center mb-3">
            <HugeiconsIcon icon={Tag01Icon} size={24} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No tags yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Create tags to categorize and organize your links.
          </p>
          <CreateTagDialog>
            <Button size="sm" className="mt-4 gap-1.5">
              <HugeiconsIcon icon={Tag01Icon} size={15} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              Create your first tag
            </Button>
          </CreateTagDialog>
        </div>
      )}

      {/* ── Tags Grid ── */}
      {tags.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 cursor-pointer hover:shadow-md transition-all"
            >
              {/* Tag icon */}
              <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                <HugeiconsIcon icon={Tag01Icon} size={18} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">#{tag.name}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <HugeiconsIcon icon={Link01Icon} size={10} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                  {linksCountMap[tag.id] ?? 0} links
                </p>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`More options for ${tag.name}`}>
                    <HugeiconsIcon icon={MoreHorizontalIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem className="gap-2 text-xs">
                    <HugeiconsIcon icon={Edit02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-xs text-destructive" onClick={() => deleteTag(tag.id).then(() => toast.success("Tag deleted")).catch(() => toast.error("Failed to delete tag"))}>
                    <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
