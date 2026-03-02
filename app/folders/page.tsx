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
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

// ─── Mock data ────────────────────────────────────────────────────────────────

interface FolderItem {
  id: string
  name: string
  linksCount: number
  shared: boolean
  createdAt: string
  color: string
}

const mockFolders: FolderItem[] = [
  { id: "1", name: "Development", linksCount: 24, shared: true, createdAt: "Dec 20, 2024", color: "bg-blue-500/15 text-blue-600" },
  { id: "2", name: "Design", linksCount: 12, shared: true, createdAt: "Dec 18, 2024", color: "bg-purple-500/15 text-purple-600" },
  { id: "3", name: "Marketing", linksCount: 8, shared: false, createdAt: "Dec 15, 2024", color: "bg-green-500/15 text-green-600" },
  { id: "4", name: "Personal", linksCount: 15, shared: false, createdAt: "Dec 10, 2024", color: "bg-amber-500/15 text-amber-600" },
  { id: "5", name: "Reading List", linksCount: 31, shared: false, createdAt: "Nov 28, 2024", color: "bg-rose-500/15 text-rose-600" },
  { id: "6", name: "Inspiration", linksCount: 7, shared: true, createdAt: "Nov 15, 2024", color: "bg-cyan-500/15 text-cyan-600" },
]

// ─── New Folder Dialog ────────────────────────────────────────────────────────

function NewFolderDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
          <DialogDescription>Create a new folder to organize your links.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label htmlFor="folder-name" className="text-sm font-medium">Folder name</Label>
            <Input id="folder-name" placeholder="Untitled folder" />
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

export default function FoldersPage() {
  return (
    <DashboardShell title="Folders" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Folders" }]}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Folders</h2>
          <p className="text-xs text-muted-foreground">{mockFolders.length} folders</p>
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

      {/* ── Folder Grid ── */}
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

        {mockFolders.map((folder) => (
          <div
            key={folder.id}
            className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex-1 p-4 space-y-3">
              {/* Icon + actions */}
              <div className="flex items-start justify-between">
                <div className={`size-10 rounded-lg flex items-center justify-center ${folder.color}`}>
                  <HugeiconsIcon icon={Folder01Icon} size={20} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`More options for ${folder.name}`}>
                      <HugeiconsIcon icon={MoreHorizontalIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem className="gap-2 text-xs">
                      <HugeiconsIcon icon={Edit02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <HugeiconsIcon icon={Share01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-xs text-destructive">
                      <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Name */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">{folder.name}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {folder.linksCount} links · {folder.createdAt}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Link01Icon} size={12} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
                <span className="text-[10px] text-muted-foreground">{folder.linksCount} links</span>
              </div>
              {folder.shared && (
                <Badge variant="secondary" className="text-[9px] gap-0.5 px-1.5 py-0">
                  <HugeiconsIcon icon={Share01Icon} size={9} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                  Shared
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
