import "server-only";
import nodemailer from "nodemailer";

// SMTP mailer for staff notifications. Configured via env; a no-op (logs a
// warning) if not fully set, so submissions never fail just because mail isn't
// configured yet.

function readConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 0);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM_EMAIL;
  const to = process.env.SMTP_TO_EMAIL;
  if (!host || !port || !from || !to) return null;
  return { host, port, user, pass, from, to };
}

export function isMailConfigured(): boolean {
  return readConfig() !== null;
}

export async function sendMail(opts: {
  subject: string;
  text: string;
  html?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const cfg = readConfig();
  if (!cfg) {
    console.warn("[mail] SMTP not configured — skipping notification.");
    return { ok: false, error: "not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465, // 465 = implicit TLS; 587/25 = STARTTLS
      auth: cfg.user && cfg.pass ? { user: cfg.user, pass: cfg.pass } : undefined,
      // Keep timeouts short so a slow/dead SMTP never hangs a form submission.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });

    await transporter.sendMail({
      from: cfg.from,
      to: cfg.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "send failed";
    console.error("[mail] send failed:", msg);
    return { ok: false, error: msg };
  }
}

// Privacy-respecting notification for a new support request. Deliberately does
// NOT include the phone number or message body — those stay in the restricted
// database. The email only alerts staff to log in and respond.
export async function notifyNewSupportRequest(input: {
  location: string;
  hasAlias: boolean;
  receivedAt: string; // ISO
  adminUrl: string;
}) {
  const when = new Date(input.receivedAt).toLocaleString();
  const subject = "New support request — UpliftGrove";
  const text = [
    "A new confidential support request has been received.",
    "",
    `Received: ${when}`,
    `Location: ${input.location}`,
    `Name/alias provided: ${input.hasAlias ? "yes" : "no"}`,
    "",
    "For privacy, the contact details and message are not included in this email.",
    `Log in to view and respond: ${input.adminUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#2D3142;max-width:520px">
      <h2 style="color:#1A2E40;margin:0 0 8px">New support request</h2>
      <p style="margin:0 0 16px">A new confidential support request has been received.</p>
      <table style="font-size:14px;border-collapse:collapse">
        <tr><td style="padding:2px 12px 2px 0;color:#6b7280">Received</td><td>${when}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#6b7280">Location</td><td>${escapeHtml(input.location)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#6b7280">Name/alias</td><td>${input.hasAlias ? "provided" : "not provided"}</td></tr>
      </table>
      <p style="font-size:13px;color:#6b7280;margin:16px 0">
        For privacy, the contact details and message are not included in this email.
      </p>
      <a href="${input.adminUrl}" style="display:inline-block;background:#E5A93C;color:#1A2E40;
         font-weight:bold;text-decoration:none;padding:10px 18px;border-radius:6px">
        Open the admin panel
      </a>
    </div>`;

  return sendMail({ subject, text, html });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
