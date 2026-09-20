# Heloria Labs

A realtime WebGL experience built on Vite, TypeScript and Three.js.

This repository currently contains the project foundation only: a renderer, a
full-viewport canvas and a frame loop rendering an empty scene. There is no
design, scene content, shader or animation yet.

## Requirements

Node 20.19 or newer.

## Getting started

```bash
npm install
npm run dev
```

The dev server prints a local URL. You should see a blank dark canvas filling
the viewport, with no console errors.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run typecheck` | Type-check the app and the Vite config |
| `npm run build` | Type-check, then build for production into `dist/` |
| `npm run preview` | Serve the production build locally |

## Layout

```
index.html           Document shell and the #stage canvas
src/main.ts          Entry point; boots the app
src/core/App.ts      Renderer, camera, frame timer, viewport handling
src/styles/main.css  Document and canvas layout
vite.config.ts       Vite and GLSL plugin configuration
CLAUDE.md            Project standards and the permanent quality benchmark
```

## Contributing

Read `CLAUDE.md` first. It records the permanent quality benchmark for this
project and the protocol that must be followed before any major visual,
interaction, animation, asset, shader or performance decision.
