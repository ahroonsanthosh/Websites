# Chez Christophe — Website

An elegant, fast-loading marketing site for **Chez Christophe**, a French
restaurant & wood-fired pizzeria at 11 Courthouse Lane, Tralee, Co. Kerry.

Built as a self-contained static site — no build step, no dependencies.
Works on any device and deploys to GitHub Pages, Netlify, Vercel, or any
web host by uploading the folder.

## Structure

```
index.html        All page content (single-page, anchor navigation)
css/styles.css    Design system + components (charcoal × copper palette)
js/main.js        Animations & interactions (vanilla JS)
```

## Features

- Animated page loader, scroll-reveal, hero word reveal, hero parallax
- Sticky header with scroll progress bar and scroll-spy navigation
- Tabbed à la carte menu (Starters / Mains / Specials / Desserts)
- Early-bird banner (2 courses €28 / 3 courses €31)
- Full wood-fired pizza list
- Photo gallery, story section with animated counters
- Reservation form that opens a pre-filled email to the restaurant
- Contact, opening hours, social links and an embedded map
- Fully responsive, accessible, and respects `prefers-reduced-motion`

## Things to finish / customise

- **Photos** — the gallery, hero and story currently use tasteful stock
  photos from Unsplash (loaded via CDN). Replace the `src` URLs with real
  photos of the restaurant for the best result. Drop image files in
  `assets/` and point to them.
- **Opening hours** — placeholder in the "Visit" section; send the real
  times and they go straight in.
- **Reservations** — the form opens the visitor's email app pre-filled to
  `Chezchristophe3@gmail.com`. To collect bookings without email, point the
  form `action` at a service like [Formspree](https://formspree.io) or a
  booking provider.
- **Map** — uses a Google Maps search embed for "Chez Christophe,
  Courthouse Lane, Tralee". Swap for the exact place embed if desired.

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
