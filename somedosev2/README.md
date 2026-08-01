# Some Dose — website

A static Astro site for Some Dose Coffee (Turners Cross, Cork Opera House, and
Hanleys on Frankfield Road). Content is stored as JSON files under
`src/content/` and editable either directly in code or through a visual admin
at `/admin`.

## Stack

- **Astro** (static output, no client framework) — HTML/CSS/vanilla TS only.
- **Content collections** (`src/content/`) as the data layer — also what the
  CMS admin reads and writes.
- **Decap CMS** (`public/admin/`) — a free, git-backed CMS UI. No database,
  no server of its own: it commits straight to this repo.
- Self-hosted fonts (Fraunces, Caveat, Space Mono) in `src/styles/fonts/`.
- Photos in `src/assets/photos/` — processed automatically by Astro's image
  pipeline (AVIF/WebP, responsive `srcset`).

## Deployment — GitHub Pages

This repo is configured for **GitHub Pages** (`.github/workflows/deploy.yml`),
not Netlify. `astro.config.mjs` sets `site`/`base` for
`https://ahroonsanthosh.github.io/somedosev2/`. One manual step is required
since it isn't available through the API this was built with:

1. In the repo: **Settings → Pages → Build and deployment → Source →
   "GitHub Actions"**.
2. Push to `main` (or re-run the "Deploy to GitHub Pages" workflow manually
   from the Actions tab) — it builds and publishes automatically from there.

If you ever attach a custom domain or move to a host that serves from the
root (Vercel, Cloudflare Pages), update `site`/`base` in `astro.config.mjs`
accordingly — the whole site is base-path-safe (fonts, favicon, OG image,
canonical URLs all resolve through `import.meta.env.BASE_URL`, not
hardcoded root-absolute paths), so it survives a subpath either way.

## Editing content

### Option A — edit the JSON files directly

- `src/content/settings/general.json` — business name, tagline, email, socials.
- `src/content/locations/*.json` — the three locations (Opera House, Turners
  Cross, Hanleys). `weight` controls display order (1 = shown first/biggest).
- `src/content/menuCategories/*.json` — menu categories and items/prices.
- `src/content/timeline/*.json` — the "our story" chapters. Leave `image`
  blank to show the wave badge instead of a photo.

Commit the change, push — the GitHub Actions workflow rebuilds and
redeploys automatically.

### Option B — the visual admin at `/admin`

`public/admin/config.yml` is wired to Decap CMS's **GitHub backend** (not
`git-gateway`/Netlify Identity, since this site isn't on Netlify). That
backend talks to the GitHub API directly, but GitHub's OAuth flow needs a
small server-side token exchange — something GitHub Pages itself can't run.
To make `/admin` actually log in, stand up a tiny OAuth proxy (a few free,
one-file options exist — e.g. a Cloudflare Worker or Vercel/Netlify function
running something like `decap-cms-oauth-provider` — deploy takes a couple of
minutes) and point `base_url` in `config.yml` at it. Until that's done, the
JSON files (Option A) are the working path for edits.

No database, no separate CMS hosting bill beyond that one small proxy.
`public/admin/config.yml` maps directly to the content collections above.
New photos dropped into `src/assets/photos/` need a developer to add them
(the CMS lets editors *choose* among existing photos per location/chapter,
not upload arbitrary new ones into the optimized image pipeline).

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Where things live

- `src/components/` — one file per section (Hero, Story, Menu, Locations,
  Gallery, HoursContact, Footer) plus `ornaments/` for the hand-drawn SVG
  wave divider, underline mark, wave badge/seal, and wave mark logo.
- `src/styles/tokens.css` — every design token (colour, type scale, spacing,
  easing curves) as CSS custom properties. Change the palette or scale here.
- `src/scripts/reveal.ts` — the scroll-reveal system (IntersectionObserver,
  respects `prefers-reduced-motion`).

## Notes on the content

Menu prices are estimates sourced from public listings, not a confirmed
price list from the owner — flagged as such on the page. Opera House and
Hanleys hours are described qualitatively (foyer/stockist hours) rather than
invented, since no fixed hours for those two locations were supplied.
