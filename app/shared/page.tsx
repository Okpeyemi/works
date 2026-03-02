"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { LinkFavicon } from "@/components/link-favicon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
} from "@hugeicons/core-free-icons"

// ─── Mock data ────────────────────────────────────────────────────────────────

interface SharedLink {
  id: string
  title: string
  url: string
  domain: string
  sharedBy: { name: string; initials: string }
  permission: "read" | "write"
  sharedAt: string
}

const sharedWithMe: SharedLink[] = [
  {
    id: "1", title: "Marketing Strategy 2025", url: "https://docs.google.com/document/d/marketing-2025",
    domain: "docs.google.com",
    sharedBy: { name: "Sarah Chen", initials: "SC" },
    permission: "write", sharedAt: "Today, 14:20",
  },
  {
    id: "2", title: "Brand Guidelines", url: "https://figma.com/file/brand-guidelines",
    domain: "figma.com",
    sharedBy: { name: "Alex Rivera", initials: "AR" },
    permission: "read", sharedAt: "Yesterday",
  },
  {
    id: "3", title: "Q4 Analytics Dashboard", url: "https://analytics.google.com/q4-report",
    domain: "analytics.google.com",
    sharedBy: { name: "Sarah Chen", initials: "SC" },
    permission: "read", sharedAt: "Dec 18, 2024",
  },
  {
    id: "4", title: "Component Library RFC", url: "https://github.com/org/rfc-component-lib",
    domain: "github.com",
    sharedBy: { name: "John Doe", initials: "JD" },
    permission: "write", sharedAt: "Dec 15, 2024",
  },
  {
    id: "5", title: "Sprint Planning Board", url: "https://notion.so/sprint-planning",
    domain: "notion.so",
    sharedBy: { name: "Alex Rivera", initials: "AR" },
    permission: "read", sharedAt: "Dec 10, 2024",
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SharedPage() {
  return (
    <DashboardShell title="Shared with Me" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shared with Me" }]}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Shared with Me</h2>
          <p className="text-xs text-muted-foreground">{sharedWithMe.length} links shared with you</p>
        </div>

        <div className="relative max-w-xs w-full sm:w-auto">
          <HugeiconsIcon icon={Search01Icon} size={15} color="currentColor" strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <Input placeholder="Search shared links..." className="pl-8 h-8 text-xs w-56" />
        </div>
      </div>

      {/* ── List ── */}
      <div className="rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_160px_100px_100px_40px] items-center gap-3 px-4 py-2.5 bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>Link</span>
          <span>Shared by</span>
          <span>Permission</span>
          <span>Date</span>
          <span />
        </div>

        {sharedWithMe.map((link) => (
          <div
            key={link.id}
            className="grid grid-cols-[1fr_160px_100px_100px_40px] items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
          >
            {/* Link info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                <LinkFavicon domain={link.domain} size={32} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{link.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{link.domain}</p>
              </div>
            </div>

            {/* Shared by */}
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="size-6">
                <AvatarFallback className="text-[9px] font-semibold bg-secondary text-secondary-foreground">
                  {link.sharedBy.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">{link.sharedBy.name}</span>
            </div>

            {/* Permission */}
            <div>
              {link.permission === "write" ? (
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
            <span className="text-xs text-muted-foreground">{link.sharedAt}</span>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`More options for ${link.title}`}>
                  <HugeiconsIcon icon={MoreHorizontalIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
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
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
