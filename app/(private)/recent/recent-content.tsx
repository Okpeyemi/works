"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { LinkFavicon } from "@/components/link-favicon"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MoreHorizontalIcon,
  ArrowUpRight01Icon,
  Copy01Icon,
  Clock01Icon,
  StarIcon,
  Edit02Icon,
  Delete01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import type { Link, Folder } from "@/lib/types"
import type { SidebarUser } from "@/components/app-sidebar"
import { formatRelativeTime } from "@/lib/utils"
import { toggleLinkFavorite, trashLink } from "@/lib/actions/links"
import { EditLinkDialog } from "@/components/edit-link-dialog"
import { toast } from "sonner"

// ─── Recent Content ───────────────────────────────────────────────────────────

interface RecentContentProps {
  user: SidebarUser | null
  links: Link[]
  folders: Folder[]
}

export function RecentContent({ user, links, folders }: RecentContentProps) {
  const now = new Date()

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayLinks = links.filter((l) => new Date(l.created_at) >= todayStart)
  const earlierLinks = links.filter((l) => new Date(l.created_at) < todayStart)

  return (
    <DashboardShell title="Recent" user={user} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Recent" }]}>

      {/* ── Header ── */}
      <div>
        <h2 className="text-lg font-semibold">Recent</h2>
        <p className="text-xs text-muted-foreground">Your most recently added links</p>
      </div>

      {/* ── Empty state ── */}
      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-14 rounded-xl bg-muted flex items-center justify-center mb-3">
            <HugeiconsIcon icon={Clock01Icon} size={24} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No recent links</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Links you add will appear here sorted by date.
          </p>
        </div>
      )}

      {/* ── Today ── */}
      {todayLinks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today</h3>
          <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {todayLinks.map((link) => (
              <RecentLinkRow key={link.id} link={link} folders={folders} />
            ))}
          </div>
        </div>
      )}

      {/* ── Earlier ── */}
      {earlierLinks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Earlier</h3>
          <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {earlierLinks.map((link) => (
              <RecentLinkRow key={link.id} link={link} folders={folders} />
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  )
}

// ─── Recent Link Row ──────────────────────────────────────────────────────────

function RecentLinkRow({ link, folders }: { link: Link; folders: Folder[] }) {
  const [editOpen, setEditOpen] = React.useState(false)

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
        <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
          <LinkFavicon domain={link.domain} size={32} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{link.title}</p>
          <p className="text-[10px] text-muted-foreground truncate">{link.domain}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <HugeiconsIcon icon={Clock01Icon} size={11} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            {formatRelativeTime(link.created_at)}
          </span>
          <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`Open ${link.title}`} asChild>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={13} color="currentColor" strokeWidth={2} aria-hidden="true" />
            </a>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`More options for ${link.title}`}>
                <HugeiconsIcon icon={MoreHorizontalIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="gap-2 text-xs" onClick={() => navigator.clipboard.writeText(link.url)}>
                <HugeiconsIcon icon={Copy01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                Copy URL
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs" onSelect={() => setEditOpen(true)}>
                <HugeiconsIcon icon={Edit02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                Edit
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
        </div>
      </div>
      <EditLinkDialog link={link} folders={folders} open={editOpen} onOpenChange={setEditOpen} />
    </>
  )
}
