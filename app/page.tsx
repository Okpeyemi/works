"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { AddLinkDialog } from "@/components/add-link-dialog"
import { LinkFavicon } from "@/components/link-favicon"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Checkbox } from "@/components/ui/checkbox"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  SlidersHorizontalIcon,
  Sorting05Icon,
  ArrowDown01Icon,
  MoreHorizontalIcon,
  Add01Icon,
  GridViewIcon,
  ListViewIcon,
  FolderAddIcon,
  Share01Icon,
  Copy01Icon,
  Delete01Icon,
  Edit02Icon,
  Link01Icon,
  UserAdd01Icon,
  EyeIcon,
  LockIcon,
  GlobeIcon,
  ArrowUpRight01Icon,
  StarIcon,
  FolderOpenIcon,
  CopyLinkIcon,
} from "@hugeicons/core-free-icons"

// ─── Mock data ────────────────────────────────────────────────────────────────

interface LinkItem {
  id: string
  title: string
  url: string
  description: string
  domain: string
  favicon: string
  folder: string | null
  tags: string[]
  shared: boolean
  isFavorite: boolean
  createdAt: string
}

const allLinks: LinkItem[] = [
  {
    id: "1", title: "React Documentation", url: "https://react.dev",
    description: "The library for web and native user interfaces",
    domain: "react.dev", favicon: "https://react.dev/favicon.ico",
    folder: "Development", tags: ["react", "docs"], shared: true, isFavorite: true,
    createdAt: "Today, 10:32",
  },
  {
    id: "2", title: "Tailwind CSS", url: "https://tailwindcss.com",
    description: "Rapidly build modern websites without ever leaving your HTML",
    domain: "tailwindcss.com", favicon: "https://tailwindcss.com/favicon.ico",
    folder: "Development", tags: ["css", "design"], shared: false, isFavorite: false,
    createdAt: "Yesterday",
  },
  {
    id: "3", title: "GitHub - shadcn/ui", url: "https://github.com/shadcn-ui/ui",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS",
    domain: "github.com", favicon: "https://github.com/favicon.ico",
    folder: "Development", tags: ["ui", "components"], shared: true, isFavorite: true,
    createdAt: "Dec 18, 2024",
  },
  {
    id: "4", title: "Figma - Design Tool", url: "https://figma.com",
    description: "The collaborative interface design tool",
    domain: "figma.com", favicon: "https://figma.com/favicon.ico",
    folder: "Design", tags: ["design", "tools"], shared: true, isFavorite: false,
    createdAt: "Dec 15, 2024",
  },
  {
    id: "5", title: "Prisma ORM", url: "https://prisma.io",
    description: "Next-generation ORM for Node.js and TypeScript",
    domain: "prisma.io", favicon: "https://prisma.io/favicon.ico",
    folder: "Development", tags: ["database", "orm"], shared: false, isFavorite: false,
    createdAt: "Dec 12, 2024",
  },
  {
    id: "6", title: "Vercel", url: "https://vercel.com",
    description: "Develop. Preview. Ship.",
    domain: "vercel.com", favicon: "https://vercel.com/favicon.ico",
    folder: null, tags: ["hosting"], shared: false, isFavorite: true,
    createdAt: "Dec 10, 2024",
  },
  {
    id: "7", title: "MDN Web Docs", url: "https://developer.mozilla.org",
    description: "Resources for developers, by developers",
    domain: "developer.mozilla.org", favicon: "https://developer.mozilla.org/favicon.ico",
    folder: "Development", tags: ["docs", "reference"], shared: false, isFavorite: false,
    createdAt: "Dec 8, 2024",
  },
  {
    id: "8", title: "Dribbble", url: "https://dribbble.com",
    description: "Discover the world's top designers & creatives",
    domain: "dribbble.com", favicon: "https://dribbble.com/favicon.ico",
    folder: "Design", tags: ["design", "inspiration"], shared: true, isFavorite: false,
    createdAt: "Dec 5, 2024",
  },
]

// ─── Share Dialog ─────────────────────────────────────────────────────────────

function ShareDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Invite people to access this link. Choose read-only or read & write access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="invite-email" className="text-sm font-medium">
              Invite by email
            </Label>
            <div className="flex gap-2">
              <Input id="invite-email" placeholder="name@example.com" className="flex-1" type="email" />
              <Button size="sm">
                <HugeiconsIcon icon={UserAdd01Icon} size={15} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                Invite
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Permissions</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                <HugeiconsIcon icon={EyeIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                Read only
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                <HugeiconsIcon icon={Edit02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                Read & Write
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">People with access</Label>
            <div className="rounded-lg border border-border divide-y divide-border">
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Avatar className="size-7">
                  <AvatarFallback className="text-[10px] font-semibold bg-primary text-primary-foreground">AU</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Azunyan U. Wu</p>
                  <p className="text-[10px] text-muted-foreground">Owner</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Avatar className="size-7">
                  <AvatarFallback className="text-[10px] font-semibold bg-secondary text-secondary-foreground">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">John Doe</p>
                  <p className="text-[10px] text-muted-foreground">Can view</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">Read</Badge>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
            <HugeiconsIcon icon={CopyLinkIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Copy shareable link
          </Button>
        </div>

        <DialogFooter>
          <Button size="sm">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── New Folder Dialog ────────────────────────────────────────────────────────

function NewFolderDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your links.
          </DialogDescription>
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

// ─── Link Context Menu ────────────────────────────────────────────────────────

function LinkContextMenu({ link }: { link: LinkItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="shrink-0"
          aria-label={`More options for ${link.title}`}
          onClick={(e) => e.stopPropagation()}
        >
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

export default function HomePage() {
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
    <DashboardShell title="Home">
          {/* ── Quick actions bar ── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <AddLinkDialog>
                <Button size="sm" className="gap-1.5">
                  <HugeiconsIcon icon={Link01Icon} size={15} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                  Add Link
                </Button>
              </AddLinkDialog>
              <NewFolderDialog>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <HugeiconsIcon icon={FolderAddIcon} size={15} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                  New Folder
                </Button>
              </NewFolderDialog>
            </div>

            {/* Search + view toggle */}
            <div className="flex items-center gap-2">
              <div className="relative max-w-xs w-full">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={15}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <Input placeholder="Search links..." className="pl-8 h-8 text-xs pr-8 w-56" />
                <Button variant="ghost" size="icon-xs" className="absolute right-1.5 top-1/2 -translate-y-1/2" aria-label="Filters">
                  <HugeiconsIcon icon={SlidersHorizontalIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-5" />

              <div className="flex items-center gap-0.5">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon-sm"
                  aria-label="Grid view"
                  onClick={() => setViewMode("grid")}
                >
                  <HugeiconsIcon icon={GridViewIcon} size={16} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon-sm"
                  aria-label="List view"
                  onClick={() => setViewMode("list")}
                >
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
              <ShareDialog>
                <Button variant="ghost" size="xs" className="gap-1.5 text-xs">
                  <HugeiconsIcon icon={Share01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                  Share
                </Button>
              </ShareDialog>
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
            <h2 className="text-base font-semibold">All Links</h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
              <HugeiconsIcon icon={Sorting05Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              Newest First
              <HugeiconsIcon icon={ArrowDown01Icon} size={12} color="currentColor" strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

          {/* ── Grid View ── */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {/* Add link card */}
              <AddLinkDialog>
                <div className="flex flex-col rounded-xl border-2 border-dashed border-border bg-muted/20 overflow-hidden cursor-pointer hover:border-primary/40 hover:bg-muted/40 transition-all group min-h-[180px]">
                  <div className="flex flex-1 flex-col items-center justify-center gap-2.5">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-11 rounded-xl text-muted-foreground group-hover:text-foreground transition-colors pointer-events-none"
                      tabIndex={-1}
                    >
                      <HugeiconsIcon icon={Add01Icon} size={22} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                    </Button>
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      Add Link
                    </span>
                  </div>
                </div>
              </AddLinkDialog>

              {allLinks.map((link) => (
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

                  {/* Favorite */}
                  {link.isFavorite && (
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <HugeiconsIcon icon={StarIcon} size={14} color="currentColor" strokeWidth={2} className="text-amber-500" aria-hidden="true" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 px-4 pt-4 pb-3 space-y-2">
                    {/* Domain row */}
                    <div className="flex items-center gap-1.5">
                      <div className="size-4 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                        <LinkFavicon domain={link.domain} size={28} />
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate">{link.domain}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                      {link.title}
                    </h3>

                    {/* Description */}
                    {link.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {link.description}
                      </p>
                    )}

                    {/* Tags */}
                    {link.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {link.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
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
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="shrink-0"
                        aria-label={`Open ${link.title}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(link.url, "_blank")
                        }}
                      >
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
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              {/* Header */}
              <div className="grid grid-cols-[auto_1fr_140px_120px_80px_40px] items-center gap-3 px-4 py-2.5 bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                <Checkbox
                  checked={selectedLinks.size === allLinks.length && allLinks.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) setSelectedLinks(new Set(allLinks.map((l) => l.id)))
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

              {/* Rows */}
              {allLinks.map((link) => (
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

                  {/* Folder */}
                  <span className="text-xs text-muted-foreground truncate">
                    {link.folder ? (
                      <span className="inline-flex items-center gap-1">
                        <HugeiconsIcon icon={FolderOpenIcon} size={12} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                        {link.folder}
                      </span>
                    ) : "—"}
                  </span>

                  {/* Date */}
                  <span className="text-xs text-muted-foreground">{link.createdAt}</span>

                  {/* Status */}
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

                  {/* Actions */}
                  <LinkContextMenu link={link} />
                </div>
              ))}
            </div>
          )}
    </DashboardShell>
  )
}
