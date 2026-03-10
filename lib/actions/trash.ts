"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// ─── Get trash items (links + folders) ──────────────────────────────────────────

export async function getTrashItems() {
  const supabase = await createClient()

  const [linksResult, foldersResult] = await Promise.all([
    supabase
      .from("links")
      .select("*")
      .eq("is_trashed", true)
      .order("trashed_at", { ascending: false }),
    supabase
      .from("folders")
      .select("*")
      .eq("is_trashed", true)
      .order("trashed_at", { ascending: false }),
  ])

  if (linksResult.error) throw linksResult.error
  if (foldersResult.error) throw foldersResult.error

  return {
    links: linksResult.data ?? [],
    folders: foldersResult.data ?? [],
  }
}

// ─── Empty trash ────────────────────────────────────────────────────────────────

export async function emptyTrash() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  await Promise.all([
    supabase.from("links").delete().eq("owner_id", user.id).eq("is_trashed", true),
    supabase.from("folders").delete().eq("owner_id", user.id).eq("is_trashed", true),
  ])

  revalidatePath("/trash")
}
