"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// ─── Get all tags ───────────────────────────────────────────────────────────────

export async function getTags() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true })

  if (error) throw error
  return data ?? []
}

// ─── Create tag ─────────────────────────────────────────────────────────────────

export async function createTag(input: { name: string; color?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("tags")
    .insert({ ...input, owner_id: user.id })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/tags")
  return data
}

// ─── Update tag ─────────────────────────────────────────────────────────────────

export async function updateTag(id: string, updates: Partial<{ name: string; color: string }>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("tags")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/tags")
  return data
}

// ─── Delete tag ─────────────────────────────────────────────────────────────────

export async function deleteTag(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("tags").delete().eq("id", id)
  if (error) throw error

  revalidatePath("/tags")
}

// ─── Get tags for a link ────────────────────────────────────────────────────────

export async function getTagsForLink(linkId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("tags_on_links")
    .select("tag:tags(*)")
    .eq("link_id", linkId)

  if (error) throw error
  return (data ?? []).map((t) => t.tag).filter(Boolean)
}

// ─── Set tags on a link ─────────────────────────────────────────────────────────

export async function setTagsOnLink(linkId: string, tagIds: string[]) {
  const supabase = await createClient()

  // Remove existing
  await supabase.from("tags_on_links").delete().eq("link_id", linkId)

  // Add new
  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ link_id: linkId, tag_id }))
    const { error } = await supabase.from("tags_on_links").insert(rows)
    if (error) throw error
  }

  revalidatePath("/home")
  revalidatePath("/links")
  revalidatePath("/tags")
}
