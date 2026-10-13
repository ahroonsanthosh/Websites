# Heloria Labs: Permanent Development Rules

Original WebGL website for **Heloria Labs Limited**, a software company in Ireland.

This file is the project's constitution. It is not a summary of past work. Every
rule below applies to every future change unless this file is explicitly amended.

---

## 1. The quality benchmark

**https://why.zero.university/ is the permanent technical and visual quality
benchmark for this project.**

It **must be consulted before every major visual, interaction, animation, asset,
shader and performance decision.** This is a standing requirement for the whole
lifetime of the project, not a one-off research step.

> **The reference is a quality benchmark, not a template.**

The goal is an original Heloria experience at a comparable level of
craftsmanship: WebGL quality, interaction quality, motion quality, visual polish
and performance engineering. The goal is not to reproduce Zero University.

### 1.1 Absolute prohibitions

These are permanent. No deadline, convenience or "just for the prototype"
argument overrides them.

- **Never copy Zero's code.** Not their modules, not their shader source, not
  their bundled JavaScript, not snippets lifted from devtools.
- **Never copy Zero's assets.** No models, textures, HDRIs, audio, video,
  sprites, atlases, icons or images taken from their site.
- **Never copy Zero's typography.** Their typefaces (Supply Sans, PP Supply
  Mono, STK Bureau Serif, Bethany Elingston, the Google Sans family as they use
  it) and their type scale are theirs. Heloria has its own.
- **Never copy Zero's branding.** No colour system, logo language, naming,
  voice, iconography or motif borrowed from them.
- **Never copy Zero's exact interactions.** Their scroll ruler, their "99"
  loader counter, their XP meter, their circular drag-to-start handle, their
  next-stage pulse button: these are theirs. Solve the same *problems*
  differently.
- **Never reproduce Zero's exact compositions.** No re-staging of their camera
  framing, scene layouts, stage sequence or screen compositions.

What we take from Zero is the **standard**: the refusal to ship anything
half-finished, the density of engineering behind each effect, and the fact that
every element on screen has a reason to exist.

### 1.2 The mandatory workflow for every major feature

A "major feature" is any new stage, scene, shader, interaction model, asset
pipeline, loading sequence, audio layer, or any change to an existing one that
alters how the site looks, feels or performs.

Every one of these steps is required, in this order. Skipping a step is a
process failure, not a shortcut.

1. **Inspect https://why.zero.university/.**
2. **Inspect the current Heloria implementation.**
3. **Identify the relevant quality principle demonstrated by Zero.** Name the
   principle, not the artefact. The principle behind their loader is "loading is
   part of the experience and its progress is honest", not "put a big number in
   the corner".
4. **Define an original Heloria interpretation.** Write down what Heloria does
   instead, and why it belongs to Heloria rather than to Zero.
5. **Implement.**
6. **Run the browser.** Actually launch it. Not a mental model, not a build log.
7. **Inspect the actual rendered result.** Look at the real pixels, on a real
   canvas, at more than one viewport size.
8. **Compare against Zero's level of craft.** Side by side, honestly.
9. **Identify the largest quality gaps.** Write them down, worst first.
10. **Fix them.**
11. **Inspect again.**
12. **Only then proceed.**

If step 8 concludes "ours is close enough" without a named gap list from step 9,
the comparison was not done properly. There is always a gap. Find it.

### 1.3 Benchmark observations on record

Recorded from direct inspection, for calibration only. These are Zero's
solutions; they are evidence of a standard, not a menu to copy.

- One full-viewport `<canvas>` (fixed, `z-index: 1`) carrying the experience,
  with DOM UI as a separate `pointer-events: none` overlay layer above it.
- Zero white pre-paint: a fixed gradient div behind a transparent canvas paints
  on the first layout, and the WebGL background pass takes over seamlessly.
- `svh` units where DOM must agree with a canvas sized from `window.innerHeight`,
  so mobile URL-bar state does not desynchronise the two.
- Honest, progress-driven loading treated as a designed moment.
- Custom cursor drawn from a sprite atlas, native cursors suppressed globally.
- Material work built from many small layered passes rather than one blur.
- Audio is first-class and user-toggleable, with the toggle state visible.
- A staged narrative with real navigation between stages, including per-stage
  loading state.
