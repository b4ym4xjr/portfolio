<div align="center">

# S.R. Oli — Portfolio

**A minimalist, editorial personal portfolio with Swiss precision and a brutalist edge.**

![Next.js](https://img.shields.io/badge/Next.js_16-111111?style=flat-square&logo=nextdotjs&logoColor=F8F7F4)
![TypeScript](https://img.shields.io/badge/TypeScript-111111?style=flat-square&logo=typescript&logoColor=F8F7F4)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-111111?style=flat-square&logo=tailwindcss&logoColor=F8F7F4)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-FF5A1F?style=flat-square&logo=framer&logoColor=F8F7F4)

</div>

---

## ✦ Highlights

- **Four-colour palette** — `paper #F8F7F4` · `ink #111111` · `accent #FF5A1F` · `mist #E8E7E3`
- **Motion-rich** — preloader, masked text reveals, parallax, scroll-driven timeline, custom cursor (respects `prefers-reduced-motion`)
- **Smooth scrolling** with Lenis on desktop, native on touch
- **Halftone portrait** — procedural placeholder, or your own photo
- **Contact form** via Resend, with honeypot, rate limiting and optional Turnstile
- **SEO ready** — Open Graph image, sitemap, robots.txt

## ✦ Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run lint       # lint
npm run build      # production build
npm start          # serve the build
```

## ✦ Make it yours

| What      | Where                                                                  |
| --------- | ---------------------------------------------------------------------- |
| Content   | `lib/data.ts` — bio, socials, projects, experience, education, stats   |
| Portrait  | `public/portrait.jpg` (also `.jpeg`, `.png`, `.webp`) — 4:5 crop works best |
| CV        | Replace `public/Sitaram-Oli-CV.pdf`, keeping the filename              |
| Plates    | `lib/halftone.ts` — add a scene, then reference it in `lib/data.ts`    |


## ✦ Contact form

1. Get an API key at [resend.com](https://resend.com/api-keys).
2. `cp .env.example .env.local` and set:

   | Variable             | Purpose                                      |
   | -------------------- | -------------------------------------------- |
   | `RESEND_API_KEY`     | Resend API key                               |
   | `CONTACT_TO_EMAIL`   | Where messages land                          |
   | `CONTACT_FROM_EMAIL` | Sender on a [verified domain](https://resend.com/domains) |

3. Restart the dev server. On Vercel, add the same variables in project settings.

Without `RESEND_API_KEY`, the form shows a friendly "not configured" message.

**Optional:** `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (shared rate limit) · `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` (bot protection) · `CONTACT_AUTOREPLY=true` (visitor confirmation) · `NEXT_PUBLIC_SITE_URL` (canonical URL). See `.env.example`.

## ✦ Structure

```
app/            layout, page, globals.css, API route, SEO files
components/     sections (Hero, About, Work, …) and ui/ motion helpers
lib/            data.ts, halftone.ts, scroll.ts, utils.ts
public/         portrait and CV
```

---

<div align="center">

Built with care · Next.js · Tailwind · Framer Motion

</div>
