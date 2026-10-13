# 01 Foundation: current state

**Audit only. Nothing in the repository was modified to produce this document.**

Date: 2026-09-20. Commit at audit time: `bf2f3e0`.
Method: filesystem inspection, `npm run build`, `npm run dev`, headless Chromium
(Playwright, SwiftShader), Blender 4.5.14 LTS `bpy` inspection of the .blend
files, and byte-level parsing of the exported GLB.

---

## 1. Complete repository map

Everything outside `node_modules`, `.git` and `dist`:

```
CLAUDE.md                 302 lines   project constitution
README.md                             short usage notes
.gitignore  .nvmrc

index.html                            production entry, single canvas
vite.config.ts                        vite + vite-plugin-glsl + 2 entries
tsconfig.json  tsconfig.node.json     strict TS, split app/node projects
package.json  package-lock.json

src/main.ts                 18 lines  boots App, HMR disposal
src/core/App.ts            128 lines  renderer, scene, camera, loop, lifecycle
src/core/Viewport.ts        98 lines  size + DPR tracking
src/styles/main.css         36 lines  foundation styles only
src/types/glsl.d.ts         26 lines  typings for GLSL imports
src/dev/hand-flower-test.ts 158 lines TEMPORARY dev harness
dev/hand-flower.html        23 lines  TEMPORARY dev route

tools/create_heloria_flower.py  726 lines  deterministic flower generator
tools/build_hand_flower.py      456 lines  assembles the production master
tools/export_glb.py             205 lines  bakes skin maps, exports GLB + Draco
tools/render_tests.py           184 lines  Cycles test renders

docs/heloria-asset-spec.md     1076 lines
docs/heloria-brand-analysis.md  346 lines
docs/hand-source-analysis.md    320 lines  (untracked at audit time)

assets/source/hand/Do_HandRigged_detailrender_shared_2026_04_01_FullFunction.blend   1.99 MB
assets/production/heloria-hand-flower.blend                                          2.58 MB
assets/production/heloria-hand-flower.blend1                                         2.58 MB (Blender autosave, gitignored, untracked)

public/models/heloria-hand-flower.glb         3.52 MB
public/models/heloria-hand-flower.draco.glb   1.44 MB
```

### What is categorically absent

Verified by extension search across the whole repository:

| Asset class | Count |
| --- | --- |
| `.glsl` / `.vert` / `.frag` | **0** |
| `.woff` / `.woff2` (fonts) | **0** |
| `.mp3` / `.ogg` / `.wav` (audio) | **0** |
| `.exr` / `.hdr` (HDRI) | **0** |
| `.ktx2` | **0** |
| loose `.png` / `.jpg` / `.webp` | **0** (the only textures live inside the GLB) |

`docs/zero-reference-analysis.md`, `docs/heloria-experience-spec.md` and
`docs/heloria-hand-flower.md` do not exist. CLAUDE.md section 9 already records
the first two as not yet written; the third was specified in the hand/flower
task and was not produced.

### Dependencies

Declared: `three ^0.180.0`, `gsap ^3.13.0`, `howler ^2.2.4`;
dev: `typescript`, `vite`, `vite-plugin-glsl`, `@types/*`.

Actually imported anywhere in `src/`:

- `three`: yes (`src/core/App.ts`, `src/dev/hand-flower-test.ts`)
- `gsap`: yes (`src/core/App.ts`, the ticker)
- `vite-plugin-glsl`: configured in `vite.config.ts`, but **no shader file
  exists for it to process**
- `howler`: **never imported.** Zero occurrences in `src/`.

---

## 2. Subsystem classification

Classification rule applied: a system is IMPLEMENTED only if it was observed to
work in a browser or in a tool run, not because a file exists. BROKEN is used
only where something that exists actually fails.

### Foundation

