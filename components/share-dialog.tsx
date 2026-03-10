"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HugeiconsIcon } from "@hugeicons/react"
import { Share01Icon, Mail01Icon } from "@hugeicons/core-free-icons"
import { createShare } from "@/lib/actions/shares"
import { toast } from "sonner"

// ─── Props ────────────────────────────────────────────────────────────────────

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  linkId?: string
  folderId?: string
  itemTitle: string
  itemType?: "link" | "folder"
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ShareDialog({
  open,
  onOpenChange,
  linkId,
  folderId,
  itemTitle,
  itemType = "link",
}: ShareDialogProps) {
  const [email, setEmail] = React.useState("")
  const [permission, setPermission] = React.useState<"READ" | "WRITE">("READ")
  const [loading, setLoading] = React.useState(false)

  function handleClose() {
    onOpenChange(false)
    setEmail("")
    setPermission("READ")
  }

  async function handleShare() {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return
    setLoading(true)
    try {
      await createShare({
        link_id: linkId,
        folder_id: folderId,
        target_email: trimmedEmail,
        permission,
      })
      toast.success(`${itemType === "folder" ? "Folder" : "Link"} shared — an email has been sent to ${trimmedEmail}`)
      handleClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      if (msg === "User not found") {
        toast.error("No account found with this email address")
      } else {
        toast.error("Failed to share — please try again")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={Share01Icon} size={16} color="currentColor" strokeWidth={1.5} className="text-primary" aria-hidden="true" />
            </div>
            <DialogTitle>Share {itemType}</DialogTitle>
          </div>
          <DialogDescription>
            Share <span className="font-medium text-foreground">&ldquo;{itemTitle}&rdquo;</span> with another Works user. They will receive an email notification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="share-email" className="text-sm font-medium">
              Recipient email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <HugeiconsIcon
                icon={Mail01Icon}
                size={15}
                color="currentColor"
                strokeWidth={1.5}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="share-email"
                type="email"
                placeholder="name@example.com"
                className="pl-8"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleShare() }}
                autoFocus
              />
            </div>
          </div>

          {/* Permission */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Permission</Label>
            <Select value={permission} onValueChange={(v) => setPermission(v as "READ" | "WRITE")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="READ">
                  <span className="flex flex-col">
                    <span className="font-medium">Read only</span>
                    <span className="text-[10px] text-muted-foreground">Can view this {itemType}</span>
                  </span>
                </SelectItem>
                <SelectItem value="WRITE">
                  <span className="flex flex-col">
                    <span className="font-medium">Read &amp; Write</span>
                    <span className="text-[10px] text-muted-foreground">Can view and edit this {itemType}</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-[11px] text-muted-foreground bg-muted/60 rounded-lg px-3 py-2">
            The recipient must already have a Works account. They will receive an email with a link to view the shared content.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            disabled={!email.trim() || loading}
            onClick={handleShare}
          >
            <HugeiconsIcon icon={Share01Icon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
            {loading ? "Sharing..." : "Share & notify"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
