# Project screenshot provenance

All images under `public/projects/` are **genuine renders of the client websites**. None were
mocked up or generated.

| File | Source | Captured |
| --- | --- | --- |
| `ss-builders/desktop-fold.jpg` | SS Builders website, homepage, 1440×900 @2x | 2026-10-09 |
| `ss-builders/desktop-section.jpg` | SS Builders website, "From line to living" section | 2026-10-09 |
| `ss-builders/mobile-fold.jpg` | SS Builders website, homepage, 390×844 @2x | 2026-10-09 |
| `belin-dentistry/desktop-fold.jpg` | Dr. Belin's Dentistry website, homepage, 1440×900 @2x | 2026-10-09 |
| `belin-dentistry/desktop-section.jpg` | Dr. Belin's Dentistry website, "Our Core Values" section | 2026-10-09 |
| `belin-dentistry/mobile-fold.jpg` | Dr. Belin's Dentistry website, homepage, 390×844 @2x | 2026-10-09 |

## How they were captured

The live domains (`ssbuilders18.com`, `www.drbelinsdentistry.com`) are hosted on Vercel, and
outbound connections to Vercel's edge were blocked from the build machine at capture time
(`ERR_CONNECTION_TIMED_OUT`, also for `vercel.com`). The captures were therefore rendered with
headless Chrome from the **local source builds of the same projects** on this machine:

- SS Builders — `~/Desktop/Construction-Project` (`next dev`, port 3101)
- Dr. Belin's Dentistry — `~/Desktop/clinic-portal/frontend/dist` (the committed production
  build, served statically on port 3102)

Because a local build can drift from what is deployed, re-capture from the live URLs before
launch if possible:

```bash
npx -y playwright@latest install chromium
node scripts/capture-project-screenshots.cjs
```

Then convert the PNGs to JPEG (1920px wide for desktop, 780px for mobile) and replace the files
in `public/projects/<slug>/`. Dimensions are declared in `data/projects.ts`; update them if the
aspect ratio changes.

## Placeholders

MBBS Portfolio and D'dreams Interiors have no screenshots yet. The UI renders an intentionally
typographic placeholder (`components/projects/ProjectPlaceholder.tsx`) that does not resemble a
website capture. Add a `cover` (and optional `previews`) entry in `data/projects.ts` once real
screenshots are available and the placeholder disappears automatically.
