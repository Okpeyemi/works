"use client"

import * as React from "react"
import { AppSidebar, type SidebarUser } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HugeiconsIcon } from "@hugeicons/react"
import { Notification01Icon } from "@hugeicons/core-free-icons"

interface BreadcrumbEntry {
  label: string
  href?: string
}

interface DashboardShellProps {
  title: string
  breadcrumbs?: BreadcrumbEntry[]
  actions?: React.ReactNode
  children: React.ReactNode
  user?: SidebarUser | null
}

export function DashboardShell({
  title,
  breadcrumbs,
  actions,
  children,
  user,
}: DashboardShellProps) {
  const crumbs: BreadcrumbEntry[] = breadcrumbs ?? [{ label: title }]

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <SidebarInset>
        {/* ── Top bar ── */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-1" />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, i) => (
                  <React.Fragment key={crumb.label}>
                    {i > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-semibold text-sm">
                          {crumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2">
            {actions}
            <Button variant="ghost" size="icon-sm" aria-label="Notifications">
              <HugeiconsIcon
                icon={Notification01Icon}
                size={18}
                color="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Button>
            <Avatar className="size-8">
              <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
              <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                {user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
