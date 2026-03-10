import { getCurrentUser } from "@/lib/actions/user"
import { getLinks } from "@/lib/actions/links"
import { getFolders } from "@/lib/actions/folders"
import { getTags } from "@/lib/actions/tags"
import { FavoritesContent } from "./favorites-content"
import { toSidebarUser } from "@/lib/utils"

export default async function FavoritesPage() {
  const [user, links, folders, tags] = await Promise.all([
    getCurrentUser(),
    getLinks({ favoritesOnly: true }),
    getFolders(),
    getTags(),
  ])

  return <FavoritesContent user={toSidebarUser(user)} links={links} folders={folders} tags={tags} />
}
