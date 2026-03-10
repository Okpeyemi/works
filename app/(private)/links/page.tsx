import { getCurrentUser } from "@/lib/actions/user"
import { getLinks } from "@/lib/actions/links"
import { getFolders } from "@/lib/actions/folders"
import { LinksContent } from "./links-content"
import { toSidebarUser } from "@/lib/utils"

export default async function LinksPage() {
  const [user, links, folders] = await Promise.all([
    getCurrentUser(),
    getLinks(),
    getFolders(),
  ])

  return <LinksContent user={toSidebarUser(user)} links={links} folders={folders} />
}
