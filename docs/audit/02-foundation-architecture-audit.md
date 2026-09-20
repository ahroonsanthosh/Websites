# 02 Foundation architecture audit

**Audit only. No file was modified.**

Scope: everything under `src/`, the build configuration, and the actual
behaviour of the running application in a browser. Systems the project has
deliberately not reached are not treated as failures here; they are listed in
doc 10.

Benchmark context, from the published engineering article on Zero
(CONFIRMED, quoted in doc 11): Zero avoids native scroll entirely, drives
everything from one eased virtual value, splits the experience into nine
self-contained segments with `enter` / `scrub` / `update` / `teardown`, ships
Draco and KTX2 decoders from its own origin, and runs an adaptive quality
manager off a rolling frame-time buffer. Those are the shapes the foundation
will eventually have to accommodate, not things it is failing to have today.

---

## 1. What was run

```
npm run build     -> exit 0
npm run dev       -> serving on :5173
```

Build output, verbatim sizes:

```
dist/dev/hand-flower.html                     1.03 kB │ gzip   0.57 kB
dist/index.html                               1.05 kB │ gzip   0.53 kB
dist/assets/main-CEC24yNH.css                 0.30 kB │ gzip   0.23 kB
dist/assets/modulepreload-polyfill.js         0.77 kB │ gzip   0.44 kB
dist/assets/main-v6RL_s2O.js                  3.42 kB │ gzip   1.24 kB
dist/assets/devHandFlower-rPXBfZoL.js        49.11 kB │ gzip  15.10 kB
dist/assets/gsap-xgxdCp6f.js                 70.08 kB │ gzip  27.57 kB
dist/assets/three-D9yEXA1U.js               541.41 kB │ gzip 136.33 kB
```

Browser: headless Chromium via Playwright, `--use-gl=swiftshader`.

---

## 2. Measured behaviour

### Canvas, DPR and resize

| Profile | CSS size | Drawing buffer | `devicePixelRatio` | buffer / CSS |
| --- | --- | --- | --- | --- |
| desktop 1280x800 | 1280 x 800 | 1280 x 800 | 1 | 1.000 |
| iPhone 390x844 | 390 x 844 | 780 x 1688 | 3 | **2.000** |
| Android 412x915 | 412 x 915 | 824 x 1830 | 2.625 | **2.000** |
| iPad 768x1024 | 768 x 1024 | 1536 x 2048 | 2 | 2.000 |

The DPR clamp at 2 works exactly as written, including at the fractional 2.625
ratio. `setSize(w, h, false)` is used, so CSS owns layout and the renderer owns
only the buffer. No horizontal overflow at any width.

### Console and network

Clean on three consecutive hard refreshes: no errors, no warnings, no failed
requests, no WebGL messages. Page load 565 ms cold, then 190 ms and 181 ms.

### First paint

With the `three` chunk deliberately stalled for 2.5 s, the document already
paints `rgb(5, 7, 10)`, identical to the renderer's clear colour. In the
production build the stylesheet is a `<link>` in `<head>`, so this happens
before any script executes.

**Verdict: the first paint is engineered, not accidental.** The colour match is
deliberate, documented in `src/styles/main.css` and required by CLAUDE.md
section 7. What does not yet exist is anything *on* that first paint: no
pre-canvas content, no loading state, no progress. Against Zero, which paints a
seven-stop gradient plus a placeholder numeral on the first layout and hands
that over invisibly to the WebGL background pass, Heloria currently has the
continuity principle right and the content of the moment entirely unbuilt.

### Render loop and time

`App.tick` is a zero-argument callback added to `gsap.ticker`. It calls
`renderer.render(scene, camera)` and nothing else. There is exactly one clock
and no second `requestAnimationFrame` in the codebase, which is the rule
CLAUDE.md section 7 sets and it holds.

---

## 3. Problems

### F-01 Howler is a dependency that nothing imports

- **FILE/SYSTEM:** `package.json`, `src/`
- **CURRENT STATE:** `howler ^2.2.4` and `@types/howler` are installed. Zero
  imports in `src/`.
- **PROBLEM:** A declared runtime dependency with no consumer.
- **CONSEQUENCE:** None today; it is not bundled because nothing references it.
  It becomes misleading only if someone reads the manifest as a statement of
  what the app does.
- **SEVERITY:** Low
- **REQUIRED CHANGE:** None now. Leave it in place for the audio stage, which
  is the reason it was installed.

