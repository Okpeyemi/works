"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { LinkFavicon } from "@/components/link-favicon"
import { Button } from "@/components/ui/button"
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
  MoreHorizontalIcon,
  ArrowUpRight01Icon,
  Copy01Icon,
  Clock01Icon,
  Share01Icon,
  StarIcon,
  Edit02Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons"

// ─── Mock data ────────────────────────────────────────────────────────────────

interface RecentLink {
  id: string
  title: string
  url: string
  domain: string
  visitedAt: string
  shared: boolean
}

const recentLinks: RecentLink[] = [
  { id: "1", title: "React Documentation", url: "https://react.dev", domain: "react.dev", visitedAt: "2 minutes ago", shared: true },
  { id: "2", title: "Tailwind CSS", url: "https://tailwindcss.com", domain: "tailwindcss.com", visitedAt: "15 minutes ago", shared: false },
  { id: "3", title: "GitHub - shadcn/ui", url: "https://github.com/shadcn-ui/ui", domain: "github.com", visitedAt: "1 hour ago", shared: true },
  { id: "4", title: "Figma - Design Tool", url: "https://figma.com", domain: "figma.com", visitedAt: "2 hours ago", shared: true },
  { id: "5", title: "Prisma ORM", url: "https://prisma.io", domain: "prisma.io", visitedAt: "3 hours ago", shared: false },
  { id: "6", title: "Vercel", url: "https://vercel.com", domain: "vercel.com", visitedAt: "5 hours ago", shared: false },
  { id: "7", title: "MDN Web Docs", url: "https://developer.mozilla.org", domain: "developer.mozilla.org", visitedAt: "Yesterday", shared: false },
  { id: "8", title: "Dribbble", url: "https://dribbble.com", domain: "dribbble.com", visitedAt: "Yesterday", shared: true },
  { id: "9", title: "Next.js Docs", url: "https://nextjs.org/docs", domain: "nextjs.org", visitedAt: "2 days ago", shared: false },
  { id: "10", title: "Notion", url: "https://notion.so", domain: "notion.so", visitedAt: "3 days ago", shared: false },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RecentPage() {
  return (
    <DashboardShell title="Recent" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Recent" }]}>

      {/* ── Header ── */}
      <div>
        <h2 className="text-lg font-semibold">Recent</h2>
        <p className="text-xs text-muted-foreground">Links you recently viewed or edited</p>
      </div>

      {/* ── Today ── */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today</h3>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {recentLinks.filter(l => !l.visitedAt.includes("Yesterday") && !l.visitedAt.includes("days")).map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                <LinkFavicon domain={link.domain} size={32} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{link.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{link.domain}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {link.shared && (
                  <Badge variant="secondary" className="text-[9px] gap-0.5 px-1.5 py-0">
                    <HugeiconsIcon icon={Share01Icon} size={9} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Shared
                  </Badge>
                )}
                <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <HugeiconsIcon icon={Clock01Icon} size={11} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                  {link.visitedAt}
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
                    <DropdownMenuItem className="gap-2 text-xs">
                      <HugeiconsIcon icon={Copy01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <HugeiconsIcon icon={Edit02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <HugeiconsIcon icon={StarIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Favorite
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-xs text-destructive">
                      <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Move to Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Earlier ── */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Earlier</h3>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {recentLinks.filter(l => l.visitedAt.includes("Yesterday") || l.visitedAt.includes("days")).map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                <LinkFavicon domain={link.domain} size={32} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{link.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{link.domain}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {link.shared && (
                  <Badge variant="secondary" className="text-[9px] gap-0.5 px-1.5 py-0">
                    <HugeiconsIcon icon={Share01Icon} size={9} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Shared
                  </Badge>
                )}
                <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <HugeiconsIcon icon={Clock01Icon} size={11} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                  {link.visitedAt}
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
                    <DropdownMenuItem className="gap-2 text-xs">
                      <HugeiconsIcon icon={Copy01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <HugeiconsIcon icon={StarIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Favorite
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-xs text-destructive">
                      <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Move to Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
