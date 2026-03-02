"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { AddLinkDialog } from "@/components/add-link-dialog"
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
  ArrowUpRight01Icon,
  StarIcon,
  GlobeIcon,
  LockIcon,
  FolderOpenIcon,
  Link01Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons"

// ─── Mock data ────────────────────────────────────────────────────────────────

interface LinkItem {
  id: string
  title: string
  url: string
  description: string
  domain: string
  folder: string | null
  tags: string[]
  shared: boolean
  isFavorite: boolean
  createdAt: string
}

const myLinks: LinkItem[] = [
  {
    id: "1", title: "React Documentation", url: "https://react.dev",
    description: "The library for web and native user interfaces",
    domain: "react.dev", folder: "Development", tags: ["react", "docs"],
    shared: true, isFavorite: true, createdAt: "Today, 10:32",
  },
  {
    id: "2", title: "Tailwind CSS", url: "https://tailwindcss.com",
    description: "Rapidly build modern websites without ever leaving your HTML",
    domain: "tailwindcss.com", folder: "Development", tags: ["css", "design"],
    shared: false, isFavorite: false, createdAt: "Yesterday",
  },
  {
    id: "3", title: "GitHub - shadcn/ui", url: "https://github.com/shadcn-ui/ui",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS",
    domain: "github.com", folder: "Development", tags: ["ui", "components"],
    shared: true, isFavorite: true, createdAt: "Dec 18, 2024",
  },
  {
    id: "4", title: "Figma - Design Tool", url: "https://figma.com",
    description: "The collaborative interface design tool",
    domain: "figma.com", folder: "Design", tags: ["design", "tools"],
    shared: true, isFavorite: false, createdAt: "Dec 15, 2024",
  },
  {
    id: "5", title: "Prisma ORM", url: "https://prisma.io",
    description: "Next-generation ORM for Node.js and TypeScript",
    domain: "prisma.io", folder: "Development", tags: ["database", "orm"],
    shared: false, isFavorite: false, createdAt: "Dec 12, 2024",
  },
  {
    id: "6", title: "Vercel", url: "https://vercel.com",
    description: "Develop. Preview. Ship.",
    domain: "vercel.com", folder: null, tags: ["hosting"],
    shared: false, isFavorite: true, createdAt: "Dec 10, 2024",
  },
  {
    id: "7", title: "MDN Web Docs", url: "https://developer.mozilla.org",
    description: "Resources for developers, by developers",
    domain: "developer.mozilla.org", folder: "Development", tags: ["docs", "reference"],
    shared: false, isFavorite: false, createdAt: "Dec 8, 2024",
  },
  {
    id: "8", title: "Dribbble", url: "https://dribbble.com",
    description: "Discover the world's top designers & creatives",
    domain: "dribbble.com", folder: "Design", tags: ["design", "inspiration"],
    shared: true, isFavorite: false, createdAt: "Dec 5, 2024",
  },
  {
    id: "9", title: "Next.js Docs", url: "https://nextjs.org/docs",
    description: "The React Framework for the Web",
    domain: "nextjs.org", folder: "Development", tags: ["next", "react"],
    shared: false, isFavorite: true, createdAt: "Nov 28, 2024",
  },
  {
    id: "10", title: "Notion", url: "https://notion.so",
    description: "Your connected workspace for teams and individuals",
    domain: "notion.so", folder: "Personal", tags: ["productivity"],
    shared: false, isFavorite: false, createdAt: "Nov 20, 2024",
  },
]

// ─── Link Context Menu ────────────────────────────────────────────────────────

function LinkContextMenu({ link }: { link: LinkItem }) {
  return (
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
        <DropdownMenuItem className="gap-2 text-xs">
          <HugeiconsIcon icon={Copy01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
          Copy URL
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-xs">
          <HugeiconsIcon icon={Edit02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-xs">
          <HugeiconsIcon icon={Share01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
          Share
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
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LinksPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
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
    <DashboardShell title="My Links" breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Links" }]}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">My Links</h2>
          <p className="text-xs text-muted-foreground">{myLinks.length} links saved</p>
        </div>

        <div className="flex items-center gap-2">
          <AddLinkDialog>
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
          <Separator orientation="vertical" className="h-4" />
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
        <span className="text-sm text-muted-foreground">{myLinks.length} links</span>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
          <HugeiconsIcon icon={Sorting05Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
          Newest First
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} color="currentColor" strokeWidth={2} aria-hidden="true" />
        </Button>
      </div>

      {/* ── Grid View ── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {myLinks.map((link) => (
            <div
              key={link.id}
              className={`group relative flex flex-col rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all ${
                selectedLinks.has(link.id) ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
              }`}
              onClick={() => toggleSelection(link.id)}
            >
              {/* Checkbox */}
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

              {link.isFavorite && (
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
                {link.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {link.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{link.createdAt}</span>
                  {link.shared && (
                    <Badge variant="secondary" className="text-[9px] gap-0.5 px-1.5 py-0">
                      <HugeiconsIcon icon={Share01Icon} size={9} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                      Shared
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label={`Open ${link.title}`} onClick={(e) => { e.stopPropagation(); window.open(link.url, "_blank") }}>
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={13} color="currentColor" strokeWidth={2} aria-hidden="true" />
                  </Button>
                  <LinkContextMenu link={link} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── List View ── */}
      {viewMode === "list" && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_140px_120px_80px_40px] items-center gap-3 px-4 py-2.5 bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
            <Checkbox
              checked={selectedLinks.size === myLinks.length && myLinks.length > 0}
              onCheckedChange={(checked) => {
                if (checked) setSelectedLinks(new Set(myLinks.map((l) => l.id)))
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

          {myLinks.map((link) => (
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
                {link.folder ? (
                  <span className="inline-flex items-center gap-1">
                    <HugeiconsIcon icon={FolderOpenIcon} size={12} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    {link.folder}
                  </span>
                ) : "—"}
              </span>
              <span className="text-xs text-muted-foreground">{link.createdAt}</span>
              <div>
                {link.shared ? (
                  <Badge variant="secondary" className="text-[9px] gap-1 px-1.5 py-0.5">
                    <HugeiconsIcon icon={Share01Icon} size={10} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Shared
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] gap-1 px-1.5 py-0.5">
                    <HugeiconsIcon icon={LockIcon} size={10} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    Private
                  </Badge>
                )}
              </div>
              <LinkContextMenu link={link} />
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