### F-02 No delta time is plumbed through the loop

- **FILE/SYSTEM:** `src/core/App.ts:104`
- **CURRENT STATE:** `private readonly tick = (): void => { this.renderer.render(...) }`
- **PROBLEM:** No elapsed time, no delta, no frame index reaches anything.
- **CONSEQUENCE:** Every future system that needs framerate-independent motion
  (virtual scroll easing, adaptive quality's rolling frame buffer, shader
  uniforms, audio synchronisation) will need this signature changed, and each
  will otherwise be tempted to call `performance.now()` for itself, which is how
  a single clock quietly becomes several.
- **SEVERITY:** Medium. It is cheap now and progressively more disruptive later.
- **REQUIRED CHANGE:** `gsap.ticker` already passes `(time, deltaTime, frame)`.
  Accept them in `tick` and forward them to an update list.
- **REMEDIATED (R6, 2026-09-20).** `App.tick` now takes the ticker's
  `(time, deltaMs)`, converts to seconds and clamps at
  `MAX_DELTA_SECONDS = 0.1`. Elapsed is accumulated from the clamped deltas, so
  it is always the sum of what systems were given. `app.delta`, `app.elapsed`
  and `app.frame` expose the values. Verified in a browser: deltas vary between
  frames, and a forced 350ms main-thread stall was charged as exactly 0.100s.

### F-03 No update registry: the loop renders but orchestrates nothing

- **FILE/SYSTEM:** `src/core/App.ts`
- **CURRENT STATE:** The tick renders directly. There is no list of updatable
  systems and no ordering between them.
- **PROBLEM:** The application has a render loop but no frame pipeline.
- **CONSEQUENCE:** This is the seam the stage system, the progression value and
  the post-processing chain all have to attach to. Without it each will attach
  itself to `gsap.ticker` independently, and the order in which progression,
  scene updates and rendering run each frame becomes incidental rather than
  specified. Zero's whole architecture depends on that order being explicit: one
  value updates, segments scrub from it, then the composer draws.
- **SEVERITY:** **High**, as the first thing the next phase will collide with.
- **REQUIRED CHANGE:** A minimal ordered update list on `App` with an explicit
  render step last, before any progression or stage code is written.
- **REMEDIATED (R6, 2026-09-20).** `src/core/UpdateRegistry.ts` adds
  `UpdateRegistry` (`register` / `unregister` / `update` / `clear`) and the
  `UpdateOrder` slots (Input 100, Animation 200, Scene 300, Post 400,
  Debug 900), which are positions in the frame, not systems. It is sorted on
  mutation and never per frame, ties break by registration sequence, and
  mutations made during iteration are deferred to the end of the frame.
  `App` owns one instance as `app.updates`; the frame is timing, then
  `updates.update(delta, elapsed)`, then an explicit `render()`.
  `App.dispose()` clears the registry.

### F-04 `toneMappingExposure` is set once by default and never treated as a value

- **FILE/SYSTEM:** `src/core/App.ts:41-48`
- **CURRENT STATE:** `outputColorSpace` and `ACESFilmicToneMapping` are set;
  exposure is left implicit at 1.0.
- **PROBLEM:** Exposure is a look control, and it is currently not a control at
  all. The dev harness independently sets `1.05`, so two entry points already
  disagree about the project's exposure.
- **CONSEQUENCE:** Lighting decisions made in Blender under a known exposure
  will not transfer predictably to the web build, and any later gate or
  transition that wants to ramp exposure has nowhere to ramp it from.
- **SEVERITY:** Medium
- **REQUIRED CHANGE:** Make exposure an explicit, single-sourced renderer
  setting, and record the chosen value alongside the Blender view transform.

### F-05 No disposal walker

- **FILE/SYSTEM:** `src/core/App.ts:79-93`
- **CURRENT STATE:** `dispose()` removes listeners, disposes the `Viewport`, and
  calls `renderer.dispose()`. Nothing traverses the scene.
- **PROBLEM:** Correct today because the production scene is empty, and
  incorrect the moment a stage adds geometry.
- **CONSEQUENCE:** Zero's segment contract ends in `teardown`, and the whole
  point of it is that leaving a stage frees its GPU memory. Without a disposal
  walker, the first `teardown` will be written ad hoc, and textures and render
  targets will accumulate across stage changes.
