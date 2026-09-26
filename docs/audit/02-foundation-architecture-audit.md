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

- **REMEDIATED (R5, 2026-09-20), with a correction to the figure above.**

  **Correction first.** The 1,646 ms transfer recorded under R9 **does not
  reproduce**. Measured repeatedly on cold browser contexts, the same 3.6 MB
  file over localhost transfers in **19 to 26 ms**. The 1,646 ms was the Vite
  dev server's first-ever serve of that file, not a property of the asset. The
  claim that transfer was "about 84 per cent" of the asset phase rests on that
  single reading and should not be relied on. The decomposition's *shape* still
  holds; that one number does not.

  **Asset.** `public/models/heloria-hand-flower.glb` is 3,691,240 bytes;
  `heloria-hand-flower.draco.glb` is **1,511,988 bytes**, a **59.0 per cent**
  reduction. The two were compared field by field before switching: identical
  meshes, 6 primitives, 48,536 triangles, skins of 29 and 21 joints, the same
  6 materials, the same 6 WebP images, 56 nodes with identical names including
  `HeloriaFlowerAnchor`, 189 accessors, and one clip named `Animation` with
  150 channels, 150 samplers and a duration of exactly 6.25 s. The only
  difference is `KHR_draco_mesh_compression` in `extensionsUsed`.

  **Decoder.** The glTF-variant decoder from the installed package,
  `three@0.180.0` at `examples/jsm/libs/draco/gltf/`, copied verbatim to
  `public/vendor/draco/` and md5-verified against the source. Taking it from
  the installed package guarantees it matches the `DRACOLoader` driving it.
  Served from **`/vendor/draco/`**, never a CDN. At runtime a WebAssembly
  browser fetches `draco_wasm_wrapper.js` (57.4 KB) and `draco_decoder.wasm`
  (188.2 KB); the 512 KB asm.js build is kept only so a browser with
  WebAssembly disabled by policy gets a decoder rather than a 404.
  `src/core/gltf.ts` holds the configuration and preloads the decoder, so it
  transfers alongside the asset rather than after it.

  **Measured, and the result is not the expected one.** Three alternating
  rounds, fresh cold contexts, same machine and session:

  | | plain | draco |
  | --- | --- | --- |
  | GLB transferred | 3,605 KB | 1,476.8 KB |
  | GLB network, median | 22.7 ms | **13.0 ms** |
  | `loadAsync` total, median | **144.3 ms** | 212.6 ms |
  | to first render, median | **305.8 ms** | 410.9 ms |

  **Over localhost, Draco is about 68 ms slower end to end.** The transfer
  saving is roughly 10 ms because there is no real network to save, while
  Draco decoding costs real CPU. The byte reduction is the deterministic,
  environment-independent result; the wall-clock result on this machine is
  not a win and is not claimed as one.

  Break-even is where bytes saved divided by bandwidth exceeds decode cost:
  2.13 MB against roughly 68 ms of decode, so about **31 MB/s, near 250 Mbps**.
  Below that Draco wins, and every real mobile and most broadband connections
  are far below it. Localhost is the one environment where the compressed asset
  is the wrong choice. Decoding also runs in a worker, so it delays asset
  readiness without blocking the first frame or interactivity.

  **Verified.** Typecheck and build clean; the decoder is emitted to
  `dist/vendor/draco/` and served by the production preview with
  `application/wasm` on the binary; **zero external requests** of any kind;
  no 404s, no CORS errors, no uncaught exceptions; the compressed asset yields
  identical bounds (0.104 x 0.1369 x 0.1304), 6 skinned meshes, 2 skeletons,
  6 materials, 150 tracks at 6.25 s, and identical anchor positions at
  p 0, 0.25, 0.5, 0.75 and 1; R7 disposal releases it fully, memory returning
  from 6 geometries and 8 textures to 0 and 0 across two cycles; R14 holds,
  with no dev code and no `DRACOLoader` in the production bundle; R15 holds
  across all three failure paths.

  **Remaining limitation.** The textures are untouched and still WebP, so the
  526 KB that becomes roughly 51 MB of GPU memory (A-01) is unchanged. That is
  R4.

