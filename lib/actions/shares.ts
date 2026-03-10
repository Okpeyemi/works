"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email"
import { buildShareEmail } from "@/lib/email-templates"

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

  // ── Send notification email ──────────────────────────────────────────────────
  try {
    const { data: ownerProfile } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", user.id)
      .single()

    const ownerName = ownerProfile?.name ?? ownerProfile?.email ?? "Someone"
    const ownerEmail = ownerProfile?.email ?? user.email ?? ""
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"

    let itemType: "link" | "folder" = "link"
    let itemTitle = "Untitled"
    let itemUrl: string | undefined
    let itemDomain: string | undefined

    if (input.link_id) {
      const { data: link } = await supabase
        .from("links")
        .select("title, url, domain")
        .eq("id", input.link_id)
        .single()
      if (link) {
        itemType = "link"
        itemTitle = link.title
        itemUrl = link.url
        itemDomain = link.domain
      }
    } else if (input.folder_id) {
      const { data: folder } = await supabase
        .from("folders")
        .select("name")
        .eq("id", input.folder_id)
        .single()
      if (folder) {
        itemType = "folder"
        itemTitle = folder.name
      }
    }

    const { subject, html } = buildShareEmail({
      ownerName,
      ownerEmail,
      itemType,
      itemTitle,
      itemUrl,
      itemDomain,
      permission: input.permission ?? "READ",
      siteUrl,
    })

    await sendEmail({ to: input.target_email, subject, html })
  } catch {
    // Email sending is best-effort — don't fail the share if email fails
  }

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
