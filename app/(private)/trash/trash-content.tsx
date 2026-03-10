"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { LinkFavicon } from "@/components/link-favicon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
  MoreHorizontalIcon,
  ArrowUpRight01Icon,
  Copy01Icon,
  Delete01Icon,
  RestoreBinIcon,
  Clock01Icon,
  FolderOpenIcon,
} from "@hugeicons/core-free-icons"
import type { Link, Folder } from "@/lib/types"
import type { SidebarUser } from "@/components/app-sidebar"
import { formatDate } from "@/lib/utils"

// ─── Trash Content ────────────────────────────────────────────────────────────

interface TrashContentProps {
  user: SidebarUser | null
  links: Link[]
  folders: Folder[]
}

function daysUntilExpiry(trashedAt: string | null): string {
  if (!trashedAt) return "30 days"
  const trashed = new Date(trashedAt)
  const expiry = new Date(trashed.getTime() + 30 * 24 * 60 * 60 * 1000)
  const now = new Date()
  const days = Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))
  return `${days} days`
}

export function TrashContent({ user, links, folders }: TrashContentProps) {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())

  const allItems = React.useMemo(() => {
    const items: Array<{ id: string; type: "link" | "folder"; title: string; domain: string; url: string; trashedAt: string | null }> = []
    for (const link of links) {
      items.push({ id: link.id, type: "link", title: link.title, domain: link.domain, url: link.url, trashedAt: link.trashed_at })
    }
    for (const folder of folders) {
      items.push({ id: folder.id, type: "folder", title: folder.name, domain: "", url: "", trashedAt: folder.trashed_at })
    }
    return items
  }, [links, folders])

  function toggleSelection(id: string) {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <DashboardShell title="Trash" user={user} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Trash" }]}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Trash</h2>
          <p className="text-xs text-muted-foreground">
            {allItems.length} items · Items in trash are permanently deleted after 30 days
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative max-w-xs w-full">
            <HugeiconsIcon icon={Search01Icon} size={15} color="currentColor" strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Input placeholder="Search trash..." className="pl-8 h-8 text-xs w-56" />
          </div>
          {allItems.length > 0 && (
            <Button variant="destructive" size="sm" className="gap-1.5 text-xs">
              <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              Empty Trash
            </Button>
          )}
        </div>
      </div>

      {/* ── Bulk actions ── */}
      {selectedItems.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
          <span className="text-xs font-medium text-primary">{selectedItems.size} selected</span>
          <Separator orientation="vertical" className="h-4" />
          <Button variant="ghost" size="xs" className="gap-1.5 text-xs">
            <HugeiconsIcon icon={RestoreBinIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Restore
          </Button>
          <Button variant="ghost" size="xs" className="gap-1.5 text-xs text-destructive">
            <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Delete permanently
          </Button>
          <div className="ml-auto">
            <Button variant="ghost" size="xs" className="text-xs text-muted-foreground" onClick={() => setSelectedItems(new Set())}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* ── Trash List ── */}
      {allItems.length > 0 ? (
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_140px_100px_40px] items-center gap-3 px-4 py-2.5 bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
            <Checkbox
              checked={selectedItems.size === allItems.length && allItems.length > 0}
              onCheckedChange={(checked) => {
                if (checked) setSelectedItems(new Set(allItems.map((i) => i.id)))
                else setSelectedItems(new Set())
              }}
              aria-label="Select all"
            />
            <span>Item</span>
            <span>Deleted</span>
            <span>Expires in</span>
            <span />
          </div>

          {/* Rows */}
          {allItems.map((item) => (
            <div
              key={item.id}
              className={`grid grid-cols-[auto_1fr_140px_100px_40px] items-center gap-3 px-4 py-2.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors ${
                selectedItems.has(item.id) ? "bg-primary/5" : ""
              }`}
              onClick={() => toggleSelection(item.id)}
            >
              <Checkbox
                checked={selectedItems.has(item.id)}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => toggleSelection(item.id)}
                aria-label={`Select ${item.title}`}
              />

              {/* Item info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden opacity-50">
                  {item.type === "link" ? (
                    <LinkFavicon domain={item.domain} size={32} />
                  ) : (
                    <HugeiconsIcon icon={FolderOpenIcon} size={16} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-muted-foreground line-through decoration-muted-foreground/50">{item.title}</p>
                  {item.domain && <p className="text-[10px] text-muted-foreground truncate">{item.domain}</p>}
                </div>
              </div>

              {/* Deleted date */}
              <span className="text-xs text-muted-foreground">{formatDate(item.trashedAt ?? "")}</span>

              {/* Expires */}
              <Badge variant="outline" className="text-[9px] gap-1 px-1.5 py-0.5 text-muted-foreground">
                <HugeiconsIcon icon={Clock01Icon} size={10} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                {daysUntilExpiry(item.trashedAt)}
              </Badge>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`More options for ${item.title}`} onClick={(e) => e.stopPropagation()}>
                    <HugeiconsIcon icon={MoreHorizontalIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem className="gap-2 text-xs">
                    <HugeiconsIcon icon={RestoreBinIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Restore
                  </DropdownMenuItem>
                  {item.url && (
                    <DropdownMenuItem className="gap-2 text-xs" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                        Open link
                      </a>
                    </DropdownMenuItem>
                  )}
                  {item.url && (
                    <DropdownMenuItem className="gap-2 text-xs">
                      <HugeiconsIcon icon={Copy01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Copy URL
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-xs text-destructive">
                    <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Delete permanently
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-14 rounded-xl bg-muted flex items-center justify-center mb-3">
            <HugeiconsIcon icon={Delete01Icon} size={24} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Trash is empty</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Links you delete will appear here for 30 days before being permanently removed.
          </p>
        </div>
      )}
    </DashboardShell>
  )
}
