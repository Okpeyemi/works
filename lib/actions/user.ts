"use server"

import { createClient } from "@/lib/supabase/server"

// ─── Get current user profile ───────────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) return null
  return data
}

// ─── Update user profile ────────────────────────────────────────────────────────

export async function updateUserProfile(updates: Partial<{ name: string; image: string }>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Get user activities ────────────────────────────────────────────────────────

export async function getActivities(limit = 50) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("activities")
    .select("*, link:links(id, title, url), folder:folders(id, name)")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}
