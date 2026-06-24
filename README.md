# Wild Café — Tralee

Marketing website for **Wild Café**, 17 The Mall, Tralee, Co. Kerry.

A single-page, fully responsive site built with plain HTML, CSS and JavaScript —
no build step, no dependencies. Just open `index.html` in any browser or drop the
folder onto any static host (Netlify, Vercel, GitHub Pages, or the café's existing
hosting at wildcafe.ie).

## What's inside

```
index.html        All page content & structure
css/styles.css    Design system, layout, animations
js/main.js        Interactions
js/vendor/         GSAP + ScrollTrigger (vendored locally, no CDN)
assets/            Café photos
```

GSAP is the only third-party library. It's vendored under `js/vendor/` (installed
via `npm i gsap`, copied from `node_modules`) so the site has **no CDN dependency**
and works offline. `node_modules` is gitignored; the two `js/vendor/*.min.js` files
are all that's needed at runtime.

## Features

- **Hero** with parallax photo, animated waves, decorative white-branch motif
  (a nod to the café's signature interior) and staggered headline reveal.
- **Pinned coffee scene** — a scroll-driven moment (GSAP ScrollTrigger): the
  section pins while an overhead latte-art cup fades in, rises to a medallion at
  the top and the headline assembles, then releases to the next section. Tamed to
  ~1.7 screens of scroll; falls back to a calm static block for reduced-motion.
- **Live opening hours** — the "Visit" section shows *Open now / Closed* in real
  time and highlights today's row, driven by the real schedule.
- **Filterable menu** — the full Wild menu (breakfast, egg dishes, mains, salads
  & bites, sandwiches) with tabbed categories.
- **Reservation form** with inline validation and a success state.
- **Gallery**, story section, animated stat counters, scrolling marquee.
- **Elegant, subtle animations** throughout via `IntersectionObserver`, all of
  which automatically disable for visitors who prefer reduced motion.
- Mobile-first responsive layout with an off-canvas menu.

## Real details baked in

- Address: 17 The Mall, Tralee, Co. Kerry, V92 V320
- Phone: 087 102 6098
- Hours: Mon–Sat 08:00–18:00, Sun 11:00–17:00
- Instagram: @wildtralee · Web: wildcafe.ie · Wifi: `wildtralee`
- Full breakfast & lunch menu with current prices.

## To make it fully "live"

1. **Photos** — the images currently load from Unsplash as tasteful placeholders.
   Swap the `src` URLs in `index.html` for real Wild Café photography (the teal
   storefront, the branch chandelier, the food) for maximum impact. Drop them in
   an `assets/` folder and reference locally.
2. **Reservation form** — it's front-end only. Point it at a form service
   (Formspree, Netlify Forms) or the café's booking system by handling the submit
   in `js/main.js` / setting a form `action`.
3. **Facebook link** — add the real URL in the Visit and footer sections.
4. **Map marker** — the OpenStreetMap embed is centred on The Mall; nudge the
   `marker=` coordinates in the iframe if you want it pixel-perfect.

## Local preview

```bash
# any static server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```
