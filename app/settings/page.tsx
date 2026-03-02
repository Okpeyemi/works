"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserCircleIcon,
  SecurityLockIcon,
  PaintBrush01Icon,
  Notification01Icon,
  Globe02Icon,
  Moon02Icon,
  Sun02Icon,
  Mail01Icon,
  Key01Icon,
  Delete01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"

// ─── Settings sections ────────────────────────────────────────────────────────

function ProfileSection() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Profile</h3>
        <p className="text-xs text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src="" alt="Azunyan U. Wu" />
          <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">AU</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <Button variant="outline" size="sm" className="text-xs">Change avatar</Button>
          <p className="text-[10px] text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first-name" className="text-xs font-medium">First name</Label>
          <Input id="first-name" defaultValue="Azunyan" className="text-sm" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name" className="text-xs font-medium">Last name</Label>
          <Input id="last-name" defaultValue="Wu" className="text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-medium">Email</Label>
        <div className="relative">
          <HugeiconsIcon
            icon={Mail01Icon}
            size={15}
            color="currentColor"
            strokeWidth={1.5}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input id="email" defaultValue="azunyan@example.com" className="pl-8 text-sm" type="email" />
        </div>
      </div>

      <Button size="sm" className="gap-1.5">
        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
        Save changes
      </Button>
    </section>
  )
}

function SecuritySection() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Security</h3>
        <p className="text-xs text-muted-foreground">Manage your password and security settings</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-xs font-medium">Current password</Label>
          <div className="relative">
            <HugeiconsIcon
              icon={Key01Icon}
              size={15}
              color="currentColor"
              strokeWidth={1.5}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <Input id="current-password" type="password" placeholder="••••••••" className="pl-8 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-xs font-medium">New password</Label>
            <Input id="new-password" type="password" placeholder="••••••••" className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-xs font-medium">Confirm password</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" className="text-sm" />
          </div>
        </div>
      </div>

      <Button size="sm" className="gap-1.5">
        <HugeiconsIcon icon={SecurityLockIcon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
        Update password
      </Button>
    </section>
  )
}

function AppearanceSection() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Appearance</h3>
        <p className="text-xs text-muted-foreground">Customize the look and feel of the app</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Theme</Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
              <HugeiconsIcon icon={Sun02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              Light
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 gap-1.5 text-xs">
              <HugeiconsIcon icon={Moon02Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
              Dark
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
              System
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Language</Label>
          <Select defaultValue="en">
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}

function NotificationsSection() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Notifications</h3>
        <p className="text-xs text-muted-foreground">Choose what you want to be notified about</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Share notifications</p>
            <p className="text-xs text-muted-foreground">When someone shares a link with you</p>
          </div>
          <Switch defaultChecked id="notif-share" aria-label="Share notifications" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Edit notifications</p>
            <p className="text-xs text-muted-foreground">When a shared link is edited</p>
          </div>
          <Switch defaultChecked id="notif-edit" aria-label="Edit notifications" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Email digest</p>
            <p className="text-xs text-muted-foreground">Weekly summary of activity</p>
          </div>
          <Switch id="notif-digest" aria-label="Email digest" />
        </div>
      </div>
    </section>
  )
}

function DangerZone() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
        <p className="text-xs text-muted-foreground">Irreversible actions</p>
      </div>

      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-3">
        <div>
          <p className="text-sm font-medium">Delete account</p>
          <p className="text-xs text-muted-foreground">
            Permanently delete your account and all your data. This action cannot be undone.
          </p>
        </div>
        <Button variant="destructive" size="sm" className="gap-1.5 text-xs">
          <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
          Delete account
        </Button>
      </div>
    </section>
  )
}

// ─── Settings navigation ──────────────────────────────────────────────────────

const settingsSections = [
  { id: "profile",        label: "Profile",        icon: UserCircleIcon },
  { id: "security",       label: "Security",       icon: SecurityLockIcon },
  { id: "appearance",     label: "Appearance",     icon: PaintBrush01Icon },
  { id: "notifications",  label: "Notifications",  icon: Notification01Icon },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState("profile")

  return (
    <DashboardShell title="Settings" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }]}>

      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-xs text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar nav */}
        <nav className="lg:w-52 shrink-0">
          <div className="flex lg:flex-col gap-1">
            {settingsSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                size="sm"
                className="justify-start gap-2 text-xs"
                onClick={() => setActiveSection(section.id)}
              >
                <HugeiconsIcon icon={section.icon} size={15} color="currentColor" strokeWidth={1.5} aria-hidden="true" />
                {section.label}
              </Button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 max-w-2xl space-y-8">
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "security" && <SecuritySection />}
          {activeSection === "appearance" && <AppearanceSection />}
          {activeSection === "notifications" && <NotificationsSection />}

          <Separator />
          <DangerZone />
        </div>
      </div>
    </DashboardShell>
  )
}
