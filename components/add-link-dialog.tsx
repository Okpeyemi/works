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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { LinkFavicon } from "@/components/link-favicon"
import { useLinkPreview } from "@/hooks/use-link-preview"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GlobeIcon,
  PlusSignIcon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { createLink } from "@/lib/actions/links"
import type { Folder } from "@/lib/types"
import { toast } from "sonner"

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddLinkDialogProps {
  children: React.ReactNode
  folders?: Folder[]
}

// ─── Component ────────────────────────────────────────────────────────────────

function AddLinkDialog({ children, folders = [] }: AddLinkDialogProps) {
  const { url, setUrl, preview, isLoading, reset } = useLinkPreview(600)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [folderId, setFolderId] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  // Auto-fill title & description when preview loads
  const prevPreviewRef = React.useRef(preview)
  React.useEffect(() => {
    if (preview && preview !== prevPreviewRef.current) {
      // Only auto-fill if the user has not manually typed something
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
      setFolderId(null)
    }
  }

  async function handleSave() {
    if (!url.trim() || !preview) return
    setSaving(true)
    try {
      await createLink({
        url: url.trim(),
        title: title.trim() || preview.title,
        description: description.trim() || preview.description,
        favicon: preview.favicon,
        domain: preview.domain,
        folder_id: folderId,
      })
      toast.success("Link saved")
      handleOpenChange(false)
    } catch {
      toast.error("Failed to save link")
    } finally {
      setSaving(false)
    }
  }

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
              <HugeiconsIcon
                icon={GlobeIcon}
                size={15}
                color="currentColor"
                strokeWidth={1.5}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="link-url"
                placeholder="https://example.com"
                className="pl-8"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {isLoading && (
                <Spinner className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* ── Preview card ── */}
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
            <Label htmlFor="link-title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="link-title"
              placeholder="Page title (auto-filled)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="link-desc" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="link-desc"
              placeholder="Short description..."
              className="min-h-18"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Folder + Tags row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Folder */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Folder</Label>
              <Select value={folderId ?? ""} onValueChange={(v) => setFolderId(v || null)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="link-tags" className="text-sm font-medium">
                Tags
              </Label>
              <Input id="link-tags" placeholder="react, docs..." />
            </div>
          </div>

          {/* Share with */}
          <div className="space-y-2">
            <Label htmlFor="share-email" className="text-sm font-medium">
              Share with
            </Label>
            <div className="flex gap-2">
              <Input
                id="share-email"
                placeholder="name@example.com"
                className="flex-1"
                type="email"
              />
              <Select defaultValue="read">
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read only</SelectItem>
                  <SelectItem value="write">Read & Write</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Leave empty to keep the link private.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
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