- **REMEDIATED (R4, 2026-09-20). KTX2 was investigated and found unnecessary.**

  **The memory model, measured not estimated.** Three.js on WebGL 2 allocates
  through `texStorage2D`, so instrumenting that call gives the real allocation
  including every mip level. The glTF sampler asks for
  `LINEAR_MIPMAP_LINEAR` (`minFilter` 9987), so a full chain is generated and
  mipmaps are genuinely required: the hand is seen at varying distances and
  minification without them aliases.

  | Texture | Before | Slot | Colour space | Alpha | GPU, level 0 | GPU, with mips |
  | --- | --- | --- | --- | --- | --- | --- |
  | `heloria_skin_basecolor` | 2048x2048 | SKIN baseColor | sRGB | unused | 16.00 MB | 21.33 MB |
  | `heloria_skin_roughness` | 2048x2048 | SKIN metallicRoughness | linear | unused | 16.00 MB | 21.33 MB |
  | `heloria_skin_normal` | 2048x2048 | SKIN normal | linear | unused | 16.00 MB | 21.33 MB |
  | `heloria_nail_basecolor` | 512x512 | NAIL baseColor | sRGB | unused | 1.00 MB | 1.33 MB |
  | `heloria_nail_roughness` | 512x512 | NAIL metallicRoughness | linear | unused | 1.00 MB | 1.33 MB |
  | `heloria_nail_normal` | 512x512 | NAIL normal | linear | unused | 1.00 MB | 1.33 MB |
  | **Total** | | | | | **51.00 MB** | **68.00 MB** |

  All six decode to four bytes per texel, so 538 KB of WebP on the wire became
  a measured **51.00 MB**, or **68.00 MB** once mipped. A-01's figure was right
  about level 0 and understated the real total by a third. The four flower
  materials carry no textures at all: their colour is a vertex attribute.

  **Root cause.** Not compression, and not the file format. Every map was baked
  at one resolution per object regardless of what it carries, and the maps come
  from procedural sources whose spatial frequency is low. Measuring detail only
  inside the UV islands, with the packing gutters excluded because averaging
  across an island edge produces a large error that says nothing about content:
  halving the skin base colour costs 2.93/255 RMSE, halving its roughness costs
  1.90/255, and the two normal maps have content in 0.1 and 0.4 per cent of
  their texels respectively. They are very nearly uniform.

  **Why not KTX2.** The brief's own preference is resizing where the
  measurement supports it, and it does. Resizing alone reaches single-digit
  megabytes, which is R4's stated target, with **no compression artefacts at
  all** on a hero skin texture, no transcoder to host, no GPU-format capability
  detection and no fallback path. KTX2 would take this further, to roughly
  1.8 MB, and remains available if a later budget demands it; it is not needed
  to meet R4.

  **Chosen resolutions**, set per map in `tools/export_glb.py` rather than by
  editing the GLB, so they are reproducible:

  | Texture | After | GPU with mips | Reason |
  | --- | --- | --- | --- |
  | `heloria_skin_basecolor` | 1024x1024 | 5.33 MB | carries the only detail a close-up shows, mottling and palm creases; halving costs 1.1% |
  | `heloria_skin_roughness` | 512x512 | 1.33 MB | one noise node mapped into 0.34 to 0.56, low frequency by construction |
  | `heloria_skin_normal` | 256x256 | 0.33 MB | 0.1% of texels carry content; kept so the faint relief survives, not for detail |
  | `heloria_nail_basecolor` | 512x512 | 1.33 MB | unchanged; highest relative detail of the six and already cheap |
  | `heloria_nail_roughness` | 256x256 | 0.33 MB | halving costs 0.84/255 |
  | `heloria_nail_normal` | 256x256 | 0.33 MB | 0.4% of texels carry content |
  | **Total** | | **9.00 MB** | |

  **Result, measured through `texStorage2D` on the same machine and lighting.**
  GPU memory **51.00 MB to 6.75 MB at level 0, 68.00 MB to 9.00 MB with mips,
  an 86.8 per cent reduction**. The calculated model and the measurement agree
  exactly. Texture bytes on the wire fell from 538,710 to 167,880, and the
  Draco GLB from 1,511,988 to **1,141,028 bytes**, 24.5 per cent smaller.
  Asset-ready in the harness moved from 2,421.5 ms to 1,863.1 ms, since there
  is less to decode.

  **Visual regression.** Four framings rendered from both assets under
  identical lighting and camera, compared per pixel over the model: open palm
  RMSE 1.77/255, closed hand 2.42, close skin 0.66, nails 2.07, with 0.2 to
  0.4 per cent of pixels differing by more than 8/255, those being silhouette
  edges where mip selection differs at grazing angles. Inspected directly as
  well as measured: the frames are indistinguishable. Colour-space semantics
  are unchanged and were verified on the loaded textures, base colour `srgb`
  and roughness and normal `linear` on both assets.

  **Verified.** Typecheck and build clean; identical bounds
  (0.104 x 0.1369 x 0.1304), 6 skinned meshes, 2 skeletons, 6 materials, 150
  tracks at 6.25 s, identical anchor positions at p 0, 0.25, 0.5, 0.75 and 1;
  no texture or decoder 404s; zero external requests; no CORS errors; no
  uncaught exceptions; R5 Draco loading intact; R7 disposal returns memory to
  baseline over two cycles; R14 and R15 both hold; one render loop; no change
  to the per-frame path.

  **Remaining limitation.** The uncompressed `heloria-hand-flower.glb` is still
  emitted alongside the Draco build and still ships in `dist/`. It is the
  reference copy, not loaded at runtime.

