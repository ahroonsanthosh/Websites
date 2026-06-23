# Parkgate Coffee — Tralee, Co. Kerry ☕

A polished, fully responsive marketing website for Parkgate Coffee, *Voted Best
Coffee in Kerry 2023*. Built as a fast, dependency-free static site with elegant,
performance-conscious animations.

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

## Things to customise

Search the markup for these placeholders and swap in the real values:

| What | Where |
|------|-------|
| Address (`12 The Mall…V92 ABC1`) | `index.html` → Visit section + map `bbox`/`marker` coords |
| Email / phone | `index.html` → Visit section + footer |
| Menu items & prices | `index.html` → Menu section |
| Social links | `index.html` → footer |
| Photography | `data-img="…"` attributes (currently Unsplash placeholders) |

The map uses a free OpenStreetMap embed centred near Tralee — update the
`bbox`, `marker`, and the Google Maps "Get directions" destination once the
exact location is confirmed.

## Files

```
index.html    Markup & content
styles.css    Theme, layout, animations, responsive rules
script.js     Loader, nav, scroll-reveal, lazy images, parallax
```
