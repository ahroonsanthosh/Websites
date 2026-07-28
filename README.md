# Blondie — Main Street, Ballincollig

The website for Blondie Café. Static HTML, CSS and JavaScript. No CMS, no login,
no server. Everything is built from one plain text file and published by GitHub
Actions.

Live: **https://ahroonsanthosh.github.io/blondie/**

---

## Changing the hours (about ten seconds)

Open **`content.json`**, find the `hours` block, edit the day you need, save,
commit. The site rebuilds and republishes itself.

```json
{ "day": "Sat", "schema": "Saturday", "open": "08:30", "close": "16:30",
  "label": "8.30 — 4.30", "note": "Busiest 11 to 1." }
```

* `open` / `close` are 24-hour and feed both the Google listing data and the
  live "Open right now / Closed — back Tuesday at 8.30" line on the page. Leave
  them empty (`""`) for a closed day.
* `label` is what a person reads.
* `note` is the small aside on the right. Leave it `""` for none.

## Changing anything else

It is all in `content.json`, in the order it appears on the page: the headline,
the wine pairings, the bake case list, the menu sections, the questions people
ask at the counter, the address, the OpenTable link, the social links. Change
the text, commit, done. Section headings, alt text and the structured data all
follow along.

The one thing to know: `hero.lines` is the big headline, and each entry is one
line of it. Keep each line short (about 13 characters) so it does not wrap.

## Photographs

Originals live in `assets/img/` as `bl1.webp` … `bl10.webp`. To swap one, drop a
replacement in with the same filename and commit — the build regenerates every
crop and size. To add a new one, add it to `PLAN` and `FOCAL` in
`tools/build-images.py`, then point a `content.json` entry at its name.

Derivatives (`assets/img/out/`) and the built site (`dist/`) are generated, not
committed.

## The logo

`assets/logo.svg` is a vector reproduction of the circular shop sign, traced
from the storefront photograph (`bl1.webp`), where it appears at roughly 56
pixels across. It is faithful in structure, proportion and layout, but the
source is a soft, overcast photograph rather than artwork, so the red and the
finer curves of the rosette are an interpretation.

**If the original artwork exists, use it.** Replace `assets/logo.svg` with it
and everything picks it up at once — the header, the preloader, the favicon and
the social-share image are all drawn from that single file.

## Building locally

```bash
pip install pillow
python3 tools/build-images.py    # crops + AVIF/WebP derivatives, writes a manifest
python3 tools/build.py           # renders dist/ from content.json
cd dist && python3 -m http.server 8899
```

## Deploying

Push to `main`. `.github/workflows/pages.yml` installs Pillow, rebuilds the
images and the site, and publishes `dist/` to GitHub Pages. Nothing else to do.

If Pages has never been switched on for this repository: **Settings → Pages →
Build and deployment → Source: GitHub Actions**, then re-run the workflow.

## What is in here

```
content.json                 every word on the site
assets/img/bl*.webp          the ten original photographs
assets/logo.svg              the traced shop badge
assets/fonts/                Fraunces, Caveat, DM Mono (self-hosted, subset to latin)
assets/vendor/               GSAP, ScrollTrigger, Draggable, Lenis (vendored, no CDN)
src/index.template.html      page structure
src/styles.css               the whole design system
src/main.js                  the motion
tools/build-images.py        crops and derivatives
tools/build.py               renders dist/
```
