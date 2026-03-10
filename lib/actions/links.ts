"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// ─── Get all links (with optional filters) ─────────────────────────────────────

export async function getLinks(options?: {
  folderId?: string | null
  search?: string
  favoritesOnly?: boolean
  trashedOnly?: boolean
}) {
  const supabase = await createClient()

  let query = supabase
    .from("links")
    .select("*, tags:tags_on_links(tag:tags(*))")
    .order("created_at", { ascending: false })

  if (options?.trashedOnly) {
    query = query.eq("is_trashed", true)
  } else {
    query = query.eq("is_trashed", false)
  }

  if (options?.favoritesOnly) {
    query = query.eq("is_favorite", true)
  }

  if (options?.folderId) {
    query = query.eq("folder_id", options.folderId)
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,url.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }

  const { data, error } = await query

  if (error) throw error

  // Flatten nested tags structure
  return (data ?? []).map((link) => ({
    ...link,
    tags: link.tags?.map((t: { tag: unknown }) => t.tag).filter(Boolean) ?? [],
  }))
}

// ─── Get single link ────────────────────────────────────────────────────────────

export async function getLink(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("links")
    .select("*, tags:tags_on_links(tag:tags(*))")
    .eq("id", id)
    .single()

  if (error) throw error

  return {
    ...data,
    tags: data.tags?.map((t: { tag: unknown }) => t.tag).filter(Boolean) ?? [],
  }
}

// ─── Create link ────────────────────────────────────────────────────────────────

export async function createLink(input: {
  url: string
  title: string
  description?: string
  favicon?: string
  domain: string
  og_image?: string
  folder_id?: string | null
  tag_ids?: string[]
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { tag_ids, ...linkData } = input

  const { data: link, error } = await supabase
    .from("links")
    .insert({ ...linkData, owner_id: user.id })
    .select()
    .single()

  if (error) throw error

  // Attach tags
  if (tag_ids && tag_ids.length > 0) {
    const tagLinks = tag_ids.map((tag_id) => ({
      link_id: link.id,
      tag_id,
    }))
    await supabase.from("tags_on_links").insert(tagLinks)
  }

  // Increment links_count
  try {
    await supabase.rpc("increment_links_count", { user_id: user.id })
  } catch {
    // RPC not available, skip
  }

  // Log activity
  await supabase.from("activities").insert({
    action: "ADD_LINK",
    user_id: user.id,
    link_id: link.id,
    metadata: { title: link.title, url: link.url },
  })

  revalidatePath("/home")
  revalidatePath("/links")
  return link
}

// ─── Update link ────────────────────────────────────────────────────────────────

export async function updateLink(
  id: string,
  updates: Partial<{
    title: string
    description: string
    folder_id: string | null
    is_favorite: boolean
    is_trashed: boolean
    trashed_at: string | null
  }>
) {
  const supabase = await createClient()

  // If trashing, set trashed_at
  if (updates.is_trashed === true) {
    updates.trashed_at = new Date().toISOString()
  }
  if (updates.is_trashed === false) {
    updates.trashed_at = null
  }

  const { data, error } = await supabase
    .from("links")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/home")
  revalidatePath("/links")
  revalidatePath("/favorites")
  revalidatePath("/trash")
  return data
}

// ─── Delete link permanently ────────────────────────────────────────────────────

export async function deleteLink(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)

  if (error) throw error

  revalidatePath("/home")
  revalidatePath("/links")
  revalidatePath("/trash")
}

// ─── Toggle favorite ────────────────────────────────────────────────────────────

export async function toggleLinkFavorite(id: string, isFavorite: boolean) {
  return updateLink(id, { is_favorite: isFavorite })
}

// ─── Move to trash ──────────────────────────────────────────────────────────────

export async function trashLink(id: string) {
  return updateLink(id, { is_trashed: true })
}

// ─── Restore from trash ─────────────────────────────────────────────────────────

export async function restoreLink(id: string) {
  return updateLink(id, { is_trashed: false })
}

// ─── Get recent links ───────────────────────────────────────────────────────────

export async function getRecentLinks(limit = 20) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("links")
    .select("*, tags:tags_on_links(tag:tags(*))")
    .eq("is_trashed", false)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data ?? []).map((link) => ({
    ...link,
    tags: link.tags?.map((t: { tag: unknown }) => t.tag).filter(Boolean) ?? [],
  }))
}
