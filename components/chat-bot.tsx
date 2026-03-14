"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, UIMessage } from "ai"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BubbleChatIcon,
  Cancel01Icon,
  SentIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function getTextFromMessage(m: UIMessage): string {
  return m.parts
    .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function ChatBot() {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"
  const prevStatus = React.useRef(status)

  // Refresh page data when a tool call completes (status goes ready after streaming)
  React.useEffect(() => {
    if (prevStatus.current !== "ready" && status === "ready") {
      const lastMsg = messages[messages.length - 1]
      const hasToolCall = lastMsg?.parts.some((p) => p.type === "tool-invocation")
      if (hasToolCall) router.refresh()
    }
    prevStatus.current = status
  }, [status, messages, router])

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
        className={cn(
          "fixed bottom-6 cursor-pointer right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full shadow-lg",
          "bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95",
          open && "scale-95"
        )}
      >
        <HugeiconsIcon
          icon={open ? Cancel01Icon : BubbleChatIcon}
          size={22}
          color="currentColor"
          strokeWidth={1.8}
        />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                <HugeiconsIcon icon={BubbleChatIcon} size={15} color="white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">Assistant Bunkle</p>
                <p className="text-xs text-muted-foreground">Pose une question sur tes liens</p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMessages([])}
                aria-label="Effacer la conversation"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} color="currentColor" strokeWidth={1.5} />
              </Button>
            )}
          </div>

          {/* Messages */}
          <div
            className="flex flex-col gap-3 overflow-y-auto p-4"
            style={{ maxHeight: 380 }}
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
                <HugeiconsIcon icon={BubbleChatIcon} size={32} color="currentColor" strokeWidth={1.2} />
                <p className="text-sm font-medium">Comment puis-je t&apos;aider ?</p>
                <p className="text-xs">
                  Demande-moi de trouver des liens,<br />résumer un dossier, ou organiser ton contenu.
                </p>
              </div>
            )}

            {messages.map((m) => {
              const text = getTextFromMessage(m)
              if (!text) return null
              return (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-2",
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {m.role === "assistant" && (
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm whitespace-pre-wrap"
                        : "bg-muted text-foreground rounded-tl-sm prose prose-sm prose-neutral dark:prose-invert max-w-none"
                    )}
                  >
                    {m.role === "user" ? text : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
                    )}
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex gap-2">
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-3 py-2">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris ta question…"
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <Button
              type="submit"
              size="icon-sm"
              disabled={isLoading || !input.trim()}
              aria-label="Envoyer"
            >
              <HugeiconsIcon icon={SentIcon} size={16} color="currentColor" strokeWidth={1.8} />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