- Device-specific video variants, preloaded as hidden muted `playsinline`
  elements.
- Accessibility carried into the interactive layer: `role`, `aria-label`,
  `aria-live`, `progressbar` semantics, `prefers-reduced-motion` honoured.
- Resource hints, hashed filenames, code-split bundles.
- Dense comments in the shipped source explaining *why*, including the failure
  each technique was introduced to fix. Match that discipline.

---

## 2. Anti-patterns: banned by default

The fastest route to a site that looks machine-generated is a pile of effects
that nobody chose. Each item below is **banned by default**. To use one, write
down in the relevant doc or code comment what specific idea it expresses and why
nothing quieter would do. "It looks cool" is not a reason.

- **Generic gradients.** Purple-to-blue wallpaper, aimless mesh gradients, any
  gradient that is not modelling a real light, depth cue or material.
- **Generic glass cards.** Blurred translucent rectangles used as default
  packaging for text.
- **Random particles.** Floating dots and sparkles with no physical or narrative
  meaning.
- **Meaningless 3D objects.** Abstract blobs, torus knots, drifting polyhedra
  and spinning logos that exist because the scene felt empty.
- **Excessive bloom.** Bloom to fake luminance, or to hide weak geometry and
  flat materials.
- **Generic neon.** Cyan-and-magenta glow, synthwave grids, rim-lit everything.
- **Template layouts.** Hero, three feature cards, logo wall, testimonial strip,
  CTA. Anything that could carry another company's name unchanged.
- **Excessive animation.** Motion on every element, scroll-jacked reveals for
  their own sake, entrances that delay reading.
- **Decorative effects without purpose.** Any effect that survives the question
  "what would be lost if this were deleted?" with no answer.

Positive rule: **every element on screen must be defensible.** If it cannot be
justified in one sentence that refers to Heloria's meaning or the user's
understanding, delete it.

---

## 3. Technical benchmark categories

These are the axes on which this project is judged against the benchmark. Each
one gets an explicit decision before a major feature ships, and gaps get recorded
in step 9 of the workflow.

- **Three.js.** Direct use. Scene graph hygiene, correct colour management,
  explicit disposal, no hidden per-frame allocation.
- **WebGL.** Draw-call and state-change budget, instancing, context loss
  handling, capability detection rather than assumption.
- **GLSL.** Shaders authored in real shader files, precision qualifiers chosen
  deliberately, no branch-heavy fragment work on mobile, cost measured not
  guessed.
- **GSAP.** One clock for the whole application. Timelines with intent, easing
  chosen deliberately, `prefers-reduced-motion` honoured.
- **Howler.** Deliberate audio design, correct autoplay-policy unlock, user
  control always available, sprite-based playback, no audio that fights the
  visuals.
- **Virtual progression.** How the user moves through the experience: virtual
  scroll or staged advance, decoupled from native document scroll, resumable and
  interruptible.
- **Scene lifecycle.** Build, prewarm, enter, update, exit, dispose. Every scene
  implements all of it. No leaks across stage changes.
- **Compressed geometry.** Draco or meshopt where it pays, vertex counts chosen
  against a budget, geometry reused and instanced.
- **Compressed textures.** KTX2/Basis for GPU-resident textures, correct colour
  space per map, no oversized textures shipped because they were convenient.
- **Texture atlasing.** UI sprites, icons, cursors and small maps packed, to cut
  request count and texture binds.
- **Staged loading.** Load what the first frame needs, then the rest. Progress
  reported honestly. Later stages fetched before they are reached, not when.
- **Post-processing.** Every pass justified and measured. Half-resolution where
  it is invisible. No stack of passes inherited from a demo.
- **Adaptive quality.** Measure real frame cost and adapt: pixel ratio,
  post-processing, shadow and particle budgets. Degrade deliberately, never
  stutter.
- **Mobile GPU compatibility.** Tested against mobile limits: texture memory,
  fill rate, precision, extension availability. The mobile build is a designed
  build, not a scaled-down desktop one.
