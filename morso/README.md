# Morso Napoletano Café — Website

Static site for Morso Napoletano Café, Carrigaline West, Co. Cork. No
framework, no build step, no CMS — plain HTML/CSS/JS, deployed straight to
GitHub Pages.

**Live site:** https://ahroonsanthosh.github.io/morso/

## Editing content

Everything editable lives directly in `index.html` as plain text, inside
clearly marked comment blocks. No login, no build step — edit the file,
commit, push, and the site rebuilds itself via GitHub Actions.

- **Hours** — search `index.html` for `EDIT HOURS BELOW`. It's a plain table:
  one row per day, opening/closing time or `Closed`.
- **Menu & prices** — search for `EDIT MENU BELOW`. Each dish is one list
  item: name, price, short description.
- **Phone / address / socials** — search for `EDIT CONTACT BELOW`, plus the
  matching details repeated in the `<footer>` further down and in the
  `JSON-LD` block near the top of `<head>` (keep those two in sync with any
  address/phone change so search engines see the same info as the page).

Every edit is a plain text change — no rebuild tooling required beyond what
GitHub Actions already does on push.

## Where images live

- `assets/img/source/` — the original photos as supplied (`ms1.webp` …
  `ms13.webp`), untouched. Kept for provenance; nothing on the page links to
  these directly.
- `assets/img/` — responsive derivatives generated from the originals: each
  photo exported at several widths (480/800/1200/etc.) in AVIF, WebP, and
  JPEG, named `<slug>-<width>.<ext>` (e.g. `storefront-umbrellas-1200.avif`).
  The site's `<picture>` elements reference these directly via `srcset`.
- `assets/img/og-image.jpg` — the 1200×630 social share image.
- `assets/img/favicon.svg`, `favicon.ico`, `apple-touch-icon.png` — the
  favicon set, generated from the reconstructed brand mark.

To swap or add a photo: drop the new original in `assets/img/source/`, export
it at the same widths/formats as its neighbours (any image tool works — no
particular pipeline is required), and update the relevant `<picture>` block
in `index.html`.

## The logo

There was no vector logo file in the source assets — only the storefront's
physical channel-lettering sign, photographed at an angle. The mark used
across the site (`#icon-logo` in the inline SVG sprite near the top of
`<body>`) is a faithful **reconstruction** built from those photos: matched
proportions, letter case, script pairing, and the sampled signage gold
(`#D7A928`), set in a rounded geometric webfont chosen to match the sign's
letterforms. It is not a hand-trace of an original vector file — none
exists — so treat any redesign of the physical sign as the source of truth
that this mark should be re-matched against.

## Fonts & motion libraries

Self-hosted, no CDN dependency:

- **Fonts** — `assets/fonts/` (Fraunces, Caveat, Space Mono, and the
  logo-only Baloo 2), referenced from `css/fonts.css`.
- **Motion stack** — `js/vendor/` (GSAP core, ScrollTrigger, Lenis).
  `Draggable` is intentionally *not* in that list — it's lazy-loaded by
  `js/app.js` only on desktop viewports, since it exclusively powers the
  draggable sticker row and shouldn't cost mobile visitors anything.

## Deploying

Deployment is automatic: **push to `main`** and the
`.github/workflows/deploy.yml` Actions workflow builds nothing (there's
nothing to build) and publishes the repository root straight to GitHub
Pages.

First-time setup (once per repo): in **Settings → Pages**, set the source to
**GitHub Actions**. After that, every push to `main` redeploys.

To preview locally before pushing, serve the repo root with any static file
server that preserves the `/` path (avoid tools with clean-URL redirects —
they can silently break the site's relative asset paths):

```
python3 -m http.server 8080
# visit http://localhost:8080/
```

## Structure

```
index.html            All markup, inline SVG sprite (logo/ornaments/icons), JSON-LD
css/tokens.css         Design tokens: colour, type scale, spacing, easing
css/fonts.css          Self-hosted @font-face declarations
css/style.css          Everything else
js/app.js              Motion system (Lenis/GSAP/ScrollTrigger/Draggable)
js/vendor/              Self-hosted third-party libraries
assets/fonts/           Self-hosted webfonts (woff2)
assets/img/             Responsive image exports + source originals
.github/workflows/      GitHub Pages deploy workflow
```
