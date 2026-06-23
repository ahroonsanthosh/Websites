# Parkgate Coffee — Tralee, Co. Kerry ☕

A polished, fully responsive marketing website for Parkgate Coffee on Prince's
Street, Tralee — *Best of Kerry Awards, Best Coffee*. Built as a fast,
dependency-free static site with elegant, performance-conscious animations.

## Highlights

- **Warm & earthy** design system (cream, espresso, terracotta) with `Fraunces` + `Inter`.
- **Elegant animations** — page loader with steaming-cup motif, scroll-reveal,
  marquee, hero parallax glow, hover micro-interactions.
- **Performance first** — lazy-loaded background imagery (`IntersectionObserver`),
  deferred JS, system fonts fallback, no frameworks/build step.
- **Accessible & device-friendly** — semantic HTML, keyboard-friendly nav,
  full `prefers-reduced-motion` support, mobile drawer menu, fluid `clamp()` typography.
- **Sections** — hero, story, menu (coffee / kitchen / bakery), gallery,
  visit with embedded map + one-tap directions, footer.

## Run it

It's a static site — just open `index.html`, or serve locally:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Photos — drop them in `images/`

The site is wired to load Parkgate's own photos from an `images/` folder.
Upload these five files (any reasonable JPEG/PNG, ~1600px wide) using exactly
these names and they appear automatically — no code changes needed:

| Filename | Used for | Suggested shot |
|----------|----------|----------------|
| `images/storefront.jpg` | Hero background + gallery | The black shopfront at dusk with the amber window glow |
| `images/cup-church.jpg` | Story section (portrait) | The Parkgate cup held in front of St John's church |
| `images/bakery.jpg`     | Gallery (tall)   | The bakery display case |
| `images/retail.jpg`     | Gallery          | The retail shelves (KeepCup / AeroPress / beans) |
| `images/menu-board.jpg` | Gallery          | The counter + menu board |

**To upload on GitHub:** open the repo → switch to the working branch →
**Add file → Upload files** → type `images/` before the first filename to
create the folder → drag the photos in → Commit. Until the files exist the
site shows tasteful solid-colour tiles (nothing looks broken).

## Other things to customise

| What | Where |
|------|-------|
| Email / phone | `index.html` → Visit section + footer (currently placeholders) |
| Instagram / Facebook links | `index.html` → footer (`href="#"`) |
| Menu items & prices | `index.html` → Menu section (from the in-store board) |
| Map pin precision | `index.html` → Visit `bbox` / `marker` coords |

The map uses a free OpenStreetMap embed centred on Prince's Street, Tralee
(≈52.269 N, −9.704 W). Fine-tune the `bbox`, `marker`, and the Google Maps
"Get directions" destination if the pin needs nudging onto the shopfront.

## Files

```
index.html    Markup & content
styles.css    Theme, layout, animations, responsive rules
script.js     Loader, nav, scroll-reveal, lazy images, parallax
```