- **REMEDIATED (R12, 2026-09-20), with A-04's premise inverted by measurement.**

  **Correction first.** A-04 states that double-siding "is simply wrong" for
  the skin and nails because "a closed hand mesh has no visible backfaces", and
  that it "is correct and necessary" for the petals because a petal is a thin
  surface. Measured on the evaluated meshes, with modifiers applied, the
  opposite is true of both halves:

  | Material | Faces | Boundary edges | Inconsistent winding | Watertight |
  | --- | --- | --- | --- | --- |
  | `HELORIA_PETAL` | 3,250 | 0 | 0 | yes |
  | `HELORIA_SEPAL` | 1,250 | 0 | 0 | yes |
  | `HELORIA_CENTRE` | 2,208 | 0 | 0 | yes |
  | `HELORIA_STEM` | 112 | 0 | **20** | closed, mis-wound |
  | `HELORIA_SKIN` | 16,602 | **264** | 0 | no |
  | `HELORIA_NAIL` | 768 | **180** | 0 | no |

  The petals are not thin sheets in the exported asset. The Solidify modifier
  runs with `use_rim = True`, so each petal is a closed shell with a rimmed
  edge, and the same is true of the sepals and the receptacle. The hand is the
  open one. Its 264 boundary edges form six loops: one 84-edge loop at the
  forearm cut, which is simply uncapped, and five loops at the fingertips whose
  centres are identical to the nail shells' five loops. The nail beds are cut
  out of the skin and plugged by the nail sheets, so neither mesh is closed on
  its own even though the union nearly is.

  **Then pixels, because geometry alone does not say what the camera sees.**
  Each material was culled on its own and the asset rendered from a 160-point
  Fibonacci sphere at five bloom values, 800 renders per material, each
  compared against the same viewpoint rendered double-sided:

  | Material | Changed px across 52.4M | Worst single frame (of 65,536) |
  | --- | --- | --- |
  | `HELORIA_CENTRE` | 50 | 4 |
  | `HELORIA_STEM` | 42 | 2 |
  | `HELORIA_SEPAL` | 56 | 2 |
  | `HELORIA_PETAL` | 186 | 4 |
  | `HELORIA_NAIL` | 107 | 10 |
  | `HELORIA_SKIN` | **436,014** | **3,434** |

  The flower's four figures are silhouette antialiasing: isolated pixels on
  edge-on triangles, never adjacent. The skin's are not. Rendered at 640x640
  from below, culling the skin opens the forearm stump into a hole 21,468
  pixels across. The nail's ten worst pixels are a real sliver too, at the
  seam where the nail rim and the skin rim are coincident but not coplanar.

  **The decision, and why it is not the one A-04 predicted.** Cull exactly the
  surfaces that are watertight and correctly wound. `HELORIA_PETAL`,
  `HELORIA_SEPAL` and `HELORIA_CENTRE` become single-sided. `HELORIA_SKIN`,
  `HELORIA_NAIL` and `HELORIA_STEM` stay double-sided, each for a stated
  geometric reason rather than as a default. Making the skin single-sided would
  have traded fragment work on 16,602 faces for a visible hole, which is not a
  trade this asset can make while the camera envelope is undefined.

  **Two geometry defects, reported rather than masked.** A double-sided
  material is not a fix for either, and neither is repaired here because both
  are changes to geometry, which this pass does not make:

  1. **`HELORIA_STEM` is wound inside out.** All 50 source side quads face the
     axis rather than away from it. The bottom cap in
     `create_heloria_flower.build_stem` was reversed by hand with a `[::-1]`,
     which made the cap point outward while leaving it inconsistent with the
     sides; that inconsistency is the 20 edges in the table. Removing the
     `[::-1]` takes the count to 0 but leaves the whole tube inverted, so the
     correct repair is to flip the side quads and drop the reversal together.
     Until then the stem cannot be culled: it would lose its cap. Solidify runs
     with `offset = 0.0`, so the repair moves no surface and should cost no
     pixels, but that has to be verified by rebuilding the master, which is a
     mesh-generator change and a separate piece of work.
  2. **The hand's forearm is an open tube.** Capping the 84-edge loop is the
     prerequisite for culling the skin. It is a topology change.

  **Where the change lives.** `SIDEDNESS` in `tools/export_glb.py`, applied by
  `apply_sidedness()` against the opened master at export time. The `.blend` is
  not modified and the GLBs are not hand-edited, so re-running the export is
  all it takes to change a decision, and the table and the shipped asset cannot
  drift apart. The function raises if a material in the master has no recorded
  decision, so a newly added material cannot inherit Blender's default and ship
  double-sided unnoticed.

  **Verified after re-export, both GLBs.** glTF: six materials, `doubleSided`
  false on `HELORIA_PETAL`, `HELORIA_SEPAL` and `HELORIA_CENTRE`, true on the
  other three; `alphaMode` `OPAQUE` on all six, unchanged. In Three.js the same
  three load as `FrontSide` and the other three as `DoubleSide`. Everything
  else is byte-identical in structure: 3 meshes, 56 nodes, 6 skinned meshes, 2
  skeletons, 150 animation channels, 6.25 s, six WebP images at the R4 sizes
  (skin 1024/512/256, nail 512/256/256) with sRGB base colour and linear
  roughness and normal, R5 Draco intact. `HeloriaFlowerAnchor` sits at the same
  world position to six decimal places at p = 0, 0.25, 0.5, 0.75 and 1, and the
  scene bounds are identical at all five. Uncompressed GLB 3,320,408 to
  3,320,352 bytes, the 56 bytes being the three removed `doubleSided` keys;
  Draco 1,141,028 to 1,140,972.

  **Visual regression test.** The pre-R12 and post-R12 Draco assets were
  rendered side by side over the same 800 viewpoints: 267 differing pixels in
  52.4M, worst frame 5 of 65,536, all of them single silhouette pixels. No
  visible change, which is what "no visual change" has to mean if it is to mean
  anything.

  **One unrelated fix.** `dev/hand-flower.html` had no `<link rel="icon">`, so
  every load of the harness requested `/favicon.ico`, got a 404 and logged a
  console error, in the page whose job is to prove the console is clean.
  `index.html` already carried the empty `data:` icon; the harness now does
  too. `npm run build` passes, and dev, preview and the harness are all clean.

  **Recorded bounds discrepancy.** The scene bounds measure 0.1681 x 0.2302 x
  0.0709 m at rest, not the 0.104 x 0.1369 x 0.1304 recorded earlier. The two
  numbers come from different measurements, not different assets: the figure
  here is `Box3.setFromObject` over the whole loaded scene. What R12 needs is
  that the value is unchanged, and it is, at every sampled pose.


