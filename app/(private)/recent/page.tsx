import { getCurrentUser } from "@/lib/actions/user"
import { getRecentLinks } from "@/lib/actions/links"
import { RecentContent } from "./recent-content"
import { toSidebarUser } from "@/lib/utils"

export default async function RecentPage() {
  const [user, links] = await Promise.all([
    getCurrentUser(),
    getRecentLinks(),
  ])

  return <RecentContent user={toSidebarUser(user)} links={links} />
}