| Subsystem | Status | Evidence |
| --- | --- | --- |
| Vite build pipeline | **IMPLEMENTED** | `npm run build` exits 0. Emits `three` 541.41 kB (136.33 kB gzip), `gsap` 70.08 kB (27.57 kB gzip), `main` 3.42 kB, `devHandFlower` 49.11 kB, CSS 0.30 kB. One Rollup advisory: chunk > 500 kB. |
| TypeScript configuration | **IMPLEMENTED** | `tsc --noEmit` clean on both projects. `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals/Parameters` all on. |
| Renderer bootstrap | **IMPLEMENTED** | `canvas#webgl` present, context reports `WebGL 2.0 (OpenGL ES 3.0 Chromium)`, `MAX_TEXTURE_SIZE 8192`, `isContextLost() === false` on three consecutive hard refreshes. |
| Render loop | **IMPLEMENTED** | Single `gsap.ticker` callback in `App.tick`. No second `requestAnimationFrame` anywhere in `src/`. |
| Canvas sizing / DPR | **IMPLEMENTED** | Drawing buffer equals CSS size times `min(devicePixelRatio, 2)`, measured at DPR 1, 2, 2.625 and 3. See doc 02. |
| Resize handling | **IMPLEMENTED** | `ResizeObserver` on the canvas plus a `matchMedia("(resolution: Ndppx)")` listener that re-arms on change. Verified across four viewport profiles. |
| Colour management | **PARTIALLY IMPLEMENTED** | `outputColorSpace = SRGBColorSpace` and `toneMapping = ACESFilmicToneMapping` are set. `toneMappingExposure` is left at the default and is never varied; no exposure policy exists. |
| Context-loss handling | **IMPLEMENTED** | `webglcontextlost` is prevented and the loop stopped; `webglcontextrestored` re-applies size and restarts. Code path present and correct; not exercised under a forced loss in this audit, so marked implemented by inspection plus the listeners being attached, not by induced failure. |
| Tab-visibility pause | **IMPLEMENTED** | `visibilitychange` stops and restarts the loop. |
| Disposal | **PARTIALLY IMPLEMENTED** | `App.dispose()` removes listeners, disposes the `Viewport` and calls `renderer.dispose()`. There is **no scene-graph walker** disposing geometries, materials, textures or render targets, because nothing yet creates them in the production entry. |
| Delta time | **NOT YET BUILT** | `App.tick` takes no arguments and uses neither elapsed nor delta time. Nothing yet needs it, but no time source is plumbed. |
| First-paint colour continuity | **IMPLEMENTED (production)** | `dist/index.html` carries `<link rel="stylesheet">` in `<head>`, so `body { background: #05070a }` paints before any script runs, matching the renderer clear colour exactly. Confirmed: with the `three` chunk artificially stalled 2.5 s, `getComputedStyle(document.body).backgroundColor` is already `rgb(5, 7, 10)`. |
| Resource hints | **NOT YET BUILT** | The production head has Vite's `modulepreload` for `gsap` and `three` only. No `preconnect`, `dns-prefetch` or asset preload. |
| Accessibility on the canvas | **PARTIALLY IMPLEMENTED** | The canvas is `aria-hidden="true"` with no accessible name and no `role`. Defensible while the scene is empty; it will not be once the scene carries content. |
| WebGL failure fallback | **NOT YET BUILT** | No `try`/`catch` around renderer construction, no `<noscript>`, no message for a context-creation failure. |

### Experience systems

All verified absent by source search, not assumed.

| Subsystem | Status |
| --- | --- |
| Virtual progression (`targetProgress` / `currentProgress` / velocity) | **NOT YET BUILT** |
| Stage / segment system with `enter` / `scrub` / `update` / `teardown` | **NOT YET BUILT** |
| Asset manager | **NOT YET BUILT** (the dev harness calls `GLTFLoader` directly) |
| Draw-circle gate | **NOT YET BUILT** |
| Hold interaction | **NOT YET BUILT** |
| Hand scroll choreography | **NOT YET BUILT** |
| Environmental typography | **NOT YET BUILT** |
| GLSL shader system | **NOT YET BUILT** (plugin configured, zero shader files) |
| Post-processing | **NOT YET BUILT** |
| Audio | **NOT YET BUILT** (Howler installed, never imported) |
| UI / HUD layer | **NOT YET BUILT** |
| Adaptive quality | **NOT YET BUILT** |
| Lazy loading / preload groups | **NOT YET BUILT** |
| GPU upload queue | **NOT YET BUILT** |
| Loading state or progress | **NOT YET BUILT** |
| Draco decoder wiring in the app | **NOT YET BUILT** (a `.draco.glb` exists; no `DRACOLoader` is configured in `src/`) |
| KTX2 pipeline | **NOT YET BUILT** (no `.ktx2` assets, no `KTX2Loader`) |
| HDRI environment | **NOT YET BUILT** (no `.exr`/`.hdr` in the repository) |

