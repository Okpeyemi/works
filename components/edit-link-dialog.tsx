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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { updateLink } from "@/lib/actions/links"
import type { Link, Folder } from "@/lib/types"
import { toast } from "sonner"

// ─── Props ────────────────────────────────────────────────────────────────────

interface EditLinkDialogProps {
  link: Link
  folders: Folder[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditLinkDialog({ link, folders, open, onOpenChange }: EditLinkDialogProps) {
  const [title, setTitle] = React.useState(link.title)
  const [description, setDescription] = React.useState(link.description ?? "")
  const [folderId, setFolderId] = React.useState<string>(link.folder_id ?? "")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setTitle(link.title)
      setDescription(link.description ?? "")
      setFolderId(link.folder_id ?? "")
    }
  }, [open, link])

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    try {
      await updateLink(link.id, {
        title: title.trim(),
        description: description.trim(),
        folder_id: folderId || null,
      })
      toast.success("Link updated")
      onOpenChange(false)
    } catch {
      toast.error("Failed to update link")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription>Update the title, description or folder.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-link-title" className="text-sm font-medium">Title</Label>
            <Input
              id="edit-link-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-link-desc" className="text-sm font-medium">Description</Label>
            <Textarea
              id="edit-link-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-18"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Folder</Label>
            <Select value={folderId} onValueChange={setFolderId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No folder</SelectItem>
                {folders.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button size="sm" disabled={!title.trim() || saving} onClick={handleSave}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
