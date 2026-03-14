import { getCurrentUser } from "@/lib/actions/user"
import { getFolders } from "@/lib/actions/folders"
import { getLinks } from "@/lib/actions/links"
import { FoldersContent } from "./folders-content"
import { toSidebarUser } from "@/lib/utils"

export default async function FoldersPage() {
  const [user, folders, links] = await Promise.all([
    getCurrentUser(),
    getFolders(),
    getLinks(),
  ])

  // Compute links count per folder
  const linksCountMap: Record<string, number> = {}
  for (const link of links) {
    if (link.folder_id) {
      linksCountMap[link.folder_id] = (linksCountMap[link.folder_id] ?? 0) + 1
    }
  }

  return <FoldersContent user={toSidebarUser(user)} folders={folders} links={links} linksCountMap={linksCountMap} />
}
