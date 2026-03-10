"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { AddLinkDialog } from "@/components/add-link-dialog"
import { LinkFavicon } from "@/components/link-favicon"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  SlidersHorizontalIcon,
  Sorting05Icon,
  ArrowDown01Icon,
  MoreHorizontalIcon,
  GridViewIcon,
  ListViewIcon,
  Share01Icon,
  Copy01Icon,
  Delete01Icon,
  Edit02Icon,
  Link01Icon,
  ArrowUpRight01Icon,
  StarIcon,
  FolderOpenIcon,
  LockIcon,
  Add01Icon,
} from "@hugeicons/core-free-icons"
import type { Link, Folder, Tag } from "@/lib/types"
import type { SidebarUser } from "@/components/app-sidebar"
import { formatDate } from "@/lib/utils"
import { toggleLinkFavorite, trashLink } from "@/lib/actions/links"
import { EditLinkDialog } from "@/components/edit-link-dialog"
import { toast } from "sonner"

// ─── Link Context Menu ────────────────────────────────────────────────────────

function LinkContextMenu({ link, folders }: { link: Link; folders: Folder[] }) {
  const [editOpen, setEditOpen] = React.useState(false)

  return (
    <>
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
          <DropdownMenuItem className="gap-2 text-xs" onSelect={() => setEditOpen(true)}>
            <HugeiconsIcon icon={Edit02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-xs">
            <HugeiconsIcon icon={Share01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-xs" onClick={() => toggleLinkFavorite(link.id, !link.is_favorite).then(() => toast.success(link.is_favorite ? "Removed from favorites" : "Added to favorites")).catch(() => toast.error("Failed to update favorite"))}>
            <HugeiconsIcon icon={StarIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            {link.is_favorite ? "Unfavorite" : "Favorite"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-xs text-destructive" onClick={() => trashLink(link.id).then(() => toast.success("Link moved to trash")).catch(() => toast.error("Failed to delete link"))}>
            <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Move to Trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditLinkDialog link={link} folders={folders} open={editOpen} onOpenChange={setEditOpen} />
    </>
  )
}

// ─── Links Content ────────────────────────────────────────────────────────────

interface LinksContentProps {
  user: SidebarUser | null
  links: Link[]
  folders: Folder[]
}

export function LinksContent({ user, links, folders }: LinksContentProps) {
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
    <DashboardShell title="My Links" breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Links" }]} user={user}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">My Links</h2>
          <p className="text-xs text-muted-foreground">{links.length} links saved</p>
        </div>

        <div className="flex items-center gap-2">
          <AddLinkDialog folders={folders}>
            <Button size="sm" className="gap-1.5">
              <HugeiconsIcon icon={Link01Icon} size={15} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              Add Link
            </Button>
          </AddLinkDialog>
          <div className="relative max-w-xs w-full">
            <HugeiconsIcon icon={Search01Icon} size={15} color="currentColor" strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Input placeholder="Search links..." className="pl-8 h-8 text-xs w-56" />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <HugeiconsIcon icon={SlidersHorizontalIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Filter
          </Button>
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
            <HugeiconsIcon icon={Share01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Share
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

      {/* ── Sort bar ── */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{links.length} links</span>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
          <HugeiconsIcon icon={Sorting05Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
          Newest First
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} color="currentColor" strokeWidth={2} aria-hidden="true" />
        </Button>
      </div>

      {/* ── Empty state ── */}
      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-14 rounded-xl bg-muted flex items-center justify-center mb-3">
            <HugeiconsIcon icon={Link01Icon} size={24} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No links yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Add your first link to get started.
          </p>
          <AddLinkDialog folders={folders}>
            <Button size="sm" className="mt-4 gap-1.5">
              <HugeiconsIcon icon={Add01Icon} size={15} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              Add your first link
            </Button>
          </AddLinkDialog>
        </div>
      )}

      {/* ── Grid View ── */}
      {links.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {links.map((link) => {
            const tags = (link.tags ?? []) as Tag[]
            const folderName = link.folder_id ? folderMap.get(link.folder_id) : null

            return (
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

                {link.is_favorite && (
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <HugeiconsIcon icon={StarIcon} size={14} color="currentColor" strokeWidth={2} className="text-amber-500" aria-hidden="true" />
                  </div>
                )}

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
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="text-[9px] px-1.5 py-0">{tag.name}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{formatDate(link.created_at)}</span>
                    {folderName && (
                      <Badge variant="secondary" className="text-[9px] gap-0.5 px-1.5 py-0">
                        <HugeiconsIcon icon={FolderOpenIcon} size={9} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                        {folderName}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`Open ${link.title}`} onClick={(e) => { e.stopPropagation(); window.open(link.url, "_blank") }}>
                      <HugeiconsIcon icon={ArrowUpRight01Icon} size={13} color="currentColor" strokeWidth={2} aria-hidden="true" />
                    </Button>
                    <LinkContextMenu link={link} folders={folders} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── List View ── */}
      {links.length > 0 && viewMode === "list" && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_140px_120px_80px_40px] items-center gap-3 px-4 py-2.5 bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
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
            <span>Status</span>
            <span />
          </div>

          {links.map((link) => {
            const folderName = link.folder_id ? folderMap.get(link.folder_id) : null

            return (
              <div
                key={link.id}
                className={`grid grid-cols-[auto_1fr_140px_120px_80px_40px] items-center gap-3 px-4 py-2.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors ${
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
                    <p className="text-sm font-medium truncate">{link.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{link.domain}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {folderName ? (
                    <span className="inline-flex items-center gap-1">
                      <HugeiconsIcon icon={FolderOpenIcon} size={12} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      {folderName}
                    </span>
                  ) : "—"}
                </span>
                <span className="text-xs text-muted-foreground">{formatDate(link.created_at)}</span>
                <div>
                  <Badge variant="outline" className="text-[9px] gap-1 px-1.5 py-0.5">
                    <HugeiconsIcon icon={LockIcon} size={10} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Private
                  </Badge>
                </div>
                <LinkContextMenu link={link} folders={folders} />
              </div>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
