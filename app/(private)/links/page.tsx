import { getCurrentUser } from "@/lib/actions/user"
import { getLinks } from "@/lib/actions/links"
import { getFolders } from "@/lib/actions/folders"
import { getTags } from "@/lib/actions/tags"
import { LinksContent } from "./links-content"
import { toSidebarUser } from "@/lib/utils"

export default async function LinksPage() {
  const [user, links, folders, tags] = await Promise.all([
    getCurrentUser(),
    getLinks(),
    getFolders(),
    getTags(),
  ])

  return <LinksContent user={toSidebarUser(user)} links={links} folders={folders} tags={tags} />
}
