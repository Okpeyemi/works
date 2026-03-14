// ─── Maileroo REST API ────────────────────────────────────────────────────────
// Uses SMTP_PASS as the API key (same credential used for SMTP auth in Maileroo)
// API key header: X-API-Key
// Endpoint: https://smtp.maileroo.com/api/v2/emails

const MAILEROO_API = "https://smtp.maileroo.com/api/v2/emails"

function parseSender(from: string): { address: string; display_name: string } {
  const match = from.match(/^(.*?)\s*<(.+)>$/)
  if (match) return { display_name: match[1].trim(), address: match[2].trim() }
  return { display_name: "", address: from.trim() }
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const apiKey = process.env.SMTP_PASS
  if (!apiKey) throw new Error("SMTP_PASS (Maileroo API key) is not set")

  const from = parseSender(
    process.env.SMTP_FROM ?? "Darell from bunkle. <darell.chooks@bunkle.online>"
  )

  const payload = JSON.stringify({ from, to: [{ address: to }], subject, html })
  const headers = { "Content-Type": "application/json", "X-API-Key": apiKey }

  // Retry once on network-level failures (timeout, ECONNRESET…)
  let res: Response | undefined
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      res = await fetch(MAILEROO_API, { method: "POST", headers, body: payload })
      break
    } catch (err) {
      if (attempt === 2) throw err
      // wait 1 s before retrying
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  if (!res!.ok) {
    const body = await res!.text().catch(() => res!.statusText)
    throw new Error(`Maileroo error ${res!.status}: ${body}`)
  }

  return res!.json()
}
