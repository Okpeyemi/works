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
  Edit02Icon,
  StarIcon,
  GridViewIcon,
  ListViewIcon,
  FolderOpenIcon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import type { Link, Folder } from "@/lib/types"
import type { SidebarUser } from "@/components/app-sidebar"
import { formatDate } from "@/lib/utils"
import { toggleLinkFavorite, trashLink } from "@/lib/actions/links"
import { toast } from "sonner"
// ─── Favorites Content ────────────────────────────────────────────────────────

interface FavoritesContentProps {
  user: SidebarUser | null
  links: Link[]
  folders: Folder[]
}

export function FavoritesContent({ user, links, folders }: FavoritesContentProps) {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [selectedLinks, setSelectedLinks] = React.useState<Set<string>>(new Set())

  const folderMap = React.useMemo(() => {
    const map = new Map<string, string>()
    for (const f of folders) map.set(f.id, f.name)
    return map
  }, [folders])

  function toggleSelection(id: string) {
    setSelectedLinks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <DashboardShell title="Favorites" user={user} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Favorites" }]}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Favorites</h2>
          <p className="text-xs text-muted-foreground">{links.length} favorite links</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative max-w-xs w-full">
            <HugeiconsIcon icon={Search01Icon} size={15} color="currentColor" strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Input placeholder="Search favorites..." className="pl-8 h-8 text-xs w-56" />
          </div>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-0.5">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon-sm" aria-label="Grid view" onClick={() => setViewMode("grid")}>
              <HugeiconsIcon icon={GridViewIcon} size={16} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon-sm" aria-label="List view" onClick={() => setViewMode("list")}>
              <HugeiconsIcon icon={ListViewIcon} size={16} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Bulk actions ── */}
      {selectedLinks.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
          <span className="text-xs font-medium text-primary">{selectedLinks.size} selected</span>
          <Separator orientation="vertical" />
          <Button variant="ghost" size="xs" className="gap-1.5 text-xs">
            <HugeiconsIcon icon={StarIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Unfavorite
          </Button>
          <Button variant="ghost" size="xs" className="gap-1.5 text-xs text-destructive">
            <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Delete
          </Button>
          <div className="ml-auto">
            <Button variant="ghost" size="xs" className="text-xs text-muted-foreground" onClick={() => setSelectedLinks(new Set())}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-14 rounded-xl bg-muted flex items-center justify-center mb-3">
            <HugeiconsIcon icon={StarIcon} size={24} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No favorites yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Star your most important links to find them quickly here.
          </p>
        </div>
      )}

      {/* ── Grid View ── */}
      {viewMode === "grid" && links.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {links.map((link) => (
            <div
              key={link.id}
              className={`group relative flex flex-col rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all ${
                selectedLinks.has(link.id) ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
              }`}
              onClick={() => toggleSelection(link.id)}
            >
              <div className={`absolute top-2.5 left-2.5 z-10 transition-opacity ${
                selectedLinks.has(link.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}>
                <Checkbox
                  checked={selectedLinks.has(link.id)}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => toggleSelection(link.id)}
                  aria-label={`Select ${link.title}`}
                />
              </div>

              <div className="absolute top-2.5 right-2.5 z-10">
                <HugeiconsIcon icon={StarIcon} size={14} color="currentColor" strokeWidth={2} className="text-amber-500" aria-hidden="true" />
              </div>

              <div className="flex-1 px-4 pt-4 pb-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="size-4 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    <LinkFavicon domain={link.domain} size={28} />
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate">{link.domain}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{link.title}</h3>
                {link.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{link.description}</p>
                )}
                {link.tags && link.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {link.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-[9px] px-1.5 py-0">{tag.name}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
                <span className="text-[10px] text-muted-foreground">{formatDate(link.created_at)}</span>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`Open ${link.title}`} onClick={(e) => { e.stopPropagation(); window.open(link.url, "_blank") }}>
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={13} color="currentColor" strokeWidth={2} aria-hidden="true" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`More options for ${link.title}`} onClick={(e) => e.stopPropagation()}>
                        <HugeiconsIcon icon={MoreHorizontalIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem className="gap-2 text-xs" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                          Open link
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-xs" onClick={() => navigator.clipboard.writeText(link.url)}>
                        <HugeiconsIcon icon={Copy01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-xs">
                        <HugeiconsIcon icon={Edit02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-xs" onClick={() => toggleLinkFavorite(link.id, false).then(() => toast.success("Removed from favorites")).catch(() => toast.error("Failed to update favorite"))}>
                        <HugeiconsIcon icon={StarIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                        Unfavorite
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-xs text-destructive" onClick={() => trashLink(link.id).then(() => toast.success("Link moved to trash")).catch(() => toast.error("Failed to delete link"))}>
                        <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                        Move to Trash
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── List View ── */}
      {viewMode === "list" && links.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_140px_120px_40px] items-center gap-3 px-4 py-2.5 bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
            <Checkbox
              checked={selectedLinks.size === links.length && links.length > 0}
              onCheckedChange={(checked) => {
                if (checked) setSelectedLinks(new Set(links.map((l) => l.id)))
                else setSelectedLinks(new Set())
              }}
              aria-label="Select all links"
            />
            <span>Link</span>
            <span>Folder</span>
            <span>Added</span>
            <span />
          </div>

          {links.map((link) => (
            <div
              key={link.id}
              className={`grid grid-cols-[auto_1fr_140px_120px_40px] items-center gap-3 px-4 py-2.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors ${
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
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  <LinkFavicon domain={link.domain} size={32} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium truncate">{link.title}</p>
                    <HugeiconsIcon icon={StarIcon} size={12} color="currentColor" strokeWidth={2} className="text-amber-500 shrink-0" aria-hidden="true" />
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{link.domain}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground truncate">
                {link.folder_id ? (
                  <span className="inline-flex items-center gap-1">
                    <HugeiconsIcon icon={FolderOpenIcon} size={12} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    {folderMap.get(link.folder_id) ?? "—"}
                  </span>
                ) : "—"}
              </span>
              <span className="text-xs text-muted-foreground">{formatDate(link.created_at)}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`More options for ${link.title}`} onClick={(e) => e.stopPropagation()}>
                    <HugeiconsIcon icon={MoreHorizontalIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem className="gap-2 text-xs" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Open link
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-xs" onClick={() => navigator.clipboard.writeText(link.url)}>
                    <HugeiconsIcon icon={Copy01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-xs" onClick={() => toggleLinkFavorite(link.id, false)}>
                    <HugeiconsIcon icon={StarIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Unfavorite
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-xs text-destructive" onClick={() => trashLink(link.id)}>
                    <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Move to Trash
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
