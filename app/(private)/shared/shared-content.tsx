"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { LinkFavicon } from "@/components/link-favicon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  EyeIcon,
  Edit02Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons"
import type { SidebarUser } from "@/components/app-sidebar"
import { formatDate } from "@/lib/utils"
import { deleteShare } from "@/lib/actions/shares"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────

interface SharedItem {
  id: string
  permission: "READ" | "WRITE"
  created_at: string
  link: { id: string; title: string; url: string; domain: string } | null
  folder: { id: string; name: string } | null
  owner: { id: string; name: string | null; email: string; image: string | null } | null
}

// ─── Shared Content ───────────────────────────────────────────────────────────

interface SharedContentProps {
  user: SidebarUser | null
  shares: SharedItem[]
}

function getInitials(name: string | null | undefined, email: string): string {
  if (name) {
    const parts = name.split(" ")
    return parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase()
  }
  return email[0].toUpperCase()
}

export function SharedContent({ user, shares }: SharedContentProps) {
  return (
    <DashboardShell title="Shared with Me" user={user} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shared with Me" }]}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Shared with Me</h2>
          <p className="text-xs text-muted-foreground">{shares.length} items shared with you</p>
        </div>

        <div className="relative max-w-xs w-full sm:w-auto">
          <HugeiconsIcon icon={Search01Icon} size={15} color="currentColor" strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <Input placeholder="Search shared items..." className="pl-8 h-8 text-xs w-56" />
        </div>
      </div>

      {/* ── Empty state ── */}
      {shares.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-14 rounded-xl bg-muted flex items-center justify-center mb-3">
            <HugeiconsIcon icon={Share01Icon} size={24} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Nothing shared with you</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            When someone shares links or folders with you, they will appear here.
          </p>
        </div>
      )}

      {/* ── List ── */}
      {shares.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_160px_100px_100px_40px] items-center gap-3 px-4 py-2.5 bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
            <span>Item</span>
            <span>Shared by</span>
            <span>Permission</span>
            <span>Date</span>
            <span />
          </div>

          {shares.map((share) => {
            const title = share.link?.title ?? share.folder?.name ?? "Unknown"
            const domain = share.link?.domain ?? ""
            const url = share.link?.url ?? ""
            const ownerName = share.owner?.name ?? share.owner?.email ?? "Unknown"
            const ownerEmail = share.owner?.email ?? ""
            const ownerImage = share.owner?.image

            return (
              <div
                key={share.id}
                className="grid grid-cols-[1fr_160px_100px_100px_40px] items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                {/* Item info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {domain ? (
                      <LinkFavicon domain={domain} size={32} />
                    ) : (
                      <HugeiconsIcon icon={Share01Icon} size={16} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{title}</p>
                    {domain && <p className="text-[10px] text-muted-foreground truncate">{domain}</p>}
                  </div>
                </div>

                {/* Shared by */}
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="size-6">
                    {ownerImage && <AvatarImage src={ownerImage} alt={ownerName} />}
                    <AvatarFallback className="text-[9px] font-semibold bg-secondary text-secondary-foreground">
                      {getInitials(share.owner?.name, ownerEmail)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate">{ownerName}</span>
                </div>

                {/* Permission */}
                <div>
                  {share.permission === "WRITE" ? (
                    <Badge variant="default" className="text-[9px] gap-1 px-1.5 py-0.5">
                      <HugeiconsIcon icon={Edit02Icon} size={10} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Read & Write
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[9px] gap-1 px-1.5 py-0.5">
                      <HugeiconsIcon icon={EyeIcon} size={10} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Read only
                    </Badge>
                  )}
                </div>

                {/* Date */}
                <span className="text-xs text-muted-foreground">{formatDate(share.created_at)}</span>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`More options for ${title}`}>
                      <HugeiconsIcon icon={MoreHorizontalIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {url && (
                      <DropdownMenuItem className="gap-2 text-xs" asChild>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                          Open link
                        </a>
                      </DropdownMenuItem>
                    )}
                    {url && (
                      <DropdownMenuItem className="gap-2 text-xs" onClick={() => navigator.clipboard.writeText(url)}>
                        <HugeiconsIcon icon={Copy01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                        Copy URL
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-xs text-destructive" onClick={() => deleteShare(share.id).then(() => toast.success("Share removed")).catch(() => toast.error("Failed to remove share"))}>
                      <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