### Assets

| Subsystem | Status | Evidence |
| --- | --- | --- |
| Hand source asset | **IMPLEMENTED** | Present, unmodified, md5-verified against the upload. Full inspection in doc 03. |
| Production Blender master | **IMPLEMENTED** | Opens clean; 6 objects, correct parenting, anchor bone-parented to `midd_meta`. |
| Named pose actions | **BROKEN** | `HELORIA_HAND_CLOSED`, `HELORIA_HAND_OPEN` and `HELORIA_FLOWER_BLOOM` were authored by `tools/build_hand_flower.py` but **are not in the saved master**. Only `HELORIA_HAND_REVEAL` (51 F-curves) and `HELORIA_FLOWER_BLOOM_SYNC` (117 F-curves) persist. Blender drops zero-user actions on save and no fake user was set. This is something that exists and fails, so it is BROKEN rather than NOT YET BUILT. |
| Flower generator | **IMPLEMENTED** | `tools/create_heloria_flower.py` runs headless and reproduces the same mesh from seed 20260920. |
| GLB export | **IMPLEMENTED** | 3.52 MB plain, 1.44 MB Draco; 48,536 triangles; both skins, the anchor and a 150-channel clip present. |
| GLB loading in Three.js | **IMPLEMENTED** | Loads through `GLTFLoader` in headless Chromium; 6 skinned meshes, 6 materials, anchor found, clip duration 6.25 s. |
| Continuous scrubbing | **IMPLEMENTED** | `action.time = p * duration; mixer.update(0)` drives every intermediate state; the anchor's world position moves monotonically with no jumps (doc 06). |
| Compressed textures | **NOT YET BUILT** | GLB textures are WebP via `EXT_texture_webp`, not KTX2. Consequence in doc 07. |

---

## 3. Console, network and rendering observations

Three consecutive hard refreshes of `http://localhost:5173/`:

- Console: only `[vite] connecting...` / `[vite] connected.` (debug level). **No
  errors, no warnings, no WebGL messages.**
- Network: no failed requests, no 4xx, no 5xx.
- DOM: 14 nodes. Canvas present, 1280x800 CSS, 1280x800 buffer at DPR 1.
- Page load: 565 ms cold, 190 ms and 181 ms warm.

`http://localhost:5173/dev/hand-flower.html`:

- One run recorded a single `404 (Not Found)` with no URL attached. A dedicated
  re-test capturing every response and failure recorded **no failures on either
  route**. The most likely cause is `/favicon.ico`, which the production entry
  declares as `data:,` and the dev route does not. Recorded as observed once,
  not reproducible, low severity.
- GLB fetched once, 3,691,240 bytes, status 200.
- Time from navigation to a usable first frame: **2,791 ms** on localhost, with
  no loading indicator of any kind on screen during that window.

### Visible rendering problems

Recorded here, analysed in docs 04, 05, 08 and 09:

1. At `bloomProgress = 0`, the flower is **visible through the gap between the
   middle and ring fingers** from a three-quarter camera.
2. At `bloomProgress = 0.5`, the flower reads as a **crumpled white mass**, not
   a partially open bloom.
3. The skin reads pale and waxy, with palm creases that look drawn rather than
   formed.
4. There is **no contact shadow** anywhere, so the flower appears to sit on the
   palm rather than in it.
5. The forearm stump is a flat cut and is visible whenever it enters frame.

### Layout

No horizontal overflow at any tested width: `document.body.scrollWidth` equals
`window.innerWidth` at 1280, 390, 412 and 768.

---

## 4. Summary count

| Status | Count |
| --- | --- |
| IMPLEMENTED | 15 |
| PARTIALLY IMPLEMENTED | 3 |
| NOT YET BUILT | 19 |
| BROKEN | 1 |
| UNVERIFIED | see doc 02 and doc 09 for the performance and real-GPU caveats |
