# The Lough Café — website

A static, no-build site for The Lough Café (1B The Lough Road, Cork). Deployed to
GitHub Pages via Actions on every push to `main`.

## Editing content

Everything — hours, menu, prices, address, testimonials — lives directly in
**`index.html`** as plain HTML. There is no CMS and nothing to log into.

- **Hours**: search for `id="hours-list"` and `#open-label` / `#open-dot` — the
  times shown per day live in that `<ul>`. The green/rust "open now" dot is
  computed automatically from the visitor's clock in `js/main.js`
  (`openStatus`), so you only need to edit the displayed hours, not the logic,
  unless the café's actual opening hours change.
- **Menu & prices**: search for `EDIT-MENU-START` / `EDIT-MENU-END` in
  `index.html`. Each item is a `.menu-item` block with a name, an optional
  note, and a price — copy an existing block and change the text.
- **Address / phone / socials**: search for `id="visit"`.
- **Testimonials**: search for `id="corkboard"`.

Reload the page after saving — there's no build step for content changes.

## Images

Source photography lives in `source-photos/` (the original, ungraded exports).
The site never serves those directly — `scripts/process_images.py` colour-grades
them and writes responsive WebP + JPEG variants into `images/`, which is what
`index.html` actually references. If you add or replace a photo:

1. Drop the new file into `source-photos/`.
2. Add an entry to the `JOBS` dict in `scripts/process_images.py` (basename +
   target widths).
3. Run `python3 scripts/process_images.py` (needs `Pillow`: `pip install Pillow`).
4. Reference the new `images/<basename>-<width>.webp` files from `index.html`.

The Open Graph share image (`images/og-image.jpg`) is generated the same way,
cropped to 1200×630 from the wide counter shot.

## Fonts

Self-hosted, latin-subset WOFF2 files in `fonts/` (Fraunces, Caveat, Space
Mono from Google Fonts, subset with `fonttools`). No Google Fonts request
happens at runtime.

## Motion / scripts

`js/vendor/` holds self-hosted copies of GSAP and ScrollTrigger (no CDN
dependency, no third-party request at runtime). `Draggable.min.js` is fetched
on demand only on desktop widths, since it's only used for the hero stickers.
`js/main.js` is the whole motion system: scroll reveals, the nav, the
marquee, the draggable hero stickers, the corkboard testimonial tilt, the
menu tabs. Everything respects `prefers-reduced-motion`.

`index.html` actually loads `css/styles.min.css` and `js/main.min.js` —
minified copies kept alongside the readable source files for a faster first
paint. After editing `css/styles.css` or `js/main.js`, regenerate them:

```
npx clean-css-cli -o css/styles.min.css css/styles.css
npx terser js/main.js -c -m -o js/main.min.js
```

## Deploy

Pushing to `main` triggers `.github/workflows/pages.yml`, which stages the
deployable files (leaving `source-photos/` and `scripts/` out of the published
site) and publishes them with the standard `actions/deploy-pages` flow.

To enable it the first time, in the repo's **Settings → Pages**, set
**Source** to **GitHub Actions** (only needs doing once).

Live site: https://ahroonsanthosh.github.io/lough/

## Local preview

No build step — just serve the folder root, e.g.:

```
python3 -m http.server 8000
```

then open `http://localhost:8000/`.
