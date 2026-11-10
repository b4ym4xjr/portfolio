import {profile} from "@/lib/data";
import {siteUrl} from "@/lib/site";

/**
 * Email templates styled after the site: paper / ink / accent / mist.
 * Table layout + inline styles + web-safe fonts so it renders in Gmail, Outlook and Apple Mail.
 * All user-supplied values must be passed through `escapeHtml` by the caller.
 */

const C = {paper: "#F8F7F4", ink: "#111111", accent: "#FF5A1F", mist: "#E8E7E3"} as const;
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'SFMono-Regular',Menlo,Consolas,'Courier New',monospace";

const label = (text: string, color: string = C.accent) =>
    `<p style="margin:0 0 14px;font-family:${MONO};font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${color}">${text}</p>`;

const button = (href: string, text: string) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:${C.ink};border-radius:999px">
<a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:14px;font-weight:600;color:${C.paper};text-decoration:none;border-radius:999px">${text} <span style="color:${C.accent}">&rarr;</span></a>
</td></tr></table>`;

function layout(preheader: string, body: string) {
    const host = siteUrl.replace(/^https?:\/\//, "");
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${preheader}</title>
</head>
<body style="margin:0;padding:0;background:${C.mist}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.mist}">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.mist}">
<tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.paper};border:1px solid ${C.ink}">
    <tr><td style="background:${C.ink};padding:18px 32px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="font-family:${SERIF};font-size:20px;color:${C.paper}">${profile.name}<span style="color:${C.accent}">.</span></td>
        <td align="right" style="font-family:${MONO};font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${C.paper};opacity:.7">Portfolio</td>
      </tr></table>
    </td></tr>
    <tr><td style="height:4px;line-height:4px;font-size:0;background:${C.accent}">&nbsp;</td></tr>
    <tr><td style="padding:40px 32px 36px">${body}</td></tr>
    <tr><td style="padding:20px 32px;border-top:1px solid ${C.ink};background:${C.mist}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="font-family:${MONO};font-size:11px;letter-spacing:.08em;color:${C.ink}">${profile.location}, ${profile.country}</td>
        <td align="right" style="font-family:${MONO};font-size:11px;letter-spacing:.08em"><a href="${siteUrl}" style="color:${C.ink};text-decoration:none">${host}</a></td>
      </tr></table>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

const row = (key: string, value: string) =>
    `<tr>
<td style="padding:12px 0;border-top:1px solid ${C.mist};width:90px;font-family:${MONO};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${C.ink};opacity:.55" valign="top">${key}</td>
<td style="padding:12px 0;border-top:1px solid ${C.mist};font-family:${SANS};font-size:15px;color:${C.ink}" valign="top">${value}</td>
</tr>`;

/** Email sent to the site owner when someone submits the contact form. */
export function ownerEmailHtml(opts: { safeName: string; safeEmail: string; safeMessage: string; receivedAt: string }) {
    const {safeName, safeEmail, safeMessage, receivedAt} = opts;
    return layout(
        `New message from ${safeName}`,
        `${label("&#9679;&nbsp; New message")}
<h1 style="margin:0 0 28px;font-family:${SERIF};font-size:40px;line-height:1.1;font-weight:400;color:${C.ink}">${safeName}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px">
${row("Email", `<a href="mailto:${safeEmail}" style="color:${C.ink};text-decoration:underline;text-decoration-color:${C.accent}">${safeEmail}</a>`)}
${row("Received", receivedAt)}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px"><tr>
<td style="background:${C.mist};border-left:4px solid ${C.accent};padding:22px 24px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink}">${safeMessage}</td>
</tr></table>
${button(`mailto:${safeEmail}`, "Reply")}
<p style="margin:20px 0 0;font-family:${SANS};font-size:12px;color:${C.ink};opacity:.55">Or just hit reply &mdash; it goes straight to ${safeName}.</p>`,
    );
}

/** Confirmation sent to the visitor (opt-in via CONTACT_AUTOREPLY). */
export function autoReplyHtml(opts: { safeFirst: string }) {
    const {safeFirst} = opts;
    return layout(
        "Your message landed safely.",
        `${label("&#9679;&nbsp; Message received")}
<h1 style="margin:0 0 24px;font-family:${SERIF};font-size:40px;line-height:1.1;font-weight:400;color:${C.ink}">Hi ${safeFirst},<br /><em style="color:${C.accent}">thanks for reaching out.</em></h1>
<p style="margin:0 0 32px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink}">Your message landed safely. I read everything personally and will get back to you within a couple of days.</p>
${button(siteUrl, "Visit the portfolio")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:36px 0 0"><tr>
<td style="border-top:1px solid ${C.ink};padding-top:18px;font-family:${SERIF};font-size:20px;color:${C.ink}">&mdash; ${profile.name}
<div style="margin-top:4px;font-family:${MONO};font-size:11px;letter-spacing:.08em;color:${C.ink};opacity:.6">${profile.role}</div></td>
</tr></table>`,
    );
}