- **REMEDIATED (R8, 2026-09-20), with M-01 confirmed but demoted.**

  A-04's premise was inverted under R12. M-01's is not wrong, but it is not
  first either: the skin has no subsurface scattering, and it also had a
  roughness field that did not vary, normals that were flat, and a specular
  response 72% too strong. Three measurable defects, of which subsurface is
  the only one that cannot be fixed in this pipeline.

  **What shipped, measured inside eroded UV islands.**

  | | Before | After |
  | --- | --- | --- |
  | roughness mean | 0.4509 | 0.4465 |
  | roughness sd | **0.0125** | **0.0555** |
  | roughness p01..p99 | 0.4235..0.4784 (0.055) | 0.3333..0.5804 (0.247) |
  | roughness mean neighbour delta | 0.00489 | 0.01930 |
  | normal deviation from flat, mean | **0.475 deg** | **1.913 deg** |
  | normal deviation p90 / p99 | 0.716 / 2.560 | 3.374 / 5.205 |
  | base colour mean, sRGB | 0.5929 / 0.4697 / 0.4200 | 0.5931 / 0.4698 / 0.4202 |
  | runtime material | `MeshStandardMaterial` | `MeshPhysicalMaterial` |
  | ior | none, glTF implicit 1.5 | 1.40 |
  | specular factor | none, implicit 1.0 | 0.84 |
  | F0 at normal incidence | **0.0400** | **0.0233** |

  The base colour is untouched, to four decimal places on all three channels.

  **Cause 1: the roughness map was a constant.** The network was one noise
  mapped 0..1 into 0.34..0.56, which reads as a 0.22 spread and measured a
  standard deviation of 0.0125 on the baked map: the entire hand sat between
  about 0.44 and 0.46. One gloss level over a whole object is what a moulded
  object looks like, and this was the largest single contributor.

  The arithmetic behind it matters more than the numbers, because it is the
  same mistake twice. Blender's noise `Fac` does not span 0..1; recovered by
  inverting the shipped map it spans 0.380 to 0.629 with a standard deviation
  of 0.057. A Map Range reading 0..1 therefore delivers about a quarter of the
  amplitude it appears to ask for. The first attempt at this remediation hit
  the same wall from the other side: `Pointiness` was mapped from an assumed
  0.42..0.58, and a diagnostic bake of the raw socket showed it actually
  occupies 0.482 to 0.533 on this mesh, a band five hundredths wide, because a
  smooth organic mesh has no sharp edges. Both ranges are now measured and
  recorded as constants.

  Roughness is now driven by two signals: `Pointiness`, mapped 0.482..0.533
  into 0.56..0.38 so that convex ridges (knuckles, tendons) are drier and take
  a tighter highlight while concave folds scatter more widely, and a 3.3 mm
  noise at plus or minus 0.09 so neighbouring patches of equal convexity are
  not identical. Clamped to 0.28..0.70. Pointiness is the only anatomy-aware
  input available without painting a map, and without it the field is noise
  that happens to be sitting on a hand.

  **Cause 2: the normal map was flat because its features were too fine, not
  too weak.** The bump ran voronoi at scale 95 and noise at 210. Object
  coordinates are centimetres, so those are periods of 0.105 mm and 0.048 mm.
  The object is 16.77 x 5.40 x 22.95 cm with 497 cm2 of evaluated surface and
  UV islands covering 68.2% of each map, which puts one texel at:

      normal    256^2   1.055 mm
      roughness 512^2   0.527 mm
      basecolor 1024^2  0.264 mm

  The authored detail was ten to twenty times finer than the normal map can
  represent. The bake averaged it away, and raising the strength would only
  have produced louder aliasing. The features are now 4.55 mm (voronoi) and
  9.1 mm (noise), both above the roughly 4.2 mm floor that four texels per
  period implies, and the strength was raised from 0.10/0.008 to 0.55/0.085
  to suit.

  This was tuned against measurement, in three passes, not by eye. The first
  full export measured 4.330 degrees of mean deviation and rendered visibly
  blotchy: the 9.1 mm component was too heavily weighted and the pointiness
  span too wide, so the hand read as rough rather than as skin. Strength went
  0.90 to 0.55, distance 0.140 to 0.085, the broad component's weight 0.45 to
  0.30, and the pointiness span 0.26 to 0.18.

  **Cause 3: the bake was discarding the authored specular response.**
  `bake_object` ends by replacing the procedural network with a fresh
  Principled wired to the three baked maps. That is right for what glTF
  carries as textures and it silently reset everything else, including the
  author's IOR 1.40 and Specular IOR Level 0.42.

  The consequence is larger than it sounds, because Blender's exporter only
  writes `KHR_materials_ior` when transmission, volume or specular is also
  written, and only writes `KHR_materials_specular` when the specular level is
  not the neutral 0.5 (`ior.py` and `specular.py` in the installed 4.5
  exporter). A material sitting at defaults emits neither, so the runtime fell
  back to glTF's implicit IOR of 1.5 and the skin shipped at F0 = 0.040 where
  a dielectric at IOR 1.40 is 0.0278 and the author's specular level takes it
  to 0.0233. It was reflecting 72% more light at its highlights than the
  material it was supposed to be. Structurally it also meant Three.js
  instantiated `MeshStandardMaterial`, which has no `ior`, `specularIntensity`
  or `sheen` at all.

  `BAKED_MATERIAL_PARAMS` in `tools/export_glb.py` now restores them, and the
  material definition itself is re-applied to the opened master from
  `build_hand_flower.make_skin_material` at export time, so editing the
  definition and re-running the export is the whole loop: nothing is hand
  edited and the `.blend` does not have to be regenerated to pick up a change.

  **Cause 4: no subsurface, and it stays that way.** There is no ratified glTF
  subsurface extension. The installed Three.js 0.180 `GLTFLoader` parses ior,
  specular, sheen, transmission, volume, clearcoat, anisotropy, iridescence,
  dispersion and `EXT_materials_bump`; the Blender 4.5 exporter writes ior,
  specular, sheen, transmission, volume, clearcoat and anisotropy. The
  intersection contains no way to express subsurface scattering, so the
  authored Subsurface Weight 0.22, radius (1.0, 0.32, 0.20), scale 0.35 has no
  representation and none was invented.

  `KHR_materials_transmission` plus `KHR_materials_volume` was the one
  candidate and was rejected on two grounds, both specific rather than
  aesthetic. The skin mesh is open at the forearm and at five nail beds (R12),
  and a thickness-driven volume needs a closed surface for thickness to mean
  anything. And Three.js implements transmission with an extra full-scene
  render into a transmission target, which is an architectural cost R8 was not
  asked to take.

  **Sheen was tested and rejected.** `KHR_materials_sheen` is supported at
  both ends and is a real lobe rather than an invented parameter, so it was
  measured rather than assumed: at 0.25 weight, 0.35 roughness and a warm
  tint, over 63 renders it moved local gradient energy from +1.3% to +2.2%,
  but raised peak luminance under the neutral dome by 1.6% and peak overall by
  0.5%. It brightens the rim rather than restraining the highlight, which is
  the opposite of what was wanted. No clearcoat, no anisotropy and no
  iridescence: none of them has a demonstrated reason on skin.

  **Comparison methodology.** 63 renders per material, at identical geometry,
  camera, environment, exposure (1.05) and resolution (288 square): seven
  viewpoints (palm, back, knuckles, fingertips, grazing, low angle, close up)
  at three bloom positions (0, 0.5, 1) under three lighting rigs. The rigs are
  the point: the production pair of directionals over `RoomEnvironment`, a
  featureless grey dome with no directional content at all, and a single hard
  key with no environment. Nothing was tuned per rig.

  Pixel RMSE is not the measure. The two that are: local gradient energy
  inside the subject mask, which says how much surface structure survives, and
  the luminance percentiles plus blown-highlight fraction, which say how
  restrained the highlight is.

  | | before | after |
  | --- | --- | --- |
  | detail, production rig | 0.00656 | 0.00680 (+3.7%) |
  | detail, neutral dome | 0.00441 | 0.00445 (+1.0%) |
  | detail, single key | 0.00957 | 0.00955 (-0.2%) |
  | p99 luminance, all rigs | 0.70151 | 0.68907 (-1.8%) |
  | blown-highlight fraction | 0.01372 | 0.01363 (-0.7%) |
  | mean luminance | 0.46497 | 0.45758 (-1.6%) |

  Local gradient energy rose in all seven viewpoints (+2.5% to +5.1%) and at
  all three bloom positions (+3.3% to +4.0%), so the gain is not one lucky
  frame. Mean luminance moving 1.6% is the appearance being preserved rather
  than restyled.

  **An honest note on the parameter half.** Before the textures were touched,
  the ior and specular restoration was measured on its own over the same 252
  renders. It is correct and it is small: peak luminance -0.7% under the
  production rig and -4.1% under the single key, blown-highlight fraction
  -8.0%, and local gradient energy unmoved. At roughness 0.45 under strong
  image-based lighting the specular term is a small part of total radiance, so
  a 42% cut in F0 is under 2% of luminance. The parameters had to be restored
  because the asset was misrepresenting its own material, but they are not
  what made the hand look like vinyl. The absence of surface structure was.

  **Verification, against the pre-R8 asset loaded side by side.** Geometry
  identical: 53,305 vertices, 145,608 indices, 3 meshes, 56 nodes, 6
  primitives. Animation identical: 150 channels, 150 samplers, 6.25 s. Bounds
  identical at all five sampled poses, 0.104 x 0.1369 x 0.1304, which also
  reconciles the figure R12 could not reproduce; that measurement was taken
  before any mixer update and this one after, and the recorded value is the
  posed one. `HeloriaFlowerAnchor` identical to six decimal places at p = 0,
  0.25, 0.5, 0.75 and 1. Six materials, no more and no fewer. R4 texture sizes
  and colour spaces unchanged: skin 1024/512/256 and nail 512/256/256, sRGB
  base colour, linear roughness and normal. R5 intact: `KHR_draco_mesh_compression`
  and `EXT_texture_webp` both still required, the decoder still served from
  `/vendor/draco/`, no external request from any page. R12 intact: petal,
  sepal and centre single-sided, stem, skin and nail double-sided. R7 intact:
  6 geometries, 8 textures and 4 programs return to zero through the disposal
  walker. R14 intact: no dev code in `dist/`. Typecheck, build, dev, dev
  harness, preview and a cold-cache preview are all clean, with no console
  error or warning anywhere and no uncaught exception. No file under `src/`
  changed, so the frame loop and its allocation behaviour are untouched by
  construction.

  Draco GLB 1,140,972 to 1,177,436 bytes (+3.2%), uncompressed 3,320,352 to
  3,356,796. The growth is the roughness and normal maps now carrying
  information, which WebP cannot compress as hard as it compressed a constant.

  **Remaining limitations.**

  1. **No subsurface.** No warm shadow terminator, no edge translucency
     through the fingers. Not representable in this pipeline, as above. This
     keeps M-01 open, not closed.
  2. **Pore-scale detail is unrepresentable at 256 square.** Pores are 0.1 to
     0.3 mm against a 1.055 mm texel. The normal map carries mesoscale relief
     only, by design. R4's 256 square stands, but its reasoning does not: it
     was chosen because the map was empty, and it is kept because the content
     is deliberately mesoscale and four texels per period fit.
  3. **WebP softens the relief.** The bake measures 2.719 degrees of mean
     deviation and the shipped map 1.913, the difference being quality 88.
  4. **A featureless environment shows almost none of this** (+1.0%). Nothing
     is wrong: a perfectly uniform dome supplies no directional light for
     structure to reveal. It is recorded so the +3.7% is not mistaken for a
     universal figure.
  5. **`MeshPhysicalMaterial` is the more expensive shader.** Program count
     after the first render goes from 3 to 4. Not measured as a frame cost,
     because the scene is one hand.
  6. **The nail material has the same defect, unfixed.** Its authored coat
     (0.35) and subsurface (0.28) are discarded by the same bake reset. It is
     absent from `BAKED_MATERIAL_PARAMS` deliberately: changing the nails is
     outside what R8 was asked to do.
  7. **Palm creases still read as drawn lines** (M-04). They live in the base
     colour, which R8 did not touch, and fixing them means geometry or a
     painted map.


