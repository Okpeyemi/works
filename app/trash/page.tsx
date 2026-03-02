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
} from "@hugeicons/core-free-icons"

// ─── Mock data ────────────────────────────────────────────────────────────────

interface TrashedLink {
  id: string
  title: string
  url: string
  domain: string
  deletedAt: string
  expiresIn: string
}

const trashedLinks: TrashedLink[] = [
  { id: "1", title: "Old Blog Post", url: "https://blog.example.com/old-post", domain: "blog.example.com", deletedAt: "Today, 09:15", expiresIn: "30 days" },
  { id: "2", title: "Deprecated API Docs", url: "https://api.example.com/v1/docs", domain: "api.example.com", deletedAt: "Yesterday", expiresIn: "29 days" },
  { id: "3", title: "Test Link", url: "https://test.example.com", domain: "test.example.com", deletedAt: "Dec 18, 2024", expiresIn: "25 days" },
  { id: "4", title: "Outdated Tutorial", url: "https://tutorials.dev/old-vue-guide", domain: "tutorials.dev", deletedAt: "Dec 15, 2024", expiresIn: "22 days" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrashPage() {
  const [selectedLinks, setSelectedLinks] = React.useState<Set<string>>(new Set())

  function toggleSelection(id: string) {
    setSelectedLinks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <DashboardShell title="Trash" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Trash" }]}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Trash</h2>
          <p className="text-xs text-muted-foreground">
            {trashedLinks.length} items · Links in trash are permanently deleted after 30 days
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative max-w-xs w-full">
            <HugeiconsIcon icon={Search01Icon} size={15} color="currentColor" strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Input placeholder="Search trash..." className="pl-8 h-8 text-xs w-56" />
          </div>
          {trashedLinks.length > 0 && (
            <Button variant="destructive" size="sm" className="gap-1.5 text-xs">
              <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              Empty Trash
            </Button>
          )}
        </div>
      </div>

      {/* ── Bulk actions ── */}
      {selectedLinks.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
          <span className="text-xs font-medium text-primary">{selectedLinks.size} selected</span>
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
            <Button variant="ghost" size="xs" className="text-xs text-muted-foreground" onClick={() => setSelectedLinks(new Set())}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* ── Trash List ── */}
      {trashedLinks.length > 0 ? (
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_140px_100px_40px] items-center gap-3 px-4 py-2.5 bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
            <Checkbox
              checked={selectedLinks.size === trashedLinks.length && trashedLinks.length > 0}
              onCheckedChange={(checked) => {
                if (checked) setSelectedLinks(new Set(trashedLinks.map((l) => l.id)))
                else setSelectedLinks(new Set())
              }}
              aria-label="Select all"
            />
            <span>Link</span>
            <span>Deleted</span>
            <span>Expires in</span>
            <span />
          </div>

          {/* Rows */}
          {trashedLinks.map((link) => (
            <div
              key={link.id}
              className={`grid grid-cols-[auto_1fr_140px_100px_40px] items-center gap-3 px-4 py-2.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors ${
                selectedLinks.has(link.id) ? "bg-primary/5" : ""
              }`}
              onClick={() => toggleSelection(link.id)}
            >
              <Checkbox
                checked={selectedLinks.has(link.id)}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => toggleSelection(link.id)}
                aria-label={`Select ${link.title}`}
              />

              {/* Link info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden opacity-50">
                  <LinkFavicon domain={link.domain} size={32} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-muted-foreground line-through decoration-muted-foreground/50">{link.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{link.domain}</p>
                </div>
              </div>

              {/* Deleted date */}
              <span className="text-xs text-muted-foreground">{link.deletedAt}</span>

              {/* Expires */}
              <Badge variant="outline" className="text-[9px] gap-1 px-1.5 py-0.5 text-muted-foreground">
                <HugeiconsIcon icon={Clock01Icon} size={10} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                {link.expiresIn}
              </Badge>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`More options for ${link.title}`} onClick={(e) => e.stopPropagation()}>
                    <HugeiconsIcon icon={MoreHorizontalIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem className="gap-2 text-xs">
                    <HugeiconsIcon icon={RestoreBinIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Restore
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-xs" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Open link
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-xs">
                    <HugeiconsIcon icon={Copy01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Copy URL
                  </DropdownMenuItem>
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
