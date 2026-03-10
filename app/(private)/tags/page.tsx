import { getCurrentUser } from "@/lib/actions/user"
import { getTags } from "@/lib/actions/tags"
import { TagsContent } from "./tags-content"
import { toSidebarUser } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"

export default async function TagsPage() {
  const [user, tags] = await Promise.all([
    getCurrentUser(),
    getTags(),
  ])

  // Count links per tag
  const supabase = await createClient()
  const { data: tagsOnLinks } = await supabase
    .from("tags_on_links")
    .select("tag_id")

  const linksCountMap: Record<string, number> = {}
  for (const row of tagsOnLinks ?? []) {
    linksCountMap[row.tag_id] = (linksCountMap[row.tag_id] ?? 0) + 1
  }

  return <TagsContent user={toSidebarUser(user)} tags={tags} linksCountMap={linksCountMap} />
}
