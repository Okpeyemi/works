// ─── Shared item email template ───────────────────────────────────────────────

interface ShareEmailOptions {
  ownerName: string
  ownerEmail: string
  itemType: "link" | "folder"
  itemTitle: string
  itemUrl?: string        // only for links
  itemDomain?: string     // only for links
  permission: "READ" | "WRITE"
  siteUrl: string
}

export function buildShareEmail(opts: ShareEmailOptions): { subject: string; html: string } {
  const {
    ownerName,
    ownerEmail,
    itemType,
    itemTitle,
    itemUrl,
    itemDomain,
    permission,
    siteUrl,
  } = opts

  const permissionLabel = permission === "WRITE" ? "Read & Write" : "Read only"
  const itemLabel = itemType === "folder" ? "folder" : "link"
  const subject = `${ownerName} shared a ${itemLabel} with you — Bunkle`

  const linkPreviewBlock =
    itemType === "link" && itemUrl
      ? `
      <div style="margin:24px 0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#f8fafc;">
        <div style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#0f172a;">${escHtml(itemTitle)}</p>
          ${itemDomain ? `<p style="margin:0;font-size:11px;color:#94a3b8;">${escHtml(itemDomain)}</p>` : ""}
        </div>
        <div style="border-top:1px solid #e2e8f0;padding:10px 20px;background:#f1f5f9;">
          <a href="${itemUrl}" style="font-size:11px;color:#6366f1;text-decoration:none;">${itemUrl}</a>
        </div>
      </div>`
      : `
      <div style="margin:24px 0;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;background:#f8fafc;">
        <p style="margin:0;font-size:13px;font-weight:600;color:#0f172a;">📁 ${escHtml(itemTitle)}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">Folder</p>
      </div>`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- ── Logo / Brand ── -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <span style="font-size:26px;font-weight:700;color:#0f172a;letter-spacing:-0.5px;">bunkle.</span>
              </div>
            </td>
          </tr>

          <!-- ── Card ── -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">

              <!-- Top accent bar -->
              <div style="height:4px;background:linear-gradient(90deg,#6366f1,#8b5cf6);"></div>

              <div style="padding:32px 36px;">

                <!-- Avatar + Name -->
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                  <div style="width:40px;height:40px;background:#e0e7ff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <span style="font-size:16px;font-weight:700;color:#6366f1;">${escHtml(ownerName.charAt(0).toUpperCase())}</span>
                  </div>
                  <div>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">${escHtml(ownerName)}</p>
                    <p style="margin:0;font-size:12px;color:#94a3b8;">${escHtml(ownerEmail)}</p>
                  </div>
                </div>

                <!-- Headline -->
                <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">
                  Shared a ${itemLabel} with you
                </h1>
                <p style="margin:0 0 4px;font-size:14px;color:#64748b;line-height:1.6;">
                  <strong>${escHtml(ownerName)}</strong> has shared a ${itemLabel} on <strong>bunkle.</strong> with you.
                </p>

                <!-- Permission badge -->
                <div style="margin-top:12px;">
                  <span style="display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;background:${permission === "WRITE" ? "#e0e7ff" : "#f1f5f9"};color:${permission === "WRITE" ? "#6366f1" : "#64748b"};">
                    ${permissionLabel}
                  </span>
                </div>

                <!-- Item preview -->
                ${linkPreviewBlock}

                <!-- CTA -->
                <div style="text-align:center;margin-top:28px;">
                  <a href="${siteUrl}/shared"
                     style="display:inline-block;padding:12px 28px;background:#6366f1;color:#ffffff;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.1px;">
                    View in bunkle. →
                  </a>
                </div>

              </div>

              <!-- Divider -->
              <div style="height:1px;background:#e2e8f0;margin:0 36px;"></div>

              <!-- Footer info -->
              <div style="padding:20px 36px 28px;">
                <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;text-align:center;">
                  You received this email because <strong>${escHtml(ownerName)}</strong> shared content with you on bunkle..<br/>
                  If you don't have an account yet, <a href="${siteUrl}/login" style="color:#6366f1;text-decoration:none;">create one for free</a> to access shared content.
                </p>
              </div>
            </td>
          </tr>

          <!-- ── Bottom footer ── -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">
                © ${new Date().getFullYear()} bunkle. · <a href="${siteUrl}" style="color:#94a3b8;">bunkle.online</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  return { subject, html }
}

// ─── Invite email template (for users without an account) ────────────────────

interface InviteEmailOptions {
  ownerName: string
  ownerEmail: string
  itemType: "link" | "folder"
  itemTitle: string
  itemUrl?: string
  itemDomain?: string
  siteUrl: string
}

export function buildInviteEmail(opts: InviteEmailOptions): { subject: string; html: string } {
  const { ownerName, ownerEmail, itemType, itemTitle, itemUrl, itemDomain, siteUrl } = opts

  const itemLabel = itemType === "folder" ? "folder" : "link"
  const subject = `${ownerName} wants to share a ${itemLabel} with you — Bunkle`

  const previewBlock =
    itemType === "link" && itemUrl
      ? `
      <div style="margin:24px 0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#f8fafc;">
        <div style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#0f172a;">${escHtml(itemTitle)}</p>
          ${itemDomain ? `<p style="margin:0;font-size:11px;color:#94a3b8;">${escHtml(itemDomain)}</p>` : ""}
        </div>
        <div style="border-top:1px solid #e2e8f0;padding:10px 20px;background:#f1f5f9;">
          <a href="${itemUrl}" style="font-size:11px;color:#6366f1;text-decoration:none;">${itemUrl}</a>
        </div>
      </div>`
      : `
      <div style="margin:24px 0;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;background:#f8fafc;">
        <p style="margin:0;font-size:13px;font-weight:600;color:#0f172a;">📁 ${escHtml(itemTitle)}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">Folder</p>
      </div>`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <span style="font-size:26px;font-weight:700;color:#0f172a;letter-spacing:-0.5px;">bunkle.</span>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
              <div style="height:4px;background:linear-gradient(90deg,#6366f1,#8b5cf6);"></div>
              <div style="padding:32px 36px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                  <div style="width:40px;height:40px;background:#e0e7ff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <span style="font-size:16px;font-weight:700;color:#6366f1;">${escHtml(ownerName.charAt(0).toUpperCase())}</span>
                  </div>
                  <div>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">${escHtml(ownerName)}</p>
                    <p style="margin:0;font-size:12px;color:#94a3b8;">${escHtml(ownerEmail)}</p>
                  </div>
                </div>
                <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">
                  You've been invited!
                </h1>
                <p style="margin:0 0 4px;font-size:14px;color:#64748b;line-height:1.6;">
                  <strong>${escHtml(ownerName)}</strong> wants to share a ${itemLabel} with you on <strong>bunkle.</strong>
                  To access it, create a free account.
                </p>
                ${previewBlock}
                <div style="text-align:center;margin-top:28px;">
                  <a href="${siteUrl}/login"
                     style="display:inline-block;padding:12px 28px;background:#6366f1;color:#ffffff;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.1px;">
                    Create my account →
                  </a>
                </div>
              </div>
              <div style="height:1px;background:#e2e8f0;margin:0 36px;"></div>
              <div style="padding:20px 36px 28px;">
                <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;text-align:center;">
                  You received this invitation because <strong>${escHtml(ownerName)}</strong> wants to share content with you.<br/>
                  Sign up with Google — it's free and takes less than a minute.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">
                © ${new Date().getFullYear()} bunkle. · <a href="${siteUrl}" style="color:#94a3b8;">bunkle.online</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
  return { subject, html }
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
