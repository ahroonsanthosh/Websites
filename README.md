# Chapel Gate Café — site source

A one-page site for Chapel Gate Café, Ballincollig. Static HTML/CSS/JS, built from a
single content file — no CMS, no server, no login.

## Editing content (hours, phone, menu copy, etc.)

Everything editable lives in **`data/content.json`**. Open it, change the text, save,
commit, and push to `main` — GitHub Actions rebuilds and republishes the live site
automatically. No code changes needed for:

- Opening hours (`hours` and `hoursStructured` — keep both in sync; `hoursStructured`
  feeds the Google-readable schema, `hours` feeds the on-page table)
- Phone number, address, Tripadvisor link
- Hero headline/subtext
- Menu category names, descriptions, and which have photos
- The "Balance" differentiator section copy
- Footer note

Takes under a minute: edit → save → `git commit` → `git push`.

## Editing the logo

The logo is a hand-vectorised recreation of the actual shopfront sign
(`assets/logo/chapel-gate-cafe-logo.svg` and `assets/logo/badge-mark.svg` for the
compact "cgc" monogram used in the nav/footer, plus `assets/logo/favicon.svg`). These
are plain SVG files — edit paths/colours directly if the real sign ever changes, but
otherwise leave them alone; they're reproduced to match the physical sign exactly.

## Adding/replacing photos

1. Drop the new photo in `assets/` (any reasonable resolution).
2. Add an entry to `scripts/process_images.py`'s `JOBS` dict (or reuse an existing
   name to replace one in place).
3. Run `python3 scripts/process_images.py` — this generates the AVIF/WebP responsive
   sizes into `assets/img/`.
4. Reference the new derived filename (without extension/width) in
   `templates/index.template.html` or `data/content.json` as appropriate.
5. Commit both the source photo and the generated `assets/img/*` files.

The GitHub Actions build also regenerates images automatically on every push, so step
3 is a local preview convenience, not strictly required before pushing.

## Local preview

```bash
python3 scripts/process_images.py   # only needed after adding/changing photos
python3 scripts/build.py            # renders templates/ + data/ -> dist/
cd dist && python3 -m http.server 8090
# open http://localhost:8090/
```

## How the build works

- `templates/index.template.html` is a plain HTML file with `{{mustache-style}}`
  placeholders, rendered against `data/content.json` by `scripts/build.py` (a ~100
  line dependency-free templating script — no Jinja/Node build tool required).
- `scripts/build.py` also combines + minifies `css/*.css` into `dist/css/site.css`
  (via `clean-css-cli`) and minifies `js/main.js` (via `terser`), both fetched
  on-demand through `npx` at build time — nothing is vendored into the repo.
- `css/fonts-deferred.css` (Caveat script accents + Space Mono bold labels) loads
  asynchronously since neither is needed above the fold; everything else is in the
  critical path.
- Output lands in `dist/`, which is what actually gets deployed — never hand-edit
  files in `dist/`, they're regenerated from scratch every build.

## Deploy

Handled by `.github/workflows/deploy.yml`: every push to `main` runs
`process_images.py` + `build.py` and publishes `dist/` to GitHub Pages via the
official `actions/deploy-pages` action. Nothing to do manually beyond:

1. **One-time repo setting** (if not already done): *Settings → Pages → Source →
   GitHub Actions*.
2. Push to `main`.

No `gh-pages` branch, no manual `npm run build`, no FTP.

## Structure

```
data/content.json          the one file most edits happen in
templates/index.template.html   page structure + copy placeholders
css/                        design tokens, fonts, component styles
js/main.js                  all interaction/motion logic (no framework)
js/vendor/                  GSAP, ScrollTrigger, Lenis, Matter.js (pinned, self-hosted)
assets/                     source photos, logo SVGs, self-hosted font files
assets/img/                 generated responsive AVIF/WebP derivatives (do not hand-edit)
scripts/build.py            content.json + template -> dist/
scripts/process_images.py   source photos -> assets/img/ responsive derivatives
dist/                       build output (git-ignored, regenerated on every build)
```
