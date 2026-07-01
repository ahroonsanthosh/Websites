# Dulce Bun House — Website

Single-page site for Dulce Bun House, 48 Oliver Plunkett St, Cork.

Built with Vite + React + TypeScript + Tailwind CSS (shadcn-style structure:
`src/components/ui`, `src/lib/utils.ts`), animated with framer-motion / motion
and gsap.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## Things to verify before launch

- **Menu prices are placeholders.** The provided menu photo URLs were not
  reachable from the build environment, so items/prices in
  `src/data/site.ts` are realistic guesses — swap in the real menu.
- Gallery images hotlink Google Maps photo URLs. For reliability, download
  them to `public/` and update `src/data/site.ts`.
- The hero video streams from Pexels; replace with in-house footage if
  available.

## Structure

- `src/data/site.ts` — all copy-editable content (hours, menu, contact, images)
- `src/components/sections/` — page sections top to bottom
- `src/components/ui/` — reusable animation primitives (pulse-beams,
  animated-video-on-scroll, spiral-animation)