- **Performance engineering.** Budgets set before implementation, measured
  after: frame time, draw calls, triangles, texture memory, bundle size,
  time-to-first-frame. A feature that breaks budget is unfinished.

---

## 4. Stack (fixed)

- **Vite**: dev server and build
- **TypeScript**: strict
- **Three.js**: used **directly**
- **GSAP**: animation and the single application clock (`gsap.ticker`)
- **Howler**: audio
- **vite-plugin-glsl**: GLSL imports with `#include` resolution

### Hard constraints, do not introduce

- No Next.js
- No React Three Fiber, and no React
- No website templates
- No UI framework
- No component library

Direct Three.js, direct DOM. Anything beyond the stack above needs an explicit
decision recorded in this file first.

---

## 5. Commands

```bash
npm install
npm run dev        # dev server on http://localhost:5173
npm run build      # typecheck, then vite build
npm run preview    # serve the production build
npm run typecheck  # types only
```

---

## 6. Layout

```
index.html           single #webgl canvas + module entry
docs/                specifications and analyses (see section 9)
src/
  main.ts            entry: boots App, wires HMR disposal
  core/
    App.ts           renderer, scene, camera, render loop, lifecycle
    Viewport.ts      size + device pixel ratio tracking
  styles/
    main.css         foundation styles only
  types/
    glsl.d.ts        typings for GLSL imports
```

Path alias `@/*` maps to `src/*`, declared in both `tsconfig.json` and
`vite.config.ts`. Keep them in sync.

---

## 7. Engineering rules

- **One clock.** The render loop runs on `gsap.ticker`. Never add a second
  `requestAnimationFrame` loop; motion and rendering must not drift apart.
- **Renderer owns sizing.** `Viewport` measures, `App.applySize` applies.
  `setSize(w, h, false)`: CSS sizes the canvas, the renderer sizes the drawing
  buffer only. Device pixel ratio is clamped.
- **Clear colour matches CSS.** The renderer clear colour and the CSS background
  stay identical, so nothing flashes before the first frame.
- **Everything disposable.** Every class that allocates GPU resources or adds
  listeners exposes `dispose()` and is torn down by its owner. Geometries,
  materials, textures and render targets are disposed explicitly.
- **Context loss is handled**, not assumed away.
- **Hidden tabs render nothing.**
- **No console errors or warnings.** Ever, in dev or production.
- **Shaders live in `.glsl`/`.vert`/`.frag` files**, imported through
  `vite-plugin-glsl`. No shader source inlined as template literals in `.ts`.
- **No per-frame allocation.** Reuse vectors, matrices and colours.
- **Comment the why.** Record the constraint or failure a technique solves.
- **Facts are not invented.** Company facts come from the live site, the CRO
  record or the team. Never from inference.

---

## 8. Definition of done

A feature is done when all of the following are true:

1. The workflow in 1.2 was followed end to end, including a real browser
   inspection after the final fix.
2. `npm run build` passes, with zero TypeScript errors.
3. The browser console is clean in dev and in preview.
4. It resizes correctly, including a mobile viewport.
5. `prefers-reduced-motion` is honoured.
6. Frame budget is met on the target devices, measured not assumed.
7. Every new asset is listed in the asset spec with a licence.
8. Nothing on screen is undefensible under section 2.

---

## 9. Project documents

- `docs/heloria-brand-analysis.md`: analysis of the existing Heloria site, and
  what must stay, change or be reimagined.
- `docs/heloria-asset-spec.md`: every visual asset, with source, licence,
  production format and budget.
- `docs/zero-reference-analysis.md`: **not yet written.** Referenced by later
  steps. Until it exists, section 1.3 holds the recorded benchmark observations.
- `docs/heloria-experience-spec.md`: **not yet written.** The stage and
  narrative definition. The asset spec's stage assignments are provisional until
  this exists and the two are reconciled.

---

## 10. Current state

**Step 1 complete: project foundation only.**

A working Vite + TypeScript application that renders an empty Three.js scene (a
blank WebGL canvas), resizes correctly, handles context loss and tab visibility,
type-checks and builds clean.

Deliberately **not** built yet: website design, hero scene, 3D assets, shaders,
animations, navigation, sections, effects. Do not add any of these without an
explicit instruction to move to the next step.
