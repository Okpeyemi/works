import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

function Spinner({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span role="status" aria-label="Loading" className={cn("inline-flex", className)} {...props}>
      <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-full animate-spin" />
    </span>
  )
}

export { Spinner }
