import {Resend} from "resend";
import {profile} from "@/lib/data";
import {autoReplyHtml, ownerEmailHtml} from "@/lib/email-templates";

const MAX = {name: 100, email: 254, message: 5000} as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMIT = 5; // messages …
const WINDOW_S = 10 * 60; // … per 10 minutes, per IP

/* ------------------------------------------------------------------ */
/*  Rate limiting                                                       */
/*  - With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN the counter */
/*    is shared across every server instance / serverless invocation.   */
/*  - Otherwise falls back to in-memory (fine for one long-lived server). */
/* ------------------------------------------------------------------ */
const memory = new Map<string, number[]>();

function limitedInMemory(ip: string) {
    const now = Date.now();
    const recent = (memory.get(ip) ?? []).filter((t) => now - t < WINDOW_S * 1000);
    recent.push(now);
    memory.set(ip, recent);
    if (memory.size > 5000) memory.clear();
    return recent.length > LIMIT;
}

async function limited(ip: string): Promise<boolean> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return limitedInMemory(ip);

    try {
        const key = `portfolio:contact:${ip}`;
        const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
            body: JSON.stringify([
                ["INCR", key],
                ["EXPIRE", key, WINDOW_S, "NX"],
            ]),
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`Upstash ${res.status}`);
        const out = (await res.json()) as Array<{ result?: number }>;
        return (out[0]?.result ?? 0) > LIMIT;
    } catch (err) {
        // Never block real messages because the limiter is down.
        console.error("[contact] rate-limit store error, using in-memory fallback:", err);
        return limitedInMemory(ip);
    }
}

/* ------------------------------------------------------------------ */
/*  Cloudflare Turnstile (optional)                                     */
/*  Enabled when TURNSTILE_SECRET_KEY is set.                           */

/* ------------------------------------------------------------------ */
async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return true;
    if (typeof token !== "string" || !token) return false;
    try {
        const body = new URLSearchParams({secret, response: token});
        if (ip !== "unknown") body.set("remoteip", ip);
        const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body,
            cache: "no-store",
        });
        const out = (await res.json()) as { success?: boolean };
        return out.success === true;
    } catch (err) {
        console.error("[contact] Turnstile verification error:", err);
        return false;
    }
}

const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]!);

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, {status});

export async function POST(request: Request) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("[contact] RESEND_API_KEY is not set");
        return json({error: "Contact form is not configured yet. Please email me directly."}, 503);
    }

    let data: Record<string, unknown>;
    try {
        data = await request.json();
    } catch {
        return json({error: "Invalid request."}, 400);
    }

    // Honeypot: real users never fill this. Pretend success so bots move on.
    if (typeof data.company === "string" && data.company.trim() !== "") {
        return json({ok: true});
    }

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim() : "";
    const message = typeof data.message === "string" ? data.message.trim() : "";

    if (!name || name.length > MAX.name) return json({error: "Please enter your name.", field: "name"}, 400);
    if (!EMAIL_RE.test(email) || email.length > MAX.email)
        return json({error: "Please enter a valid email address.", field: "email"}, 400);
    if (message.length < 10 || message.length > MAX.message)
        return json({error: "Your message should be between 10 and 5000 characters.", field: "message"}, 400);

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!(await verifyTurnstile(data.turnstileToken, ip))) {
        return json({error: "Verification failed. Please refresh the check and try again.", field: "turnstile"}, 400);
    }
    if (await limited(ip)) return json({error: "Too many messages. Please try again later."}, 429);

    const to = process.env.CONTACT_TO_EMAIL || profile.email;
    // Must be a sender on a domain verified in Resend.
    const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <noreply@sitaramoli.com.np>";

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    const receivedAt = escapeHtml(
        new Intl.DateTimeFormat("en-CA", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: profile.timeZone,
        }).format(new Date()),
    );

    const resend = new Resend(apiKey);
    const {error} = await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `New message from ${oneLine(name)}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: ownerEmailHtml({safeName, safeEmail, safeMessage, receivedAt}),
    });

    if (error) {
        console.error("[contact] Resend error:", error);
        return json({error: "Couldn't send your message. Please try again or email me directly."}, 502);
    }

    // Optional auto-reply. Opt-in (CONTACT_AUTOREPLY=true) because it mails an address the visitor typed;
    // combine it with Turnstile + the rate limit above. A failure here never fails the request.
    if (process.env.CONTACT_AUTOREPLY === "true") {
        const first = oneLine(name).split(" ")[0];
        const {error: replyError} = await resend.emails.send({
            from,
            to: email,
            replyTo: to,
            subject: `Got your message, ${first}`,
            text: `Hi ${first},\n\nThanks for reaching out — your message landed safely and I'll reply within a couple of days.\n\n— ${profile.name}`,
            html: autoReplyHtml({safeFirst: escapeHtml(first)}),
        });
        if (replyError) console.error("[contact] auto-reply failed:", replyError);
    }

    return json({ok: true});
}
