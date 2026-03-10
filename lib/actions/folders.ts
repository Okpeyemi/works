"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// ─── Get all folders ────────────────────────────────────────────────────────────

export async function getFolders(options?: {
  parentId?: string | null
  trashedOnly?: boolean
  favoritesOnly?: boolean
}) {
  const supabase = await createClient()

  let query = supabase
    .from("folders")
    .select("*")
    .order("name", { ascending: true })

  if (options?.trashedOnly) {
    query = query.eq("is_trashed", true)
  } else {
    query = query.eq("is_trashed", false)
  }

  if (options?.favoritesOnly) {
    query = query.eq("is_favorite", true)
  }

  if (options?.parentId !== undefined) {
    if (options.parentId === null) {
      query = query.is("parent_id", null)
    } else {
      query = query.eq("parent_id", options.parentId)
    }
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

// ─── Create folder ──────────────────────────────────────────────────────────────

export async function createFolder(input: {
  name: string
  parent_id?: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("folders")
    .insert({ ...input, owner_id: user.id })
    .select()
    .single()

  if (error) throw error

  await supabase.from("activities").insert({
    action: "CREATE_FOLDER",
    user_id: user.id,
    folder_id: data.id,
    metadata: { name: data.name },
  })

  revalidatePath("/folders")
  revalidatePath("/home")
  return data
}

// ─── Update folder ──────────────────────────────────────────────────────────────

export async function updateFolder(
  id: string,
  updates: Partial<{
    name: string
    parent_id: string | null
    is_favorite: boolean
    is_trashed: boolean
    trashed_at: string | null
  }>
) {
  const supabase = await createClient()

  if (updates.is_trashed === true) {
    updates.trashed_at = new Date().toISOString()
  }
  if (updates.is_trashed === false) {
    updates.trashed_at = null
  }

  const { data, error } = await supabase
    .from("folders")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/folders")
  revalidatePath("/home")
  revalidatePath("/trash")
  return data
}

// ─── Delete folder permanently ──────────────────────────────────────────────────

export async function deleteFolder(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("folders").delete().eq("id", id)
  if (error) throw error

  revalidatePath("/folders")
  revalidatePath("/trash")
}

// ─── Trash / Restore folder ─────────────────────────────────────────────────────

export async function trashFolder(id: string) {
  return updateFolder(id, { is_trashed: true })
}

export async function restoreFolder(id: string) {
  return updateFolder(id, { is_trashed: false })
}
