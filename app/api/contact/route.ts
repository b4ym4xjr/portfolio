import { Resend } from "resend";
import { profile } from "@/lib/data";

const MAX = { name: 100, email: 254, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Tiny in-memory throttle: 5 messages / 10 min / IP per server instance.
   Good enough to blunt abuse; use a shared store (Upstash, KV…) if you scale out. */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return json({ error: "Contact form is not configured yet. Please email me directly." }, 503);
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Honeypot: real users never fill this. Pretend success so bots move on.
  if (typeof data.company === "string" && data.company.trim() !== "") {
    return json({ ok: true });
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (!name || name.length > MAX.name) return json({ error: "Please enter your name.", field: "name" }, 400);
  if (!EMAIL_RE.test(email) || email.length > MAX.email)
    return json({ error: "Please enter a valid email address.", field: "email" }, 400);
  if (message.length < 10 || message.length > MAX.message)
    return json({ error: "Your message should be between 10 and 5000 characters.", field: "message" }, 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return json({ error: "Too many messages. Please try again later." }, 429);

  const to = process.env.CONTACT_TO_EMAIL || profile.email;
  // Must be a sender on a domain verified in Resend. `onboarding@resend.dev` works for testing
  // (it can only deliver to the email address of your Resend account).
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    // Strip newlines to prevent header injection via the name field.
    subject: `New message from ${name.replace(/[\r\n]+/g, " ")} — portfolio`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<div style="font-family:Helvetica,Arial,sans-serif;color:#111111;background:#F8F7F4;padding:32px">
  <p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin:0 0 24px;color:#FF5A1F">New portfolio message</p>
  <p style="margin:0 0 4px;font-size:20px;font-weight:700">${safeName}</p>
  <p style="margin:0 0 24px"><a href="mailto:${safeEmail}" style="color:#111111">${safeEmail}</a></p>
  <div style="border-top:1px solid #111111;padding-top:20px;font-size:16px;line-height:1.6">${safeMessage}</div>
</div>`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return json({ error: "Couldn't send your message. Please try again or email me directly." }, 502);
  }

  return json({ ok: true });
}
