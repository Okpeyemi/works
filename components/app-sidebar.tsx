"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home03Icon,
  Link01Icon,
  FolderSharedIcon,
  StarIcon,
  Clock01Icon,
  Delete01Icon,
  Settings01Icon,
  HelpCircleIcon,
  Search01Icon,
  Logout02Icon,
  Cancel01Icon,
  Alert02Icon,
  Folder01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/actions/auth"

export interface SidebarUser {
  name: string | null
  email: string
  image: string | null
  plan: "FREE" | "PRO"
  links_count: number
  links_limit: number
}

// ─── Navigation items ──────────────────────────────────────────────────────────

const mainNav = [
  { label: "Home",           icon: Home03Icon,        href: "/home",       badge: null },
  { label: "My Links",       icon: Link01Icon,        href: "/links",      badge: null },
  { label: "Folders",        icon: Folder01Icon,      href: "/folders",    badge: null },
  { label: "Shared with Me", icon: FolderSharedIcon,  href: "/shared",     badge: 3    },
  { label: "Favorites",      icon: StarIcon,          href: "/favorites",  badge: null },
  { label: "Tags",           icon: Tag01Icon,         href: "/tags",       badge: null },
  { label: "Recent",         icon: Clock01Icon,       href: "/recent",     badge: null },
  { label: "Trash",          icon: Delete01Icon,      href: "/trash",      badge: null },
]

const secondaryNav = [
  { label: "Settings",       icon: Settings01Icon,    href: "/settings",   badge: null },
  { label: "Help & Support", icon: HelpCircleIcon,    href: "/help",       badge: null },
]

// ─── Promo card ───────────────────────────────────────────────────────────────

function PromoCard() {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    <div className="relative mx-2 mb-2 rounded-xl border border-border bg-muted/50 p-3.5">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2"
        aria-label="Dismiss promo"
      >
        <HugeiconsIcon
          icon={Cancel01Icon}
          size={14}
          color="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>

      {/* Warning icon */}
      <HugeiconsIcon
        icon={Alert02Icon}
        size={18}
        color="currentColor"
        strokeWidth={1.5}
        className="mb-2 text-muted-foreground"
        aria-hidden="true"
      />

      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
        Save unlimited links, advanced sharing & tags with Pro.
      </p>

      <div className="inline-icon">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setVisible(false)}
          className="text-muted-foreground px-0"
        >
          Dismiss
        </Button>
        <Button variant="link" size="xs" className="px-0 text-xs font-semibold text-primary">
          Go Pro
        </Button>
      </div>
    </div>
  )
}

// ─── AppSidebar ───────────────────────────────────────────────────────────────

function isActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(href + "/")
}

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user?: SidebarUser | null }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* ── Header: logo + search ── */}
      <SidebarHeader className="gap-3 p-4">
        {/* Logo */}
        <div className="inline-icon">
          <span className="font-bold text-xl text-sidebar-foreground tracking-tight">
            bunkle.
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            size={15}
            color="currentColor"
            strokeWidth={1.5}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <SidebarInput
            placeholder="Search..."
            className="pl-8 h-9 text-sm rounded-lg"
          />
        </div>
      </SidebarHeader>

      {/* ── Nav ── */}
      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup className="px-2 py-0">
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 mb-0.5">
            Links
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href, pathname)}
                    size="default"
                    className="h-10 rounded-lg font-medium"
                  >
                    <a href={item.href}>
                      <HugeiconsIcon
                        icon={item.icon}
                        size={18}
                        color="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>

                  {item.badge !== null && (
                    <SidebarMenuBadge className="rounded-full text-[10px] font-semibold bg-chart-1 text-white">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-3" />

        {/* Secondary navigation */}
        <SidebarGroup className="px-2 py-0">
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 mb-0.5">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href, pathname)}
                    size="default"
                    className="h-10 rounded-lg font-medium"
                  >
                    <a href={item.href}>
                      <HugeiconsIcon
                        icon={item.icon}
                        size={18}
                        color="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Links count */}
        <div className="mt-auto mx-4 mb-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Links saved</span>
            <span className="text-[10px] text-muted-foreground">{user?.links_count ?? 0} / {user?.links_limit ?? 500}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary/70" style={{ width: `${Math.min(100, ((user?.links_count ?? 0) / (user?.links_limit ?? 500)) * 100)}%` }} />
          </div>
        </div>
      </SidebarContent>

      {/* ── Footer: promo card + user ── */}
      <SidebarFooter className="gap-0 p-0">
        <PromoCard />

        {/* User row */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-t border-border">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
            <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
              {user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-sidebar-foreground truncate leading-tight">
              {user?.name ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground truncate leading-tight">
              {user?.plan === "PRO" ? "Pro Member" : "Basic Member"}
            </span>
          </div>

          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              aria-label="Log out"
            >
            <HugeiconsIcon
              icon={Logout02Icon}
              size={17}
              color="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
