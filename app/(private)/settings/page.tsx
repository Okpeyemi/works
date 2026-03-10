import { getCurrentUser } from "@/lib/actions/user"
import { SettingsContent } from "./settings-content"
import { toSidebarUser } from "@/lib/utils"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  return <SettingsContent user={toSidebarUser(user)} profile={user} />
}
