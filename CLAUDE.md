# Heloria Labs — Website

Original WebGL website for **Heloria Labs Limited**, a software company in Ireland
("We build our own software and run it ourselves"). Reference for existing brand
content: https://www.helorialabs.com/

---

## THE QUALITY BENCHMARK (PERMANENT)

**https://why.zero.university/ is the permanent technical and visual quality
benchmark for this project.**

It **must be consulted before every major visual, interaction, animation, asset,
shader and performance decision.** This is a standing requirement for the entire
lifetime of the project, not a one-off research step. Before committing to any
such decision, look at how the benchmark solves the equivalent problem, then ask
whether the Heloria solution stands at the same level of craft. If it does not,
it is not finished.

**We do not copy Zero University.** The goal is an original Heloria experience at
a comparable level of craftsmanship: WebGL quality, interaction quality, motion
quality, visual polish and performance engineering. Copying its design, layout,
copy, palette, assets or scene concepts is explicitly out of scope. Matching its
standard of execution is the point.

### What "benchmark level" means in practice

Observed from the benchmark, for calibration:

- One full-viewport `<canvas>` (`position: fixed`, `z-index: 1`) carrying the
  experience; DOM UI as a separate `pointer-events: none` overlay layer above it.
- Zero white pre-paint: the first painted frame already shows the scene's base
  colour/gradient, via a fixed element behind the transparent canvas, handed over
  seamlessly once WebGL draws its matching gradient.
- Small-viewport (`svh`) units where the canvas sizes from `window.innerHeight`,
  so DOM and WebGL agree on mobile while the URL bar is visible.
- A real loading experience (progress-driven counter with per-digit roll),
  not a spinner.
- Custom cursor rendered from a sprite atlas; native cursors suppressed.
- Considered HUD material work (layered fill / burn / highlight / edge / inner
  glow passes to build a glass surface).
- Audio is a first-class, user-toggleable part of the experience.
- Staged scroll narrative with a ruler/navigation affordance and per-stage state.
- Video textures preloaded as hidden, muted, `playsinline` elements with
  device-specific variants.
- Accessibility carried through: `role`, `aria-label`, `aria-live`,
  `progressbar` semantics on the interactive layer.
- Aggressive resource hints (`dns-prefetch`, `preconnect`), hashed and
  code-split bundles.
- Dense, explanatory comments recording *why* a technique was chosen. Match that
  discipline.

---

## Stack (fixed)

- **Vite** — dev server and build
- **TypeScript** — strict
- **Three.js** — used **directly**
- **GSAP** — animation and the single application clock (`gsap.ticker`)
- **Howler** — audio
- **vite-plugin-glsl** — GLSL imports with `#include` resolution

### Hard constraints — do not introduce

- No Next.js
- No React Three Fiber (or React at all)
- No website templates
- No UI framework
- No component library

Direct Three.js, direct DOM. Anything beyond the stack above needs an explicit
decision recorded here first.

---

## Commands

```bash
npm install
npm run dev        # dev server on http://localhost:5173
npm run build      # tsc --noEmit, then vite build
npm run preview    # serve the production build
npm run typecheck  # types only
```

---

## Layout

```
index.html           single #webgl canvas + module entry
src/
  main.ts            entry: boots App, wires HMR disposal
  core/
    App.ts           renderer, scene, camera, render loop, lifecycle
    Viewport.ts      size + device pixel ratio tracking
  styles/
    main.css         foundation styles only (no design system yet)
  types/
    glsl.d.ts        typings for GLSL imports
```

Path alias: `@/*` → `src/*` (declared in both `tsconfig.json` and
`vite.config.ts`; keep them in sync).

---

## Engineering rules

- **One clock.** The render loop runs on `gsap.ticker`. Never add a second
  `requestAnimationFrame` loop; motion and rendering must not drift apart.
- **Renderer owns sizing.** `Viewport` measures, `App.applySize` applies.
  `setSize(w, h, false)` — CSS sizes the canvas, the renderer only sizes the
  drawing buffer. Device pixel ratio is clamped (default 2).
- **Clear colour matches CSS.** The renderer clear colour and the `--bg` CSS
  variable must stay identical, so there is no flash before the first frame.
- **Everything disposable.** Every class that allocates GPU resources or adds
  listeners exposes `dispose()` and is torn down by its owner. Geometries,
  materials, textures and render targets are disposed explicitly.
- **Context loss is handled**, not assumed away. The loop stops on
  `webglcontextlost` and resumes on `webglcontextrestored`.
- **Hidden tabs render nothing.** The loop stops on `visibilitychange`.
- **No console errors or warnings.** Ever, in dev or production.
- **Shaders live in `.glsl`/`.vert`/`.frag` files**, imported through
  `vite-plugin-glsl`. No shader source inlined as template literals in `.ts`.

---

## Current state

**Step 1 complete — project foundation only.**

What exists: a working Vite + TypeScript application that renders an empty
Three.js scene (a blank WebGL canvas), resizes correctly, handles context loss
and tab visibility, type-checks and builds clean.

Deliberately **not** built yet: website design, hero scene, 3D assets, shaders,
animations, navigation, sections, effects. Do not add any of these without an
explicit instruction to move to the next step.
