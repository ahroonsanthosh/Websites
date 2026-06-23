# Buttermilk — Website

A bright, fast, single-page website for **Buttermilk**, an all-day brunch spot at
Boyles of Ballyseedy, Tralee, Co. Kerry. *Good Food, Good Times.*

Built as a static site — plain **HTML, CSS and JavaScript**, no build step, no
dependencies. It loads fast on any device and the animations degrade gracefully
on mobile and for visitors who prefer reduced motion.

## What's inside
- **Cinematic hero** with parallax photo, floating brand blobs and a rotating
  "Good Food · Good Times" badge.
- **Animated marquee** of signature dishes.
- **Scroll-driven video stage** — a sticky section where the video scales up and
  its clip-path morphs from a rounded pill into a full rectangle as you scroll,
  with the heading and button easing in. This is a dependency-free vanilla
  recreation of a React/`motion` "animated video on scroll" component, so it
  needs no framework. Swap the clip by replacing `assets/video/buttermilk-hero.mp4`.
- **About** section telling the Buttermilk story.
- **Tabbed menu** — Brunch · Mains & Fries · Salads & Sandwiches · Kids — with
  full allergen key (transcribed from the printed menu).
- **Gallery** grid with hover zoom.
- **Visit** section with address, opening hours, phone and an embedded map.
- Sticky responsive nav with a mobile slide-out menu, scroll-reveal animations,
  and a back-to-top button.

## Structure
```
index.html
assets/
  css/styles.css
  js/main.js
  img/            ← put your own photos here (see assets/img/README.md)
```

## Running it
It's a static site, so just open `index.html` in a browser. To preview with a
local server (recommended so the map iframe and fonts behave):

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000
```

## Hosting
Drag-and-drop deploy to **Netlify**, **Vercel**, **Cloudflare Pages** or
**GitHub Pages** — no configuration needed.

## Editing content
- **Photos:** see `assets/img/README.md`. Search `index.html` for `SWAP:` comments.
- **Menu / prices / hours / phone:** edit directly in `index.html` — everything is
  plain, clearly-labelled HTML.
- **Colours & fonts:** all defined as CSS variables at the top of
  `assets/css/styles.css` (`--cream`, `--rust`, `--orange`, `--clay`).

## Notes
- The logo is recreated in CSS, so no logo image is required. To use the original
  PNG instead, see the note in `assets/img/README.md`.
- The contact phone and Google Maps link use the real details you provided.
