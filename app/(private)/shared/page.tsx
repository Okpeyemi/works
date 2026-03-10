import { getCurrentUser } from "@/lib/actions/user"
import { getSharedWithMe } from "@/lib/actions/shares"
import { SharedContent } from "./shared-content"
import { toSidebarUser } from "@/lib/utils"

export default async function SharedPage() {
  const [user, shares] = await Promise.all([
    getCurrentUser(),
    getSharedWithMe(),
  ])

  return <SharedContent user={toSidebarUser(user)} shares={shares} />
}
