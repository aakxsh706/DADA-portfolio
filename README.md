# Studio Portfolio

A cinematic, editorial portfolio for an independent web development studio. Built with Next.js
16 (App Router), TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger + SplitText, Lenis smooth
scrolling, Motion for component transitions and Lucide icons.

- **Two font families only:** Space Grotesk (headings) and DM Sans (body), self-hosted via
  `next/font`.
- **Palette:** charcoal `#101010`, warm off-white `#F5F2EB`, muted grey `#999999`, acid lime
  `#D7FF45` (sparingly).
- **Motion:** preloader, masked text reveals, parallax, clip-path image reveals, magnetic
  buttons, custom cursor, pinned horizontal gallery, scroll-driven statement, page transitions,
  scroll progress — all respecting `prefers-reduced-motion`.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your details
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run lint        # ESLint (Next core-web-vitals + TypeScript rules)
npm run typecheck   # tsc --noEmit
npm run build       # production build (Turbopack)
npm run start       # serve the production build
npm run check       # lint + typecheck + build
```

Requires Node.js 20.9+.

## Configuration — what to replace before launch

Everything studio-specific lives in **`data/site-config.ts`** and can be overridden with
environment variables (see `.env.example`). Values marked PLACEHOLDER are intentionally generic:

| Setting | Env var | Default (placeholder) |
| --- | --- | --- |
| Studio name (wordmark, titles, footer) | `NEXT_PUBLIC_SITE_NAME` | `Studio` |
| Public URL (canonical, sitemap, OG) | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |
| Contact email | `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@yourstudio.com` |
| WhatsApp number (digits, intl. format) | `NEXT_PUBLIC_WHATSAPP_NUMBER` | empty → button hidden |
| GitHub / LinkedIn / Instagram | `NEXT_PUBLIC_*_URL` | empty → links hidden |
| Location label | `NEXT_PUBLIC_LOCATION` | `Chennai, India` |

Empty social/WhatsApp values are simply not rendered, so there are never broken placeholder
links.

### Projects

`data/projects.ts` is the single source of truth for the Selected Work showcase, the detail
pages, metadata and the sitemap. Each entry holds copy, category, live URL, layout variant
(`left` / `right` / `full` / `split`), and image paths. Projects without a `cover` image render an
honest typographic placeholder. See `docs/screenshot-provenance.md` for where the current
screenshots came from and how to re-capture them.

### Services

`data/services.ts` holds the five service rows and the three approach pillars.

## Contact form delivery

The form (`components/ui/ContactForm.tsx` → `app/api/contact/route.ts`) validates on the client
and the server, and protects against spam with a honeypot field, a minimum fill time and a
best-effort per-IP rate limit. Delivery uses the first configured provider:

| Provider | Env vars | Notes |
| --- | --- | --- |
| **Resend** (free tier) | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `CONTACT_FROM_EMAIL` | Without a verified domain Resend only delivers to the account owner's email — set `CONTACT_TO_EMAIL` to that address. |
| **Web3Forms** (free tier) | `WEB3FORMS_ACCESS_KEY` | No domain required; create a key for the inbox that should receive inquiries. |

With neither configured, the API answers `503 not_configured` and the form **does not pretend**
the message was sent: it explains that delivery isn't set up and offers a prefilled `mailto:`
link instead.

## Deployment (Vercel)

1. Push the repository to GitHub/GitLab and import it in Vercel (framework preset: Next.js).
2. Add the environment variables from `.env.example` in the Vercel project settings — at minimum
   `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_CONTACT_EMAIL` and one contact
   delivery provider.
3. Deploy. `next build` runs lint-free type checking; `sitemap.xml`, `robots.txt`, Open Graph
   and Twitter images are generated automatically.

Self-hosting works too: `npm run build && npm run start`.

## Project structure

```
app/                 routes: home, projects/[slug], api/contact, sitemap, robots, OG images
components/
  layout/            Navigation, Footer, Preloader, SmoothScroll (Lenis+GSAP), ScrollProgress,
                     CustomCursor, PageTransition + TransitionLink, Grain
  sections/          Hero, MarqueeSection, Approach, SelectedWork, HorizontalGallery,
                     Services, Statement, Contact
  animations/        TextReveal, AnimatedHeading, ParallaxImage, ImageReveal,
                     AnimatedMarquee, SectionTransition
  projects/          ProjectShowcase, ProjectVisual, ProjectPlaceholder, NextProject
  ui/                MagneticButton, ArrowIcon, FlipText, CopyEmail, Availability, ContactForm
data/                site-config.ts, projects.ts, services.ts
hooks/               media-query / reduced-motion / fine-pointer / layout-effect helpers
lib/                 gsap registration, Lenis store, motion tokens, contact validation, utils
public/projects/     real client-site screenshots (see docs/screenshot-provenance.md)
scripts/             screenshot capture helper (ad hoc, not a dependency)
```

## Animation architecture notes

- **One scroll loop.** `SmoothScroll` creates a single Lenis instance driven by `gsap.ticker` and
  forwards scroll events to `ScrollTrigger.update`. Nothing else runs its own rAF loop; the
  marquee and progress bar hook into the same ticker.
- **Reduced motion.** Every GSAP effect is registered through `gsap.matchMedia()` with
  `(prefers-reduced-motion: no-preference)`; Lenis is not created, the preloader is skipped and
  text is shown immediately. Reveal-gated text is hidden only when JS is running *and* motion is
  allowed (`html.js .will-reveal`), so content is always visible without JavaScript.
- **Text reveals** use GSAP SplitText with `aria: 'auto'` so screen readers get the sentence once,
  never the fragments.
- **Pinned sections** (horizontal gallery, statement) register their ScrollTriggers in a layout
  effect, so GSAP unwraps the pin spacer before React removes the node on navigation.
- **Cleanup.** Each component reverts its own `matchMedia`/`context` on unmount; route changes
  reset scroll and refresh ScrollTrigger.
- **Touch devices** get native scrolling, no custom cursor, no magnetic pull and a swipeable
  horizontal gallery instead of a pinned one.

## Accessibility & SEO checklist

Semantic landmarks and heading order, skip link, visible focus rings, labelled form fields with
inline errors, `aria-live` status messages, keyboard-closable menu, alt text on all screenshots,
`prefers-reduced-motion` support, unique titles/descriptions per page, canonical URLs, Open
Graph + Twitter cards (generated images), JSON-LD on project pages, sitemap and robots.

## Known limitations

- Screenshots for MBBS Portfolio and D'dreams Interiors are not available yet (placeholders).
- The current SS Builders / Belin Dentistry captures were rendered from local builds because the
  live domains were unreachable from the build machine; re-capture from the live sites when
  possible (`docs/screenshot-provenance.md`).
- The in-memory rate limiter is per server instance; on serverless hosting it is best-effort
  only. Add a durable store (e.g. Upstash) if abuse becomes a problem.
