import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { convertToModelMessages, stepCountIs, streamText, tool, UIMessage } from "ai"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"

export const maxDuration = 30

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

type LinkRow = {
  id: string
  title: string
  url: string
  description: string | null
  is_favorite: boolean
  folder_id: string | null
  tags: { tag: { name: string } }[]
}

type FolderRow = {
  id: string
  name: string
}

type TagRow = {
  id: string
  name: string
}

function revalidateAll() {
  revalidatePath("/home")
  revalidatePath("/links")
  revalidatePath("/folders")
  revalidatePath("/tags")
  revalidatePath("/favorites")
  revalidatePath("/trash")
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return new Response("Unauthorized", { status: 401 })

  const [{ data: links }, { data: folders }, { data: tags }] = await Promise.all([
    supabase
      .from("links")
      .select("id, title, url, description, is_favorite, folder_id, tags:tags_on_links(tag:tags(name))")
      .eq("is_trashed", false)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("folders")
      .select("id, name")
      .eq("is_trashed", false)
      .order("name", { ascending: true }),
    supabase
      .from("tags")
      .select("id, name")
      .order("name", { ascending: true }),
  ])

  const flatLinks = ((links as LinkRow[] | null) ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    description: l.description,
    is_favorite: l.is_favorite,
    folder_id: l.folder_id,
    tags: l.tags?.map((t) => t.tag?.name).filter(Boolean) ?? [],
  }))

  const flatFolders = (folders as FolderRow[] | null) ?? []
  const flatTags = (tags as TagRow[] | null) ?? []

  const context = `Tu es un assistant intégré dans Bunkle, une app de gestion de liens et dossiers.
Tu peux répondre à des questions ET effectuer des actions (ajouter aux favoris, déplacer dans un dossier, créer, supprimer, etc.) grâce à tes outils.
Quand l'utilisateur demande une action, utilise toujours l'outil approprié sans demander de confirmation sauf si c'est une suppression définitive.
Réponds en français sauf si l'utilisateur écrit dans une autre langue. Sois concis.

Dossiers (${flatFolders.length}) :
${flatFolders.map((f) => `• [id:${f.id}] ${f.name}`).join("\n") || "Aucun dossier"}

Tags (${flatTags.length}) :
${flatTags.map((t) => `• [id:${t.id}] ${t.name}`).join("\n") || "Aucun tag"}

Liens (${flatLinks.length}) :
${flatLinks.map((l) =>
  `• [id:${l.id}] "${l.title}" (${l.url})${l.description ? ` — ${l.description}` : ""}${l.tags.length ? ` [tags: ${l.tags.join(", ")}]` : ""}${l.is_favorite ? " ⭐" : ""}${l.folder_id ? ` [dossier: ${flatFolders.find((f) => f.id === l.folder_id)?.name ?? l.folder_id}]` : ""}`
).join("\n") || "Aucun lien"}`

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: context,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(3),
    tools: {
      // ── Links ──────────────────────────────────────────────────────────────────
      updateLink: tool({
        description: "Met à jour un lien (titre, description, favori, dossier).",
        inputSchema: z.object({
          id: z.string().describe("ID du lien"),
          title: z.string().optional().describe("Nouveau titre"),
          description: z.string().optional().describe("Nouvelle description"),
          is_favorite: z.boolean().optional().describe("Mettre en favori ou non"),
          folder_id: z.string().nullable().optional().describe("ID du dossier cible, null pour retirer du dossier"),
        }),
        execute: async ({ id, ...updates }) => {
          const { error } = await supabase.from("links").update(updates).eq("id", id).eq("owner_id", user.id)
          if (error) return { success: false, error: error.message }
          revalidateAll()
          return { success: true }
        },
      }),

      trashLink: tool({
        description: "Envoie un lien à la corbeille.",
        inputSchema: z.object({ id: z.string().describe("ID du lien") }),
        execute: async ({ id }) => {
          const { error } = await supabase
            .from("links")
            .update({ is_trashed: true, trashed_at: new Date().toISOString() })
            .eq("id", id)
            .eq("owner_id", user.id)
          if (error) return { success: false, error: error.message }
          revalidateAll()
          return { success: true }
        },
      }),

      deleteLink: tool({
        description: "Supprime définitivement un lien. Demande confirmation avant d'utiliser cet outil.",
        inputSchema: z.object({ id: z.string().describe("ID du lien") }),
        execute: async ({ id }) => {
          const { error } = await supabase.from("links").delete().eq("id", id).eq("owner_id", user.id)
          if (error) return { success: false, error: error.message }
          revalidateAll()
          return { success: true }
        },
      }),

      // ── Folders ────────────────────────────────────────────────────────────────
      createFolder: tool({
        description: "Crée un nouveau dossier.",
        inputSchema: z.object({
          name: z.string().describe("Nom du dossier"),
          parent_id: z.string().optional().describe("ID du dossier parent (optionnel)"),
        }),
        execute: async ({ name, parent_id }) => {
          const { data, error } = await supabase
            .from("folders")
            .insert({ name, parent_id: parent_id ?? null, owner_id: user.id })
            .select()
            .single()
          if (error) return { success: false, error: error.message }
          revalidateAll()
          return { success: true, folder: { id: data.id, name: data.name } }
        },
      }),

      renameFolder: tool({
        description: "Renomme un dossier existant.",
        inputSchema: z.object({
          id: z.string().describe("ID du dossier"),
          name: z.string().describe("Nouveau nom"),
        }),
        execute: async ({ id, name }) => {
          const { error } = await supabase.from("folders").update({ name }).eq("id", id).eq("owner_id", user.id)
          if (error) return { success: false, error: error.message }
          revalidateAll()
          return { success: true }
        },
      }),

      deleteFolder: tool({
        description: "Supprime définitivement un dossier. Demande confirmation avant d'utiliser cet outil.",
        inputSchema: z.object({ id: z.string().describe("ID du dossier") }),
        execute: async ({ id }) => {
          const { error } = await supabase.from("folders").delete().eq("id", id).eq("owner_id", user.id)
          if (error) return { success: false, error: error.message }
          revalidateAll()
          return { success: true }
        },
      }),

      // ── Tags ───────────────────────────────────────────────────────────────────
      addTagToLink: tool({
        description: "Ajoute un tag à un lien. Crée le tag s'il n'existe pas encore.",
        inputSchema: z.object({
          link_id: z.string().describe("ID du lien"),
          tag_name: z.string().describe("Nom du tag"),
        }),
        execute: async ({ link_id, tag_name }) => {
          // Find or create tag
          let tagId: string
          const { data: existingTag } = await supabase
            .from("tags")
            .select("id")
            .eq("name", tag_name)
            .eq("owner_id", user.id)
            .single()

          if (existingTag) {
            tagId = existingTag.id
          } else {
            const { data: newTag, error } = await supabase
              .from("tags")
              .insert({ name: tag_name, owner_id: user.id })
              .select()
              .single()
            if (error) return { success: false, error: error.message }
            tagId = newTag.id
          }

          const { error } = await supabase
            .from("tags_on_links")
            .upsert({ link_id, tag_id: tagId })
          if (error) return { success: false, error: error.message }
          revalidateAll()
          return { success: true }
        },
      }),

      removeTagFromLink: tool({
        description: "Retire un tag d'un lien.",
        inputSchema: z.object({
          link_id: z.string().describe("ID du lien"),
          tag_name: z.string().describe("Nom du tag à retirer"),
        }),
        execute: async ({ link_id, tag_name }) => {
          const { data: tag } = await supabase
            .from("tags")
            .select("id")
            .eq("name", tag_name)
            .eq("owner_id", user.id)
            .single()
          if (!tag) return { success: false, error: "Tag introuvable" }
          const { error } = await supabase
            .from("tags_on_links")
            .delete()
            .eq("link_id", link_id)
            .eq("tag_id", tag.id)
          if (error) return { success: false, error: error.message }
          revalidateAll()
          return { success: true }
        },
      }),

      createTag: tool({
        description: "Crée un nouveau tag.",
        inputSchema: z.object({
          name: z.string().describe("Nom du tag"),
          color: z.string().optional().describe("Couleur hex du tag (ex: #ff0000)"),
        }),
        execute: async ({ name, color }) => {
          const { data, error } = await supabase
            .from("tags")
            .insert({ name, color: color ?? null, owner_id: user.id })
            .select()
            .single()
          if (error) return { success: false, error: error.message }
          revalidateAll()
          return { success: true, tag: { id: data.id, name: data.name } }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