- **SEVERITY:** **High** before the second scene exists; harmless today.
- **REQUIRED CHANGE:** A `disposeObject(root)` utility that walks geometries,
  materials, their textures, and any render targets, written together with the
  stage lifecycle rather than after it.
- **REMEDIATED (R7, 2026-09-20).** `src/core/dispose.ts` adds `disposeObject`,
  `disposeGeometry`, `disposeMaterial`, `disposeTexture`, `disposeSkeleton` and
  `disposeRenderTarget`. Every entry point takes a `seen` set keyed on object
  identity, so a resource shared by several objects is disposed once per
  operation. Material textures come from an explicit 26-property list
  enumerated from the installed Three.js 0.180 sources, plus `ShaderMaterial`
  uniform values that identify as textures. Two traps found by reading that
  source are handled: `Sprite` shares one module-level geometry across every
  sprite, so sprite geometry is never disposed, and `BatchedMesh.dispose()`
  already frees its own geometry. Skeletons are disposed through
  `Skeleton.dispose()`, once per skeleton. The walker does not remove children,
  does not touch the renderer, and does not dispose `scene.background` or
  `scene.environment`, which are app-owned. `App.dispose()` calls
  `disposeObject(this.scene)` as the backstop for anything a stage leaves
  behind. Verified against the real hand/flower GLB: 6 skinned meshes sharing
  2 skeletons, load and dispose twice, with `renderer.info.memory` returning
  from 6 geometries and 8 textures to 0 and 0 on both cycles.

### F-06 No capability detection and no WebGL failure path

- **FILE/SYSTEM:** `src/main.ts`, `src/core/App.ts`
- **CURRENT STATE:** The renderer is constructed unconditionally. A failure to
  acquire a context throws, uncaught. `main.ts` throws on a missing canvas.
- **PROBLEM:** No fallback content and no capability query before the scene is
  built.
- **CONSEQUENCE:** On a device without WebGL 2, or with a blocked context, the
  visitor gets a black page and a console exception. Once mobile is a target,
  capability data (max texture size, available extensions, float filtering) also
  needs to be read before deciding what to load, not after.
- **SEVERITY:** Medium now, High once the site carries content.
- **REQUIRED CHANGE:** Guard renderer construction, expose the capability set
  from `App`, and render a plain DOM fallback carrying the company's actual
  content if the context cannot be created.
- **REMEDIATED (R15, 2026-09-20).** The requirement was read from the installed
  source rather than assumed: Three.js 0.180's `WebGLRenderer` requests exactly
  one context name, `'webgl2'`, with no WebGL 1 path, so **WebGL 2 is the
  minimum capability**, and it rethrows after logging, so construction failures
  are catchable. `src/core/webgl-support.ts` probes for WebGL 2 on a throwaway
  canvas before anything is constructed, releasing the probe context through
  `WEBGL_lose_context` so it does not cost the application a context slot.
  `src/main.ts` now boots in three guarded steps (canvas present, capability
  present, renderer constructs) because a driver can refuse the attributed
  context the renderer asks for after granting the bare one the probe asks for.
  Nothing is retried. `src/core/fatal.ts` is the reusable failure state: it
  reveals the page content, shows one plain-language sentence and hides the
  canvas. Technical detail is logged in development only, and the production
  bundle contains **zero `console.*` calls**, the branch having been eliminated
  by `import.meta.env.DEV`. Verified in a browser with WebGL genuinely disabled
  at the browser level, and separately with the attributed context refused:
  both reach the fallback with **no uncaught exception**.

### F-07 The canvas is `aria-hidden` with no accessible name

- **FILE/SYSTEM:** `index.html`
- **CURRENT STATE:** `<canvas id="webgl" aria-hidden="true">`
- **PROBLEM:** Correct while the canvas is blank; wrong as soon as it carries
  the experience.
- **CONSEQUENCE:** The entire experience becomes invisible to assistive
  technology, and the accessibility floor recorded in
  `docs/heloria-brand-analysis.md` section 11 as something that must be
  preserved would be broken by the current markup.
- **SEVERITY:** Low now, High at first content.
- **REQUIRED CHANGE:** Give the canvas a `role` and an `aria-label` when it
  starts carrying content, and plan the DOM text alternative alongside the
  scene rather than after it.
