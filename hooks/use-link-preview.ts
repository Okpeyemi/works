import * as React from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LinkPreview {
  url: string
  domain: string
  favicon: string
  title: string
  description: string
}

// ─── Mock metadata database (simulates server-side OG scraping) ───────────────

const MOCK_METADATA: Record<string, { title: string; description: string }> = {
  "react.dev": { title: "React", description: "The library for web and native user interfaces" },
  "tailwindcss.com": { title: "Tailwind CSS", description: "Rapidly build modern websites without ever leaving your HTML" },
  "github.com": { title: "GitHub", description: "Let's build from here — the world's leading AI-powered developer platform" },
  "figma.com": { title: "Figma", description: "The collaborative interface design tool" },
  "prisma.io": { title: "Prisma", description: "Next-generation ORM for Node.js and TypeScript" },
  "vercel.com": { title: "Vercel", description: "Develop. Preview. Ship. — Vercel's frontend cloud" },
  "developer.mozilla.org": { title: "MDN Web Docs", description: "Resources for developers, by developers" },
  "dribbble.com": { title: "Dribbble", description: "Discover the world's top designers & creatives" },
  "nextjs.org": { title: "Next.js", description: "The React Framework for the Web" },
  "notion.so": { title: "Notion", description: "Your connected workspace for teams and individuals" },
  "supabase.com": { title: "Supabase", description: "The open source Firebase alternative" },
  "linear.app": { title: "Linear", description: "Plan and build products with modern project management" },
  "youtube.com": { title: "YouTube", description: "Enjoy the videos and music you love" },
  "twitter.com": { title: "X (formerly Twitter)", description: "What's happening in the world right now" },
  "x.com": { title: "X", description: "What's happening in the world right now" },
  "stackoverflow.com": { title: "Stack Overflow", description: "Where developers learn, share, & build careers" },
  "medium.com": { title: "Medium", description: "Where good ideas find you" },
  "dev.to": { title: "DEV Community", description: "A constructive and inclusive social network for software developers" },
  "npmjs.com": { title: "npm", description: "Build amazing things with the JavaScript package manager" },
  "wikipedia.org": { title: "Wikipedia", description: "The free encyclopedia" },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export function getFaviconUrl(domain: string, size = 32): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLinkPreview(debounceMs = 600) {
  const [url, setUrl] = React.useState("")
  const [preview, setPreview] = React.useState<LinkPreview | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    const trimmed = url.trim()

    if (!trimmed || !isValidUrl(trimmed)) {
      setPreview(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    timeoutRef.current = setTimeout(() => {
      const domain = extractDomain(trimmed)
      if (!domain) {
        setPreview(null)
        setIsLoading(false)
        return
      }

      // Look up known metadata; fall back to generated values
      const baseDomain = domain.split(".").slice(-2).join(".")
      const meta = MOCK_METADATA[domain] ?? MOCK_METADATA[baseDomain]

      const title = meta?.title ?? capitalize(domain.split(".")[0])
      const description = meta?.description ?? `Content from ${domain}`

      setPreview({
        url: trimmed,
        domain,
        favicon: getFaviconUrl(domain),
        title,
        description,
      })
      setIsLoading(false)
    }, debounceMs)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [url, debounceMs])

  const reset = React.useCallback(() => {
    setUrl("")
    setPreview(null)
    setIsLoading(false)
  }, [])

  return { url, setUrl, preview, isLoading, reset }
}