- **REMEDIATED (R3, 2026-09-26). Contact ambient occlusion, chosen over a
  shadow map on measurement.**

  **The defect, and where it actually is.** M-05 and doc 09 observation 20
  record that nothing darkens where the flower meets the palm, and call it the
  largest single reason the two do not read as touching. Before choosing a
  technique the contact itself was measured, on the skinned vertices in world
  space, per material, at five bloom values, as the minimum distance from each
  flower vertex to the hand surface:

  | Material | p = 0 | 0.25 | 0.5 | 0.75 | 1 | within 2 mm at p = 0 |
  | --- | --- | --- | --- | --- | --- | --- |
  | `HELORIA_SEPAL` | 0.28 mm | 0.18 | 1.10 | 1.96 | 1.96 | 88 vertices |
  | `HELORIA_PETAL` | 0.15 mm | 0.27 | 9.39 | 10.78 | 8.36 | 147 vertices |
  | `HELORIA_STEM` | 5.44 mm | 5.47 | 5.98 | 6.16 | 6.16 | 0 |
  | `HELORIA_CENTRE` | 6.96 mm | 7.07 | 9.22 | 10.49 | 10.49 | 0 |

  Two contacts, not one. The sepals against the palm are the contact that
  persists through the whole clip. The petal tips against the fingers are a
  second, real contact that exists only while the hand is closed and is gone by
  half bloom. The stem never touches anything, which the audit's "resting on
  the palm" phrasing implies it does. Anything keyed to one pose would have got
  this wrong in both directions.

  **Why nothing was visible.** The scene is lit almost entirely by an
  environment map, and image-based lighting assumes every point sees the whole
  hemisphere. Two surfaces a fraction of a millimetre apart were each lit as if
  the other were not there. The missing term is ambient occlusion, so that is
  what was added, rather than a shadow that would have said where the key light
  is rather than where the flower touches.

  **How the choice was made.** Both candidates were implemented and measured
  over 35 frames, five bloom values across seven camera angles, each against
  the same frame with no effect. The measurement splits the hand's pixels by
  geometry rather than by eye: masks are rendered from the meshes themselves,
  the flower mask is dilated, and hand pixels within 14 px of the flower's
  silhouette are the contact band while those beyond 42 px are the far field. A
  technique that solves the stated problem darkens the first and leaves the
  second alone.

  | Technique | contact band | far field | worst angle, far field | passes | targets | draw calls |
  | --- | --- | --- | --- | --- | --- | --- |
  | Shadow map, PCFSoft 2048 | 0.00981 | **0.00601** | **0.03368** | 2 | 1 | 12 |
  | SSAO, kernel 16 | 0.00698 | -0.00063 | 0.01010 | 4 | 4 | 16 |
  | **GTAO, radius 8 mm** | **0.01151** | **-0.00181** | **0.00492** | 4 | 5 | 17 |

  The shadow map darkens the far field by 61% of what it darkens the contact
  band, and by 0.034 at its worst angle: a cast shadow sweeping the whole hand.
  The render confirms it as a soft dark blob thrown clear of the flower onto
  open palm, which is precisely the "dark blob" outcome to avoid, and it would
  have meant designing the lighting around the shadow. Rejected. SSAO reaches
  61% of GTAO's contact darkening with twice its worst-angle far-field
  artefact. Rejected. GTAO's far field goes very slightly *brighter*, and that
  residue is not the occlusion: a composer with no AO pass at all measures
  -0.00206 in the same place.

  **Parameters, from the scene rather than from the defaults.**

  | Parameter | Value | Why |
  | --- | --- | --- |
  | `radius` | 0.008 m | Contacts are 0.15 to 2 mm, the palm hollow 30 to 40 mm. 0.012 measured within 3%, 0.020 slightly worse on both axes. GTAO's own default is 0.25, which on a 104 x 137 x 130 mm asset occludes the whole hand against itself. |
  | `thickness` | 0.01 m | How far behind a surface a sample still occludes. The default is 1.0 world unit, so the far side of the palm would occlude the near side. |
  | `distanceExponent` | 1 | Linear. Every contact here is within a few millimetres; there is nothing for a curve to shape. |
  | `samples` | 16 | Three's default, with the Poisson denoise that follows it. |
  | `blendIntensity` | 1 | 0.6 was measured and halves the contact darkening to 0.00468, which is too weak to read. |
  | intermediate target | RGBA16F, 4x MSAA | A composer bypasses the canvas's own multisampling. Without this the effect would have arrived together with aliased silhouettes. |

  **One unintended change, found and fixed.** Adding a composer moves where
  tone mapping happens. Rendering straight to the canvas, Three tone maps on
  the way out and never touches the clear colour; rendering through a composer,
  the clear lands in a linear target and `OutputPass` tone maps it along with
  everything else. Measured, this lifted the background from (5, 7, 10) to
  (22, 30, 41): the whole frame changed for an effect meant to touch one
  contact region. The scene pass now clears to transparent black and the page's
  own background supplies the colour, which needs the canvas context to carry
  an alpha channel, so `App` creates it with `alpha: true`. Tone mapping zero
  gives zero. Verified: the production page measures (5, 7, 10) at three
  sampled pixels, unchanged, and the CSS variable that CLAUDE.md ties the clear
  colour to is untouched.

  **Where it lives.** `src/core/RenderPipeline.ts` owns the composer and every
  pass. `App` gains one seam, `setRenderPipeline(pipeline | null)`, and its
  render step becomes "use the pipeline if one is installed, otherwise draw
  directly". Null is the default and the production scene is still empty, so
  production runs exactly the render it ran before: a composer over an empty
  scene is three passes of nothing. The dev harness, which owns the only scene
  that exists, installs one; `?ao=0` turns it off for an A/B. The seam costs
  0.28 kB in the production bundle (9.30 to 9.58 kB) and the pass machinery is
  not bundled at all, because `App` imports only the type.

  The draw is still the last step and `UpdateRegistry` is untouched. No render
  loop was added or changed: production still runs the one `gsap.ticker`
  callback, and the dev harness still runs the one `setAnimationLoop` it had
  before, which is pre-existing and dev-only. Each page has exactly one.

  **Disposal, verified rather than assumed.** `EffectComposer.dispose()` frees
  its two targets and its internal copy pass and nothing else: passes handed to
  `addPass` are not its business. Each is therefore disposed by name.

  | | geometries | textures | programs |
  | --- | --- | --- | --- |
  | before the pipeline | 13 | 6 | 5 |
  | pipeline alive | 14 | 14 | 12 |
  | after two resizes | 14 | 14 | 12 |
  | after `dispose()` | 13 | 6 | 8 |
  | after five create/dispose cycles | 13 | 6 | 8 |

  Geometries and textures return exactly to their pre-pipeline counts, the
  counts do not move across two resizes, and five consecutive create, render
  and dispose cycles leave them identical, which is the test a single cycle
  cannot pass on its own. Programs settle at 8 rather than 5 because Three's
  program cache retains the fullscreen-quad programs; it is stable across
  cycles, so it is a cache and not a leak. `App.dispose()` disposes whatever
  pipeline is installed, and `setRenderPipeline` disposes the one it replaces.

  **Stability under animation.** The effect is derived from the rendered depth
  and normals, so it follows the skinned geometry with no pose-specific setup
  and no world coordinates anywhere. Measured by stepping the bloom value in
  0.005 increments and comparing consecutive frames:

  | View | effect off | effect on |
  | --- | --- | --- |
  | contact close-up, mean frame-to-frame delta | 0.028309 | 0.028971 |
  | contact close-up, worst | 0.12522 | 0.128503 |
  | three-quarter, mean | 0.026031 | 0.026128 |
  | three-quarter, worst | 0.029719 | 0.029857 |

  Within 2.6% of the scene's own frame-to-frame change at the worst of it. No
  flicker, no crawl.

  **Result, across the matrix.** Thirty frames, five bloom values by six camera
  angles, the shipped module against no pipeline, identical camera, lighting,
  exposure, animation state and resolution. Contact-band darkening ranges
  0.00177 to 0.01942 with a peak local drop of 0.84; far-field darkening ranges
  0.00005 to 0.00407. At the contact close-up the ratio between the two is
  between 40 and 230 to one. Between 0.89% and 9.88% of pixels change.

  The one row that looks weak is the three-quarter view at p = 0 and p = 0.25
  (contact 0.00199 and 0.00177, far field 0.00368 and 0.00407). That is not a
  failure: at those bloom values the hand is closed and the flower is inside
  the fist, so the band around its silhouette is mostly occluded, and what the
  occlusion is darkening there is between the fingers, which this mask counts
  as far field. It is the effect working on a contact the mask was not built to
  measure.

  Visually, at the contact view the flower stops being a bright cutout laid on
  skin: the overlapping petals gain depth against each other, the sepals darken
  where they meet the palm, and the far palm is unchanged.

  **Cost.**

  | Metric | Before | After |
  | --- | --- | --- |
  | Render passes | 1 | 4: scene, depth/normal, occlusion + denoise, output |
  | Draw calls per frame | 6 | 17 |
  | Triangles submitted per frame | 48,536 | 97,077 (the scene is drawn twice, once for the normal buffer) |
  | Render targets | 0 | 5 |
  | Textures held (`renderer.info`) | 6 | 14 |
  | GPU memory for targets, 800x600 | 0 | 42.1 MB, or 92 bytes per viewport pixel |
  | First WebGL frame, dev harness at 900x700 | 2282 ms | 2831 ms |
  | Asset-ready, dev harness | 2595 ms | 3097 ms |
  | Production bundle | 9.30 kB | 9.58 kB |
  | Production first frame and asset timing | unchanged | unchanged, no pipeline installed |

  The +549 ms on the harness's first frame is shader compilation for the three
  new programs, under a software rasteriser, before the asset has arrived. It
  is not a steady-state cost and it is not paid in production.

  **Frame time could not be measured reliably** and is deliberately absent
  above. `performance.now()` around `render()` measures command submission
  only, and returned sub-millisecond figures that had the shadow map faster
  than no shadow map. `gl.finish()` did not fix it. `EXT_disjoint_timer_query_webgl2`
  is present and gave self-consistent figures at 420 square (369 ms baseline,
  661 ms with the pass, +78%), but this is SwiftShader: those are a software
  rasteriser's milliseconds, useful only as ratios between rows measured the
  same way, and they cannot stand in for a GPU. An attempt to measure the same
  thing at 1000 square did not complete. There is no real hardware in this
  environment; this needs measuring on a device before any performance claim
  is made.

  **Memory, measured by instrumenting `texStorage2D`, `texImage2D` and
  `renderbufferStorageMultisample` at 800x600.** Computed sizes are a guess
  about formats; these are what the driver was asked for.

  | samples | AO scale | added | of which MSAA | bytes per viewport pixel |
  | --- | --- | --- | --- | --- |
  | 4 | 1.0 | 64.1 MB | 43.9 MB | 140 |
  | 4 | 0.5 | 54.5 MB | 43.9 MB | 119 |
  | **2** | **1.0** | **42.1 MB** | **22.0 MB** | **92** |
  | 2 | 0.5 | 32.5 MB | 22.0 MB | 71 |
  | 0 | 1.0 | 20.2 MB | 0.0 MB | 44 |

  Most of the cost is multisampling, not occlusion: the three occlusion targets
  together are under 11 MB of it. That inverts the usual assumption, and it is
  why the resolution strategy here is the opposite of the obvious one.

  - **`samples` 2, not 4.** 4 costs 22 MB more and buys nothing visible: at 2x
    magnification on the silhouette the two are indistinguishable, while 0
    stair-steps plainly. Contact darkening is 0.01263 against 0.01265.
  - **Occlusion at full resolution, not half.** Half saves 9.6 MB and costs 11%
    of the contact darkening (0.01265 down to 0.01121), which is the one thing
    this pass exists to produce. It does not add noise; it loses definition,
    with high-frequency content in the band falling from 0.02613 to 0.01926. An
    earlier measurement at a 12 mm radius found the two identical; they are not
    identical at the 8 mm radius shipped, because a tighter radius has finer
    detail to lose.

  At the defaults this is roughly 119 MB of render targets at 1440x900. That is
  the number to bring to any decision about mobile, and `samples` is the lever.

  **Three measurements were wrong before they were right**, recorded so the
  figures above are read with the right confidence. Draw calls and triangles
  were first read after the frame, but `info.reset()` runs at the top of every
  `renderer.render()` and a composer frame calls it more than once, so composer
  rows reported 1 draw call and 1 triangle. The contact-band figures were first
  computed against masks rendered with an opaque clear, so every mask was the
  whole frame and the "contact band" was a whole-frame average. And the GPU
  timer query returned null for every mode until the polling loop was made to
  yield, because a synchronous spin never lets the work it is waiting on
  finish. A silhouette-aliasing metric was also attempted and is not reported:
  it scored no multisampling *better* than 4x, so it was measuring the
  occlusion's own edge darkening rather than coverage, and the MSAA decision
  was made from the rendered crops instead.

  **Remaining limitations.**

  1. **No hardware measurement.** Everything above is SwiftShader. Frame cost
     and mobile behaviour are both unverified on a real GPU, and the brief's
     mobile question cannot be answered from here.
  2. **119 MB of render targets at 1440x900.** Acceptable for a desktop scene
     of this size and almost certainly not acceptable on a phone. The levers
     are measured and recorded; the decision needs a device.
  3. **`GTAOPass` allocates one closure per frame** in `_overrideVisibility`,
     which also traverses the scene graph looking for points and lines that are
     not there. That is library code, and removing it would mean forking the
     pass. Nothing in `RenderPipeline` itself allocates per frame.
  4. **The canvas keeps its own `antialias: true`.** With a pipeline installed
     that multisampling is wasted, because the last thing drawn to the default
     framebuffer is a fullscreen quad with no edges to resolve. Context
     attributes are fixed at creation and production still needs it while no
     pipeline is installed, so it stays.
  5. **Production does not use this yet**, because production has no scene. The
     capability, its disposal and its cost are in place behind an explicit seam;
     what installs it is the stage work, which R3 was not asked to do.

