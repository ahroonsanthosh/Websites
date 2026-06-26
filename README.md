# Hansum Rotisserie

Premium marketing website + bespoke CMS for **Hansum Rotisserie**, located inside
Marina Market, Cork City, Ireland.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion and a
fully custom, dependency-free content management system.

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev
```

Visit:

- `http://localhost:3000` — the public website
- `http://localhost:3000/admin` — the content management area

## The CMS (`/admin`)

A completely custom CMS — no Sanity, Contentful, Strapi, Payload or any third party.

- **Auth**: email + password (set in `.env.local`), signed JWT in an httpOnly cookie.
- **Protection**: middleware guards every `/admin` route and the content/media APIs.
- **Storage**: content lives as JSON files in `/content/`, images in `/public/uploads/`.
- **Editors**: Hero, Menu, Gallery, Location & Hours, Reviews, SEO and Settings.

The business owner can only edit content — never code, config, styling or animations.

### Editable content models

| File | What it controls |
|------|------------------|
| `content/hero.json` | Headline, subheadline, CTA text + links, badge |
| `content/menu.json` | Menu items, prices, categories, featured/availability |
| `content/gallery.json` | Gallery images + alt text |
| `content/location.json` | Address + opening hours |
| `content/reviews.json` | Customer testimonials |
| `content/seo.json` | Meta title, description, keywords |
| `content/settings.json` | Social links, announcement banner, contact |

## Architecture

- `src/components/sections/` — one component per page section.
- `src/components/ui/` — reusable primitives (magnetic button, animated text,
  custom cursor, `HansumImage`, etc).
- `src/lib/content.ts` — typed read/write helpers for the JSON content store.
- `src/lib/auth.ts` + `src/middleware.ts` — JWT auth and route protection.
- `src/app/api/` — login/logout, content CRUD, media upload/delete.

Each editable section has its own content model, editor page, validation and
rendering logic — so the CMS can be reused for future restaurant sites.

## Deploying to Vercel (with persistent CMS)

The CMS writes content and images. Vercel's runtime filesystem is read-only, so
to persist edits in production the app uses **Vercel Blob** when a token is
present (and the local filesystem otherwise — no code change needed).

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. In the project, create a **Blob** store (Storage tab) and connect it — this
   sets `BLOB_READ_WRITE_TOKEN` automatically.
3. Add env vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`.
4. Deploy.

`src/lib/storage.ts` is the single switch point: filesystem locally, Blob in
production. Reads always fall back to the bundled seed JSON, so a fresh deploy
shows default content until the owner makes their first edit.

## Image handling

All imagery goes through `HansumImage`, which renders an optimised `next/image`
when a real asset exists and falls back to an on-brand gradient + emoji
placeholder otherwise. Replace placeholders by uploading via the admin Gallery.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
```
