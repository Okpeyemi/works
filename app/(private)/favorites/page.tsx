import { getCurrentUser } from "@/lib/actions/user"
import { getLinks } from "@/lib/actions/links"
import { getFolders } from "@/lib/actions/folders"
import { FavoritesContent } from "./favorites-content"
import { toSidebarUser } from "@/lib/utils"

export default async function FavoritesPage() {
  const [user, links, folders] = await Promise.all([
    getCurrentUser(),
    getLinks({ favoritesOnly: true }),
    getFolders(),
  ])

  return <FavoritesContent user={toSidebarUser(user)} links={links} folders={folders} />
}
