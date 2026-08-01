# Madden's · Coffee House, Tralee

A single-page website for **Madden's**, a coffee house on Milk Market Lane, Tralee, Co. Kerry.
Warm, artisanal design with traditional-meets-playful character and elegant, device-friendly animations.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- Tailwind CSS 3 with a shadcn-style structure (`src/components/ui`, `src/lib/utils.ts`, `@/` alias)
- [Framer Motion](https://www.framer.com/motion/) for animations (respects `prefers-reduced-motion`)
- [lucide-react](https://lucide.dev) icons

## Sections

| Section | Notes |
| --- | --- |
| Hero | `MinimalistHero` component — staggered entrance animations, working mobile menu |
| Our Story | Scroll-reveal copy + values |
| Menu | Coffee, brunch and bakery with € prices |
| Gallery | Masonry photo grid with hover zoom |
| Reviews | Testimonial cards |
| Visit | Address, phone, opening hours |
| CTA | `BackgroundCircles` component — animated concentric rings, warm variant |

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # static production build in dist/
npm run preview  # serve the production build
```

The build output in `dist/` is fully static — deploy to Netlify, Vercel, GitHub Pages or any static host.

## Swapping in real content

- **Photos** are Unsplash placeholders — replace the `images.unsplash.com` URLs in
  `src/App.tsx`, `src/components/site/about.tsx` and `src/components/site/gallery.tsx`
  with real photos of the cafe.
- **Menu & prices** live in `src/components/site/menu.tsx`.
- **Hours / contact** live in `src/components/site/visit.tsx` and `src/components/site/footer.tsx`.
