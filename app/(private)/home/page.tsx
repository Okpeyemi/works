import { getCurrentUser } from "@/lib/actions/user"
import { getLinks } from "@/lib/actions/links"
import { getFolders } from "@/lib/actions/folders"
import { HomeContent } from "./home-content"
import { toSidebarUser } from "@/lib/utils"

export default async function HomePage() {
  const [user, links, folders] = await Promise.all([
    getCurrentUser(),
    getLinks(),
    getFolders(),
  ])

  return <HomeContent user={toSidebarUser(user)} links={links} folders={folders} />
}
