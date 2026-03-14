"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ExternalLink,
  Cancel01Icon,
  Loading03Icon,
  Link01Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons"
import type { Link } from "@/lib/types"

interface LinkPreviewModalProps {
  link: Link | null
  onClose: () => void
}

export function LinkPreviewModal({ link, onClose }: LinkPreviewModalProps) {
  const [loading, setLoading] = React.useState(true)
  const [blocked, setBlocked] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset state each time a new link is opened
  React.useEffect(() => {
    if (!link) return
    setLoading(true)
    setBlocked(false)

    // Many sites block iframes silently — the `load` event still fires but the
    // content is a blank/error page. We use a generous timeout as a heuristic:
    // if the iframe hasn't finished loading in 8 s we assume it's blocked.
    timeoutRef.current = setTimeout(() => {
      setBlocked(true)
      setLoading(false)
    }, 8000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [link?.url])

  function handleLoad() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setLoading(false)
    // We can't detect X-Frame-Options failures from JS; we just hide the spinner.
  }

  return (
    <Dialog open={!!link} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        className="flex flex-col gap-0 p-0 max-w-5xl w-[95vw] h-[90vh] overflow-hidden"
        showCloseButton={false}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
          {/* Favicon */}
          <div className="size-7 rounded-md border border-border bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
            {link?.favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={link.favicon} alt="" className="size-4" />
            ) : (
              <HugeiconsIcon icon={Link01Icon} size={13} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" />
            )}
          </div>

          {/* Title / domain */}
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-sm font-semibold truncate leading-none">
              {link?.title}
            </DialogTitle>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{link?.domain}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button asChild variant="outline" size="sm" className="gap-1.5 h-7 text-xs">
              <a href={link?.url} target="_blank" rel="noopener noreferrer">
                <HugeiconsIcon icon={ExternalLink} size={13} color="currentColor" strokeWidth={1.5} />
                Open
              </a>
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close preview">
              <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {/* ── Preview area ── */}
        <div className="relative flex-1 overflow-hidden bg-muted/30">
          {/* Loading spinner */}
          {loading && !blocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-background/80 backdrop-blur-sm">
              <HugeiconsIcon
                icon={Loading03Icon}
                size={28}
                color="currentColor"
                strokeWidth={1.5}
                className="text-primary animate-spin"
              />
              <p className="text-xs text-muted-foreground">Loading preview…</p>
            </div>
          )}

          {/* Blocked fallback */}
          {blocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-background px-6 text-center">
              <div className="size-14 rounded-xl bg-muted flex items-center justify-center">
                <HugeiconsIcon icon={Alert01Icon} size={24} color="currentColor" strokeWidth={1.5} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">Preview not available</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  This website doesn&apos;t allow embedding. Open it directly to view the content.
                </p>
              </div>
              <Button asChild size="sm" className="gap-1.5">
                <a href={link?.url} target="_blank" rel="noopener noreferrer">
                  <HugeiconsIcon icon={ExternalLink} size={14} color="currentColor" strokeWidth={1.5} />
                  Open in new tab
                </a>
              </Button>
            </div>
          )}

          {/* iFrame */}
          {link && !blocked && (
            <iframe
              key={link.url}
              src={link.url}
              title={link.title}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
