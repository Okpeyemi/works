"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Spinner } from "@/components/ui/spinner"
import { LinkFavicon } from "@/components/link-favicon"
import { useLinkPreview } from "@/hooks/use-link-preview"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GlobeIcon,
  PlusSignIcon,
  ArrowUpRight01Icon,
  ArrowDown01Icon,
  FolderAddIcon,
} from "@hugeicons/core-free-icons"
import { createLink } from "@/lib/actions/links"
import { createShare } from "@/lib/actions/shares"
import { createFolder } from "@/lib/actions/folders"
import { createTag } from "@/lib/actions/tags"
import type { Folder, Tag } from "@/lib/types"
import { toast } from "sonner"

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddLinkDialogProps {
  children: React.ReactNode
  folders?: Folder[]
  tags?: Tag[]
}

// ─── Component ────────────────────────────────────────────────────────────────

function AddLinkDialog({ children, folders: foldersProp = [], tags: tagsProp = [] }: AddLinkDialogProps) {
  const { url, setUrl, preview, isLoading, reset } = useLinkPreview(600)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")

  // ── Folder state ──────────────────────────────────────────────────────────
  const [localFolders, setLocalFolders] = React.useState<Folder[]>(foldersProp)
  const [folderId, setFolderId] = React.useState<string>("none")
  const [creatingFolder, setCreatingFolder] = React.useState(false)
  const [newFolderName, setNewFolderName] = React.useState("")
  const [savingFolder, setSavingFolder] = React.useState(false)

  // ── Tag state ─────────────────────────────────────────────────────────────
  const [localTags, setLocalTags] = React.useState<Tag[]>(tagsProp)
  const [selectedTagIds, setSelectedTagIds] = React.useState<string[]>([])
  const [newTagName, setNewTagName] = React.useState("")
  const [savingTag, setSavingTag] = React.useState(false)
  const [tagsOpen, setTagsOpen] = React.useState(false)

  // ── Share state ───────────────────────────────────────────────────────────
  const [shareEmail, setShareEmail] = React.useState("")
  const [sharePermission, setSharePermission] = React.useState<"READ" | "WRITE">("READ")
  const [saving, setSaving] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  // Sync props → local state when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalFolders(foldersProp)
      setLocalTags(tagsProp)
    }
  }, [open, foldersProp, tagsProp])

  // Auto-fill title & description from URL preview
  const prevPreviewRef = React.useRef(preview)
  React.useEffect(() => {
    if (preview && preview !== prevPreviewRef.current) {
      setTitle((prev) => (prev.trim() === "" ? preview.title : prev))
      setDescription((prev) => (prev.trim() === "" ? preview.description : prev))
    }
    prevPreviewRef.current = preview
  }, [preview])

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      reset()
      setTitle("")
      setDescription("")
      setFolderId("none")
      setCreatingFolder(false)
      setNewFolderName("")
      setSelectedTagIds([])
      setNewTagName("")
      setShareEmail("")
      setSharePermission("READ")
    }
  }

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
    if (!url.trim() || !preview) return
    setSaving(true)
    try {
      const link = await createLink({
        url: url.trim(),
        title: title.trim() || preview.title,
        description: description.trim() || preview.description,
        favicon: preview.favicon,
        domain: preview.domain,
        folder_id: folderId === "none" ? null : folderId || null,
        tag_ids: selectedTagIds,
      })
      if (shareEmail.trim() && link?.id) {
        try {
          await createShare({ link_id: link.id, target_email: shareEmail.trim(), permission: sharePermission })
          toast.success(`Link saved and shared with ${shareEmail.trim()}`)
        } catch {
          toast.success("Link saved")
          toast.error(`Could not share with ${shareEmail.trim()} — user not found`)
        }
      } else {
        toast.success("Link saved")
      }
      handleOpenChange(false)
    } catch {
      toast.error("Failed to save link")
    } finally {
      setSaving(false)
    }
  }

  const selectedTags = localTags.filter((t) => selectedTagIds.includes(t.id))

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a link</DialogTitle>
          <DialogDescription>
            Paste a URL — metadata will be extracted automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="link-url" className="text-sm font-medium">
              URL <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <HugeiconsIcon icon={GlobeIcon} size={15} color="currentColor" strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <Input id="link-url" placeholder="https://example.com" className="pl-8" type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
              {isLoading && <Spinner className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />}
            </div>
          </div>

          {/* Preview card */}
          {preview && (
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                <LinkFavicon domain={preview.domain} size={32} />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-sm font-medium leading-tight truncate">{preview.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{preview.description}</p>
                <p className="text-[10px] text-muted-foreground/70 truncate flex items-center gap-1">
                  <HugeiconsIcon icon={ArrowUpRight01Icon} size={10} color="currentColor" strokeWidth={2} aria-hidden="true" />
                  {preview.domain}
                </p>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="link-title" className="text-sm font-medium">Title</Label>
            <Input id="link-title" placeholder="Page title (auto-filled)" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="link-desc" className="text-sm font-medium">Description</Label>
            <Textarea id="link-desc" placeholder="Short description..." className="min-h-18" value={description} onChange={(e) => setDescription(e.target.value)} />
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
              {/* Inline folder form */}
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
                      <div className="flex flex-wrap gap-1 max-w-[110px] overflow-hidden">
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

          {/* Share with */}
          <div className="space-y-2">
            <Label htmlFor="share-email" className="text-sm font-medium">Share with</Label>
            <div className="flex gap-2">
              <Input id="share-email" placeholder="name@example.com" className="flex-1" type="email" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} />
              <Select value={sharePermission} onValueChange={(v) => setSharePermission(v as "READ" | "WRITE")}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="READ">Read only</SelectItem>
                  <SelectItem value="WRITE">Read &amp; Write</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-[10px] text-muted-foreground">Leave empty to keep the link private.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button size="sm" className="gap-1.5" disabled={!url.trim() || !preview || saving} onClick={handleSave}>
            <HugeiconsIcon icon={PlusSignIcon} size={14} color="currentColor" strokeWidth={2} aria-hidden="true" />
            {saving ? "Saving..." : "Save Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { AddLinkDialog }
