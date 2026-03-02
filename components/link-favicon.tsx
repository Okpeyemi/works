"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { GlobeIcon } from "@hugeicons/core-free-icons"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFaviconUrl(domain: string, size = 32): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LinkFaviconProps {
  domain: string
  /** Pixel size of the Google Favicon API image (default 32) */
  size?: number
  className?: string
}

/**
 * Renders the real favicon for a domain via Google's favicon service.
 * Falls back to a `GlobeIcon` on load error.
 */
function LinkFavicon({ domain, size = 32, className }: LinkFaviconProps) {
  const [failed, setFailed] = React.useState(false)

  // Reset failed state when domain changes
  React.useEffect(() => {
    setFailed(false)
  }, [domain])

  if (failed || !domain) {
    return (
      <HugeiconsIcon
        icon={GlobeIcon}
        size={size * 0.55}
        color="currentColor"
        strokeWidth={1.5}
        className={cn("text-muted-foreground", className)}
        aria-hidden="true"
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getFaviconUrl(domain, size)}
      alt=""
      width={size * 0.55}
      height={size * 0.55}
      className={cn("rounded-sm object-contain", className)}
      onError={() => setFailed(true)}
      aria-hidden="true"
    />
  )
}

export { LinkFavicon, getFaviconUrl }
