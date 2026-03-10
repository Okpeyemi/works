import { getCurrentUser } from "@/lib/actions/user"
import { getTrashItems } from "@/lib/actions/trash"
import { TrashContent } from "./trash-content"
import { toSidebarUser } from "@/lib/utils"

export default async function TrashPage() {
  const [user, trashItems] = await Promise.all([
    getCurrentUser(),
    getTrashItems(),
  ])

  return <TrashContent user={toSidebarUser(user)} links={trashItems.links} folders={trashItems.folders} />
}
