import { createClient } from "@/lib/supabase/server"

// ─── Types ─────────────────────────────────────────────────────────────────────

export type Link = {
  id: string
  url: string
  title: string
  description: string | null
  favicon: string | null
  domain: string
  og_image: string | null
  folder_id: string | null
  owner_id: string
  is_trashed: boolean
  trashed_at: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string
  tags?: Tag[]
  folder?: Folder | null
}

export type Folder = {
  id: string
  name: string
  parent_id: string | null
  owner_id: string
  is_trashed: boolean
  trashed_at: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export type Tag = {
  id: string
  name: string
  color: string | null
  owner_id: string
}

export type Share = {
  id: string
  permission: "READ" | "WRITE"
  link_id: string | null
  folder_id: string | null
  owner_id: string
  target_id: string
  created_at: string
  updated_at: string
}

export type Activity = {
  id: string
  action: string
  user_id: string
  link_id: string | null
  folder_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export type UserProfile = {
  id: string
  name: string | null
  email: string
  image: string | null
  plan: "FREE" | "PRO"
  links_count: number
  links_limit: number
  created_at: string
  updated_at: string
}