- **REMEDIATED (R15, 2026-09-20), with the opposite decision to the one this
  finding anticipated, and deliberately so.** The canvas keeps
  `aria-hidden="true"`, because it still draws nothing: naming an empty canvas
  would advertise content that does not exist. What was actually missing was
  the other half, the text alternative, and that is what was added. `index.html`
  now carries a `<main id="main">` with the company's real facts, always in the
  accessibility tree and visually offscreen while the experience carries them,
  so the page has accessible content rather than none. The canvas has no
  `tabindex` and is not focusable, so keyboard users cannot be trapped in it;
  tab order runs through the one real control and out. The trigger to revisit
  is unchanged: when the canvas starts carrying information with no HTML
  equivalent, it needs a role and a name, and the `<main>` becomes the visible
  alternative rather than the offscreen one.

### F-08 The dev harness is wired into the production build

- **FILE/SYSTEM:** `vite.config.ts`, `dev/hand-flower.html`, `src/dev/`
- **CURRENT STATE:** `rollupOptions.input` declares a second entry, so
  `npm run build` emits `dist/dev/hand-flower.html` and a 49.11 kB chunk.
- **PROBLEM:** A temporary development route ships in the production artefact.
- **CONSEQUENCE:** It is publicly reachable on any deploy of `dist/`, and it
  pulls `GLTFLoader` and `RoomEnvironment` into the build graph.
- **SEVERITY:** Medium
- **REQUIRED CHANGE:** Gate the second entry behind a mode check, or delete the
  harness when the real opening interaction replaces it. The file already
  documents itself as temporary.
- **REMEDIATED (R14, 2026-09-20).** The cause was confirmed before the fix and
  is narrower than "the harness is imported": nothing in `src/` references
  `src/dev/` at all. Naming `dev/hand-flower.html` in `rollupOptions.input` was
  itself the inclusion, because an entry drags its whole import graph into the
  build. The entry was removed rather than gated, so the harness is **absent
  from the production dependency graph** instead of being included and then
  eliminated. It stays fully available in development, since `vite dev` serves
  any HTML under the project root. Evidence: `dist/` contains no `dev/`
  directory and no `devHandFlower` chunk; searches across every emitted file
  including sourcemaps find no `hand-flower`, `__handFlower`, `RoomEnvironment`,
  `bloomProgress`, `src/dev` or `devHandFlower`; the one `GLTFLoader` hit is
  documentation text inside Three.js's own bundle, and the emitted JavaScript
  contains the identifier zero times. The `three` chunk fell from 541.41 kB to
  466.14 kB (136.33 kB to 116.62 kB gzip), which is the loader and environment
  code that had been shipping, and the Rollup chunk-size advisory (F-10) went
  with it.

### F-09 No resource hints beyond Vite's defaults

- **FILE/SYSTEM:** `index.html`
- **CURRENT STATE:** `modulepreload` for `gsap` and `three`, emitted by Vite.
  No `preconnect`, no `dns-prefetch`, no asset preload.
- **PROBLEM:** Nothing is hinted for the assets the experience will actually
  need first.
- **CONSEQUENCE:** Not measurable yet, because no asset is on the critical path
  of the production entry. It becomes real the moment the hand GLB is.
- **SEVERITY:** Low now
- **REQUIRED CHANGE:** Add hints when the first-frame asset set is decided, not
  before; hinting the wrong thing is worse than not hinting.
