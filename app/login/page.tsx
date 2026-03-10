import * as React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signInWithGoogle } from "@/lib/actions/auth"

export const metadata = {
  title: "Sign in — Bunkle",
  description: "Sign in to your Bunkle account",
}

// ─── Inline Google "G" logo (brand SVG, not from icon lib) ───────────────────

function GoogleLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-background px-4">
      {/* Card */}
      <div className="w-full max-w-sm space-y-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome to <span className="font-bold text-xl">bunkle.</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Save, organise and share your links in one place.
            </p>
          </div>
        </div>

        {/* Auth card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-foreground">Sign in to your account</p>
            <p className="text-xs text-muted-foreground">
              No password needed — continue with Google.
            </p>
          </div>

          <Separator />

          {/* Google button */}
          <form action={signInWithGoogle}>
            <Button
              type="submit"
              variant="outline"
              className="w-full gap-3 h-11 text-sm font-medium"
            >
              <GoogleLogo size={18} />
              Continue with Google
            </Button>
          </form>

          <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground">
          &copy; {new Date().getFullYear()} Vault. All rights reserved.
        </p>
      </div>
    </div>
  )
}
