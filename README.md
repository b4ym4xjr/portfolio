# Sitaram Oli — Portfolio

A minimalist-editorial, Swiss-meets-brutalist personal portfolio.
**Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide React**

Palette (the only four colours, enforced in `app/globals.css` by wiping Tailwind's defaults):

| Token    | Hex       |
| -------- | --------- |
| `paper`  | `#F8F7F4` |
| `ink`    | `#111111` |
| `accent` | `#FF5A1F` |
| `mist`   | `#E8E7E3` |

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Add your portrait

The hero portrait is a swappable slot. Until you add a photo it shows a procedural
**halftone placeholder**.

1. Save your photo as **`public/portrait.jpg`** (also accepted: `portrait.jpeg`, `portrait.png`, `portrait.webp`).
2. Restart `npm run dev` (or rebuild). That's it — the site detects the file automatically.

Tips: a **4:5 portrait crop** works best; the image is rendered **grayscale** and masked into the
organic blob, so colour photos are fine. Subject centred, a little headroom, plain background.

## Add your CV

`Download CV` points to `public/Sitaram-Oli-CV.pdf`. A one-page **placeholder** is included —
overwrite it with your real CV using the same filename.

## Contact form (Resend)

The Contact section posts to `app/api/contact/route.ts`, which sends mail through
[Resend](https://resend.com). It validates input, escapes HTML, has a honeypot field and a small
per-IP rate limit, and sets `Reply-To` to the visitor so you can answer straight from your inbox.

1. Create an API key at <https://resend.com/api-keys>.
2. `cp .env.example .env.local` and fill in:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL` — where messages land
   - `CONTACT_FROM_EMAIL` — a sender on a [verified domain](https://resend.com/domains).
     `onboarding@resend.dev` works for testing, but only delivers to your own Resend account email.
3. Restart `npm run dev`. On Vercel etc., set the same variables in the project settings.

Optional hardening (all env-gated, see `.env.example`):

- **Shared rate limit** — `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. Without them a
  per-instance in-memory limiter is used, which resets on restart and isn't shared on serverless.
- **Cloudflare Turnstile** — set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to show the
  widget and verify it server-side.
- **Auto-reply** — `CONTACT_AUTOREPLY=true` sends the visitor a short confirmation (off by default; pair
  it with Turnstile).
- **`NEXT_PUBLIC_SITE_URL`** — canonical URL for the Open Graph image, sitemap and robots.txt.

Without `RESEND_API_KEY` the form shows a friendly "not configured" message instead of failing.

## Edit the content

Everything lives in **`lib/data.ts`**: name, intro, socials, projects, expertise, experience,
education and stats. Items marked `PLACEHOLDER` there (e-mail, social URLs, project names,
employers, institution) are illustrative — replace them with your real details.

## Structure

```
app/            layout (fonts, metadata), page, globals.css (palette + type utilities)
components/     Hero, Portrait, About, Work, Expertise, Experience, Education, Contact,
                Header, Marquee, Cursor, Shell (preloader), Halftone
components/ui/  motion helpers (MaskText, WordFade, Magnetic, Reveal…), Button, brand icons
lib/            data.ts (content), halftone.ts (procedural monochrome scenes), utils.ts
```

## Interaction notes

- **Cursor** (fine pointers only): orange dot + lagging ring. Add `data-cursor="link"` to grow the
  ring, `data-cursor="view"` (+ optional `data-cursor-label`) for the solid orange disc, and
  `data-cursor-theme="dark|accent"` on a section so the cursor stays legible on ink / orange.
- **Motion**: preloader curtain, masked line reveals, scroll-linked paragraph fade, parallax plates,
  a timeline that draws as you scroll, morphing blobs and a mouse-parallax hero. Respects
  `prefers-reduced-motion`.
- **Smooth scroll** is Lenis on fine pointers (native scrolling on touch / reduced motion); use
  `scrollToTarget()` from `lib/scroll.ts` for programmatic scrolling. The marquee speeds up, skews and
  reverses with scroll velocity. The preloader plays once per browser session.
- **Photo treatment**: a real `public/portrait.*` is shown grayscale with a print-style dot screen that
  relaxes on hover. Plates in `lib/halftone.ts` are procedural scenes (`orb`, `ridges`, `arch`, `dawn`,
  `parcels`, …) — add a scene there and reference it in `lib/data.ts`.
- **SEO**: `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`.
- Brand icons (GitHub, LinkedIn, YouTube, X) are inline SVGs in `components/ui/icons.tsx` because
  `lucide-react` v1 ships no brand icons.
