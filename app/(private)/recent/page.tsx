import { getCurrentUser } from "@/lib/actions/user"
import { getRecentLinks } from "@/lib/actions/links"
import { getFolders } from "@/lib/actions/folders"
import { getTags } from "@/lib/actions/tags"
import { RecentContent } from "./recent-content"
import { toSidebarUser } from "@/lib/utils"

export default async function RecentPage() {
  const [user, links, folders, tags] = await Promise.all([
    getCurrentUser(),
    getRecentLinks(),
    getFolders(),
    getTags(),
  ])

  return <RecentContent user={toSidebarUser(user)} links={links} folders={folders} tags={tags} />
}
