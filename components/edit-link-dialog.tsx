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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { updateLink } from "@/lib/actions/links"
import { setTagsOnLink, createTag } from "@/lib/actions/tags"
import { createFolder } from "@/lib/actions/folders"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, FolderAddIcon } from "@hugeicons/core-free-icons"
import type { Link, Folder, Tag } from "@/lib/types"
import { toast } from "sonner"

// ─── Props ────────────────────────────────────────────────────────────────────

interface EditLinkDialogProps {
  link: Link
  folders: Folder[]
  tags: Tag[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditLinkDialog({ link, folders: foldersProp, tags: tagsProp, open, onOpenChange }: EditLinkDialogProps) {
  const [title, setTitle] = React.useState(link.title)
  const [description, setDescription] = React.useState(link.description ?? "")

  // ── Folder state ──────────────────────────────────────────────────────────
  const [localFolders, setLocalFolders] = React.useState<Folder[]>(foldersProp)
  const [folderId, setFolderId] = React.useState<string>(link.folder_id ?? "none")
  const [creatingFolder, setCreatingFolder] = React.useState(false)
  const [newFolderName, setNewFolderName] = React.useState("")
  const [savingFolder, setSavingFolder] = React.useState(false)

  // ── Tag state ─────────────────────────────────────────────────────────────
  const [localTags, setLocalTags] = React.useState<Tag[]>(tagsProp)
  const [selectedTagIds, setSelectedTagIds] = React.useState<string[]>(
    (link.tags ?? []).map((t) => t.id)
  )
  const [newTagName, setNewTagName] = React.useState("")
  const [savingTag, setSavingTag] = React.useState(false)
  const [tagsOpen, setTagsOpen] = React.useState(false)

  const [saving, setSaving] = React.useState(false)

  // Sync state when dialog opens
  React.useEffect(() => {
    if (open) {
      setTitle(link.title)
      setDescription(link.description ?? "")
      setFolderId(link.folder_id ?? "none")
      setLocalFolders(foldersProp)
      setLocalTags(tagsProp)
      setSelectedTagIds((link.tags ?? []).map((t) => t.id))
      setCreatingFolder(false)
      setNewFolderName("")
      setNewTagName("")
    }
  }, [open, link, foldersProp, tagsProp])

  // ── Inline folder creation ────────────────────────────────────────────────
  async function handleCreateFolder() {
    const name = newFolderName.trim()
    if (!name) return
    setSavingFolder(true)
    try {
      const folder = await createFolder({ name })
      setLocalFolders((prev) => [...prev, folder])
      setFolderId(folder.id)
      setNewFolderName("")
      setCreatingFolder(false)
      toast.success("Folder created")
    } catch {
      toast.error("Failed to create folder")
    } finally {
      setSavingFolder(false)
    }
  }

  // ── Inline tag creation ───────────────────────────────────────────────────
  async function handleCreateTag() {
    const name = newTagName.trim()
    if (!name) return
    setSavingTag(true)
    try {
      const tag = await createTag({ name })
      setLocalTags((prev) => [...prev, tag])
      setSelectedTagIds((prev) => [...prev, tag.id])
      setNewTagName("")
      toast.success("Tag created")
    } catch {
      toast.error("Failed to create tag")
    } finally {
      setSavingTag(false)
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    try {
      await updateLink(link.id, {
        title: title.trim(),
        description: description.trim(),
        folder_id: folderId === "none" ? null : folderId || null,
      })
      await setTagsOnLink(link.id, selectedTagIds)
      toast.success("Link updated")
      onOpenChange(false)
    } catch {
      toast.error("Failed to update link")
    } finally {
      setSaving(false)
    }
  }

  const selectedTags = localTags.filter((t) => selectedTagIds.includes(t.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription>Update the title, description, folder or tags.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-link-title" className="text-sm font-medium">Title</Label>
            <Input id="edit-link-title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-link-desc" className="text-sm font-medium">Description</Label>
            <Textarea id="edit-link-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-18" />
          </div>

          {/* Folder + Tags */}
          <div className="grid grid-cols-2 gap-3">
            {/* ── Folder ── */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Folder</Label>
              <Select
                value={folderId}
                onValueChange={(v) => {
                  if (v === "__new__") { setCreatingFolder(true); return }
                  setFolderId(v)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No folder</SelectItem>
                  {localFolders.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                  <SelectItem value="__new__">
                    <span className="flex items-center gap-1.5 text-primary">
                      <HugeiconsIcon icon={FolderAddIcon} size={13} color="currentColor" strokeWidth={2} aria-hidden="true" />
                      New folder…
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {creatingFolder && (
                <div className="flex gap-1.5">
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="h-7 text-xs"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") handleCreateFolder(); if (e.key === "Escape") setCreatingFolder(false) }}
                    disabled={savingFolder}
                  />
                  <Button size="sm" className="h-7 px-2 text-xs shrink-0" onClick={handleCreateFolder} disabled={!newFolderName.trim() || savingFolder}>
                    {savingFolder ? "…" : "Add"}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs shrink-0" onClick={() => setCreatingFolder(false)} disabled={savingFolder}>✕</Button>
                </div>
              )}
            </div>

            {/* ── Tags ── */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Tags</Label>
              <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-9 px-3 font-normal text-sm">
                    {selectedTags.length === 0 ? (
                      <span className="text-muted-foreground">No tags</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-27.5 overflow-hidden">
                        {selectedTags.slice(0, 2).map((tag) => (
                          <Badge key={tag.id} variant="secondary" className="text-[9px] px-1 py-0">{tag.name}</Badge>
                        ))}
                        {selectedTags.length > 2 && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0">+{selectedTags.length - 2}</Badge>
                        )}
                      </div>
                    )}
                    <HugeiconsIcon icon={ArrowDown01Icon} size={12} color="currentColor" strokeWidth={2} className="text-muted-foreground shrink-0" aria-hidden="true" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2" align="start">
                  {localTags.length === 0 && (
                    <p className="text-[11px] text-muted-foreground text-center py-2">No tags yet — create one below</p>
                  )}
                  {localTags.length > 0 && (
                    <div className="space-y-0.5 max-h-36 overflow-y-auto mb-2">
                      {localTags.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => toggleTag(tag.id)}
                        >
                          <Checkbox
                            checked={selectedTagIds.includes(tag.id)}
                            onCheckedChange={() => toggleTag(tag.id)}
                            className="size-3.5"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-xs">{tag.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-border pt-2 flex gap-1.5">
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="New tag…"
                      className="h-7 text-xs"
                      onKeyDown={(e) => { if (e.key === "Enter") handleCreateTag() }}
                      disabled={savingTag}
                    />
                    <Button size="sm" className="h-7 px-2 text-xs shrink-0" onClick={handleCreateTag} disabled={!newTagName.trim() || savingTag}>
                      {savingTag ? "…" : "+"}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button size="sm" disabled={!title.trim() || saving} onClick={handleSave}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