- **REMEDIATED (R13, 2026-09-26). Five named actions in the master; the web
  asset byte-for-byte unchanged.**

  **The failure, confirmed against the file rather than the filenames.**
  Enumerating `bpy.data.actions` in the committed master found two:

  | Action | F-curves | Frames | Users | Fake user | Assigned to |
  | --- | --- | --- | --- | --- | --- |
  | `HELORIA_HAND_REVEAL` | 51 | 1..150 | 1 | no | `Heloria_Hand_Rig` |
  | `HELORIA_FLOWER_BLOOM_SYNC` | 117 | 1..150 | 1 | no | `Heloria_Flower_Rig` |

  `HELORIA_HAND_CLOSED`, `HELORIA_HAND_OPEN` and `HELORIA_FLOWER_BLOOM` were
  absent. All five are created procedurally: `key_hand` in
  `build_hand_flower.py` builds the first three, `create_bloom_action` in
  `create_heloria_flower.py` builds `HELORIA_FLOWER_BLOOM`, and the retimed
  `HELORIA_FLOWER_BLOOM_SYNC` is built inline. None exists only during export;
  the export opens the master and assigns by name.

  The mechanism is assignment order. Every one of those functions ends with
  `rig.animation_data.action = act`, so each new action displaces the previous
  one, which drops to zero users. Blender does not write zero-user datablocks,
  so only whichever action happened to be assigned last survived: `REVEAL` for
  the hand, `BLOOM_SYNC` for the flower. Nothing reported it, because a
  zero-user action is simply not in the saved file.

  **The fix.** `use_fake_user = True` at the point each action is created, in
  all three places, plus a `PERSISTED_ACTIONS` tuple and a
  `verify_persisted_actions()` check that runs before the master is written and
  fails the build if any of the five is missing or would not survive. The fake
  user is set on all five rather than only the three that were orphaned, so
  persistence no longer depends on assignment order or on which action happens
  to be active at save time.

  **The rebuild reproduces the master exactly.** Before changing anything, the
  unmodified build was run to a temporary path and fingerprinted against the
  committed master: object names, types, parents, local matrices, modifiers,
  material slots, vertex-group counts, mesh vertex and polygon counts, hashed
  vertex coordinates, armature bone counts and hashed bone rests, pose
  constraints and influences, every action's per-F-curve data path, array
  index, keyframe count and hashed keyframe values, and the scene frame range.
  Identical on every field. Regenerating the master was therefore safe, and any
  later difference is attributable to the change rather than to build drift.

  **Save, reopen, enumerate.** The fixed build was saved and the file reopened
  from disk:

  | Action | F-curves | Frames | Users | Fake user | Assigned to |
  | --- | --- | --- | --- | --- | --- |
  | `HELORIA_HAND_CLOSED` | 51 | 1..1 | 1 | yes | (library) |
  | `HELORIA_HAND_OPEN` | 51 | 1..1 | 1 | yes | (library) |
  | `HELORIA_HAND_REVEAL` | 51 | 1..150 | 2 | yes | `Heloria_Hand_Rig` |
  | `HELORIA_FLOWER_BLOOM` | 117 | 1..115 | 1 | yes | (library) |
  | `HELORIA_FLOWER_BLOOM_SYNC` | 117 | 1..150 | 2 | yes | `Heloria_Flower_Rig` |

  Fingerprinted against the committed master, the *only* differences are the
  three added actions and the two `use_fake_user` flags with their user counts.
  Every other field is identical, including the `curveHash` of both exported
  actions, so the animation the web asset is built from is untouched.

  **The pose library is usable, not merely present.** Each pose action was
  applied to the rig and its bone rotations compared against `REVEAL` evaluated
  at its own first and last frame:

  - `HELORIA_HAND_CLOSED` against `REVEAL` at frame 1: 21 bones, max delta
    **0.00000000 rad**.
  - `HELORIA_HAND_OPEN` against `REVEAL` at frame 150: 21 bones, max delta
    **0.00000000 rad**.
  - `CLOSED` against `OPEN`: max delta 1.2566 rad, so they are genuinely two
    different poses and not the same one twice.
  - `HELORIA_FLOWER_BLOOM` first frame against `BLOOM_SYNC` first frame: 29
    bones, max delta 0.00000000 rad. Their last frames differ by 0.00446 rad,
    which is the retiming: `BLOOM` runs 1..115 in its own timing and
    `BLOOM_SYNC` is resampled onto 1..150 so the flower lags the hand, so the
    two endpoints come off different key layouts. A quarter of a degree on one
    petal, and expected.

  **Export.** `tools/export_glb.py` already chose by name rather than by
  whatever was active, which is why the web asset was never affected by this
  defect. It now reads those names from an `EXPORTED_ACTIONS` table, fails with
  a message naming `PERSISTED_ACTIONS` instead of a bare `KeyError` if one is
  absent, and prints what it assigned. `export_animation_mode="ACTIVE_ACTIONS"`
  exports only the assigned actions, so the three pose actions are in the
  master for authoring and absent from the GLB.

  **Regression: both GLBs are byte-for-byte identical to the pre-R13 exports**
  (SHA-256 match, 3,356,796 and 1,177,436 bytes). That is the whole regression
  argument; the runtime checks below merely confirm it.

  One animation, 150 tracks, duration exactly 6.25 s. 53,305 vertices, 145,608
  indices, 6 skinned meshes, 2 skeletons, 6 materials. R4 sizes and colour
  spaces (skin 1024/512/256, sRGB base colour, linear roughness and normal).
  R8's skin still `MeshPhysicalMaterial` at ior 1.40 and specular 0.84. R12
  sidedness: petal, sepal and centre single-sided, stem, skin and nail
  double-sided. R5 Draco and the self-hosted decoder, 7 requests, all local.
  `HeloriaFlowerAnchor` at p = 0, 0.25, 0.5, 0.75 and 1 identical to the
  recorded values; whole-asset bounds 0.104 x 0.1369 x 0.1304 at every sampled
  pose; hand bounds constant at 0.10404 x 0.1369 x 0.13039 while the flower's
  grow from 0.02825 x 0.02289 x 0.03731 to 0.02928 x 0.02718 x 0.04204, which
  is the bloom. R3's pipeline still builds, renders and disposes, and R7
  returns geometry and texture counts to zero. Typecheck, build, dev, harness,
  preview and cold preview all clean, no external request, one render loop.

  **Remaining limitation.** The master is 2.58 MB to 2.74 MB, the cost of
  carrying three more actions. Nothing else: the pose actions do not reach the
  web asset, and the export would now fail loudly rather than quietly if one of
  the two it needs went missing.

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
F-06, F-07 and F-08 under R14 and R15, the startup-timing half of R9 under
F-09, A-01 and A-04 under R4 and R12, the representable part of M-01 under
R8, M-05 under R3, and P-01 under R13** (see the notes on each). All three seams the verdict named are in place,
and F-10 resolved itself when the dev harness left the build.

The remaining items are either genuinely low impact (F-01, F-09, F-10) or
correctly deferred until the canvas carries content (F-06, F-07).