- **REMEDIATED IN PART (R9, 2026-09-20), and the baseline it shares with A-07
  is corrected.** Recorded here because R9 is a startup-delivery finding and
  this is the startup-delivery entry.

  **The 2,791 ms baseline did not measure what it was taken to measure.** It
  was recorded on `/dev/hand-flower.html`, not on the production entry, and it
  was time to *asset ready*, not time to first frame. The production entry
  loads no asset at all: a search of `src/main.ts` and `src/core/` finds no
  fetch, no loader and no asset reference. External instrumentation of a cold
  load then showed that even the dev harness already drew its first frame at
  about 148 ms, because it calls `setAnimationLoop` before the GLB resolves.
  What was actually true is that the first frame was an empty black scene with
  no progress reported, so it was indistinguishable from nothing.

  **The measured bottleneck**, decomposed on a cold context against the real
  3.52 MB asset: 0 to 239 ms modules, renderer and first frame; 239 to
  1,889 ms GLB transfer; 1,889 to 2,181 ms parse and decode; 2,181 to
  2,206 ms scene insertion. **Transfer is 1,646 ms of the 1,967 ms asset
  phase, about 84 per cent of it.** That is A-01 and A-06 (KTX2 and Draco),
  not a boot-order problem.

  **The change.** `src/core/timing.ts` records six milestones with
  `performance.mark` and builds `performance.measure` spans: boot start,
  renderer created, first frame, asset load start, asset load end, scene
  ready. Marks ship; reporting does not, and the production bundle contains
  **zero `console.*` calls**. `App.start()` now draws one frame synchronously
  before joining the ticker, rather than waiting a whole animation frame for
  the first callback, and `App.render()` marks the first frame after it
  returns, guarded by a boolean so the hot path pays one comparison.

  **Measured result.** Production build, cold: first paint 144 to 156 ms,
  renderer created 75 to 96 ms, **first WebGL frame 81 to 98 ms**. The gap
  between renderer creation and first frame fell from about 37 ms to 2.3 and
  5.6 ms. With the real asset, in the harness: **first frame 243.7 ms against
  scene ready 2,205.9 ms**, so the first frame precedes final readiness by
  about 1,962 ms, and the separation is now measurable rather than asserted.

  **Verified.** Typecheck and build clean; cold-context loads, not warm cache;
  one render loop in production (`gsap.ticker` only, zero `requestAnimationFrame`
  and zero `setAnimationLoop` in `App`); no uncaught errors; the built page
  still renders a single colour, so visual output is unchanged; the hand and
  flower still report identical bounds, anchor positions at every sampled
  point, six skinned meshes, six materials and the 150-track 6.25 s clip;
  R14 holds, with no dev chunk in `dist/`; R15 holds across all three failure
  paths.

  **Still open, and out of R9's scope:** the transfer itself. Until the asset
  is Draco-compressed and its textures are KTX2, the asset phase stays
  dominated by bytes on the wire.

### F-10 Chunk size advisory on `three`

- **FILE/SYSTEM:** build output
- **CURRENT STATE:** `three` is 541.41 kB raw, 136.33 kB gzip, in its own chunk.
- **PROBLEM:** Rollup advises splitting anything over 500 kB.
- **CONSEQUENCE:** None meaningful. Three.js is one library, already isolated by
  an explicit `manualChunks` entry so it caches independently, and 136 kB gzip
  is the expected cost of the stack this project deliberately chose.
- **SEVERITY:** Low. Recorded so it is not mistaken for a defect later.
- **REQUIRED CHANGE:** None. Revisit only if tree-shaking a narrower Three.js
  import surface becomes worthwhile.

---

## 4. What the foundation does well

Stated because an audit that only lists faults misrepresents the object.

- One clock, enforced, with no competing `requestAnimationFrame`.
- Sizing separated cleanly into measurement (`Viewport`) and application
  (`App.applySize`), with the DPR clamp verified at four device ratios including
  a fractional one.
- DPR changes are tracked by re-arming a `matchMedia` query, which is the
  correct mechanism and is rarer in practice than it should be.
- Context loss is prevented and recovered rather than ignored.
- The loop stops on a hidden tab.
- First-paint colour continuity is engineered and verified under a stalled
  bundle.
- Strict TypeScript with `noUncheckedIndexedAccess` and
  `exactOptionalPropertyTypes`, both clean.
- Every non-obvious decision in `App.ts` and `Viewport.ts` carries a comment
  explaining the failure it prevents, which is the discipline CLAUDE.md
  section 1.3 asks for.

---

## 5. Verdict

**READY TO BUILD ON**, with one qualification.

Nothing in the foundation is wrong. It is, however, *smaller than its next
task*: it is a correct renderer bootstrap, not yet an application frame. The
three items that should be settled before progression and stage code is written,
because they are cheap now and structural later, are F-03 (an ordered update
registry), F-02 (delta time through the loop) and F-05 (a disposal walker). None
of them is a repair; all three are the seams the next phase attaches to.

**Update, 2026-09-20: F-02 and F-03 are remediated under R6, F-05 under R7,
F-06, F-07 and F-08 under R14 and R15, and the startup-timing half of R9 under
F-09** (see the notes on each). All three seams the verdict named are in place,
and F-10 resolved itself when the dev harness left the build.

The remaining items are either genuinely low impact (F-01, F-09, F-10) or
correctly deferred until the canvas carries content (F-06, F-07).
