import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserProfile } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSidebarUser(user: UserProfile | null) {
  if (!user) return null
  return {
    name: user.name,
    email: user.email,
    image: user.image,
    plan: user.plan,
    links_count: user.links_count,
    links_limit: user.links_limit,
  }
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`
  } else if (diffDays === 1) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
