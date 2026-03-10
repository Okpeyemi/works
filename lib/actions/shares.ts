"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// ─── Get shares I created ───────────────────────────────────────────────────────

export async function getMyShares() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("shares")
    .select("*, link:links(*), folder:folders(*), target:users!shares_target_id_fkey(id, name, email, image)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

// ─── Get shares targeting me ────────────────────────────────────────────────────

export async function getSharedWithMe() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("shares")
    .select("*, link:links(*), folder:folders(*), owner:users!shares_owner_id_fkey(id, name, email, image)")
    .eq("target_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

// ─── Create share ───────────────────────────────────────────────────────────────

export async function createShare(input: {
  link_id?: string
  folder_id?: string
  target_email: string
  permission?: "READ" | "WRITE"
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Find target user by email
  const { data: targetUser, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", input.target_email)
    .single()

  if (userError || !targetUser) throw new Error("User not found")

  const { data, error } = await supabase
    .from("shares")
    .insert({
      link_id: input.link_id || null,
      folder_id: input.folder_id || null,
      owner_id: user.id,
      target_id: targetUser.id,
      permission: input.permission || "READ",
    })
    .select()
    .single()

  if (error) throw error

  await supabase.from("activities").insert({
    action: "SHARE",
    user_id: user.id,
    link_id: input.link_id || null,
    folder_id: input.folder_id || null,
    metadata: { target_email: input.target_email, permission: input.permission || "READ" },
  })

  revalidatePath("/shared")
  return data
}

// ─── Update share permission ────────────────────────────────────────────────────

export async function updateShare(id: string, permission: "READ" | "WRITE") {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("shares")
    .update({ permission })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/shared")
  return data
}

// ─── Delete share ───────────────────────────────────────────────────────────────

export async function deleteShare(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("shares").delete().eq("id", id)
  if (error) throw error

  revalidatePath("/shared")
}
