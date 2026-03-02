"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

// ─── Mock data ────────────────────────────────────────────────────────────────

interface TagItem {
  id: string
  name: string
  linksCount: number
  color: string
}

const mockTags: TagItem[] = [
  { id: "1", name: "react",        linksCount: 12, color: "bg-blue-500/15 text-blue-600 border-blue-500/20" },
  { id: "2", name: "docs",         linksCount: 8,  color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  { id: "3", name: "design",       linksCount: 15, color: "bg-purple-500/15 text-purple-600 border-purple-500/20" },
  { id: "4", name: "css",          linksCount: 6,  color: "bg-cyan-500/15 text-cyan-600 border-cyan-500/20" },
  { id: "5", name: "ui",           linksCount: 9,  color: "bg-pink-500/15 text-pink-600 border-pink-500/20" },
  { id: "6", name: "components",   linksCount: 7,  color: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
  { id: "7", name: "tools",        linksCount: 11, color: "bg-orange-500/15 text-orange-600 border-orange-500/20" },
  { id: "8", name: "database",     linksCount: 4,  color: "bg-green-500/15 text-green-600 border-green-500/20" },
  { id: "9", name: "hosting",      linksCount: 3,  color: "bg-violet-500/15 text-violet-600 border-violet-500/20" },
  { id: "10", name: "reference",   linksCount: 5,  color: "bg-rose-500/15 text-rose-600 border-rose-500/20" },
  { id: "11", name: "inspiration", linksCount: 8,  color: "bg-indigo-500/15 text-indigo-600 border-indigo-500/20" },
  { id: "12", name: "productivity",linksCount: 3,  color: "bg-teal-500/15 text-teal-600 border-teal-500/20" },
]

// ─── Create Tag Dialog ────────────────────────────────────────────────────────

function CreateTagDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create tag</DialogTitle>
          <DialogDescription>Add a new tag to categorize your links.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label htmlFor="tag-name" className="text-sm font-medium">Tag name</Label>
            <Input id="tag-name" placeholder="e.g. frontend" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TagsPage() {
  return (
    <DashboardShell title="Tags" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tags" }]}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tags</h2>
          <p className="text-xs text-muted-foreground">{mockTags.length} tags</p>
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

      {/* ── Tags Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {mockTags.map((tag) => (
          <div
            key={tag.id}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 cursor-pointer hover:shadow-md transition-all"
          >
            {/* Tag icon */}
            <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${tag.color}`}>
              <HugeiconsIcon icon={Tag01Icon} size={18} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">#{tag.name}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <HugeiconsIcon icon={Link01Icon} size={10} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                {tag.linksCount} links
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
                <DropdownMenuItem className="gap-2 text-xs text-destructive">
                  <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
