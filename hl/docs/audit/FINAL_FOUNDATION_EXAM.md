# FINAL FOUNDATION EXAM

**Audit only. Nothing in the repository was modified, fixed, rebuilt, deleted or
installed to produce this examination.**

Date: 2026-09-20. Commit: `bf2f3e0`.
Benchmark held throughout: https://why.zero.university/ (live inspection) and
its published engineering article (documented facts).

Supporting documents: `01` to `11` in this directory.

---

## 1. CURRENT PROJECT STATE

The repository contains a working Vite + TypeScript + Three.js foundation, a
Blender toolchain, and one finished 3D asset. It does not contain a website.

**Application.** `index.html` carries a single full-viewport canvas.
`src/main.ts` boots `src/core/App.ts` (128 lines), which owns a `WebGLRenderer`,
an empty `Scene`, a `PerspectiveCamera` and a render loop driven by a single
`gsap.ticker` callback. `src/core/Viewport.ts` (98 lines) tracks size with a
`ResizeObserver` and device pixel ratio with a re-arming `matchMedia` query,
clamped at 2. Context loss and tab visibility are handled. The production scene
is empty: the site renders a blank `#05070a` canvas.

**Assets.** A prototype right hand (TurboSquid, 5,534 triangles, 21 bones) in
`assets/source/hand/`, untouched. A production Blender master at
`assets/production/heloria-hand-flower.blend` combining that hand with a
bespoke, script-generated flower, joined by a bone-parented
`HeloriaFlowerAnchor` on the palm metacarpal. Two GLB exports in
`public/models/`: 3.52 MB plain and 1.44 MB Draco, carrying 48,536 triangles,
six materials, two skins and one 150-channel, 6.25 s clip.

**Tooling.** Four Python tools totalling 1,571 lines: a deterministic flower
generator, the master assembler, a Cycles render harness, and an exporter that
bakes the procedural skin to textures and writes both GLBs.

**Documentation.** `CLAUDE.md` (the project constitution), an asset
specification, a brand analysis, and a hand source analysis.

**Temporary.** `dev/hand-flower.html` and `src/dev/hand-flower-test.ts`, a
development harness that loads the GLB and scrubs it from a slider. It is
currently included in the production build.

---

## 2. WHAT IS VERIFIED

Every item here was proven by running something, not by reading a filename.

**Build and types.** `npm run build` exits 0. `tsc --noEmit` is clean on both
projects under `strict`, `noUncheckedIndexedAccess` and
`exactOptionalPropertyTypes`. Output: `three` 541.41 kB (136.33 kB gzip), `gsap`
70.08 kB, `main` 3.42 kB, `devHandFlower` 49.11 kB.

**Runtime cleanliness.** Three consecutive hard refreshes of the production
entry: no console errors, no warnings, no failed requests, no WebGL messages.
Page load 565 ms cold, then 190 ms and 181 ms.

**Canvas and DPR.** Drawing buffer equals CSS size times `min(devicePixelRatio,
2)`, measured at DPR 1, 2, 2.625 and 3. No horizontal overflow at 1280, 390, 412
or 768 CSS pixels.

**First paint.** With the `three` chunk artificially stalled 2.5 s, the document
already paints `rgb(5, 7, 10)`, exactly the renderer clear colour, from a
stylesheet link in `<head>` of the production build. The first paint is
engineered, not accidental.

**Single clock.** Exactly one `gsap.ticker` callback; no second
`requestAnimationFrame` anywhere in `src/`.

**GLB loads and scrubs.** In headless Chromium: six skinned meshes, six
materials by name, two skins (21 and 29 joints), `HeloriaFlowerAnchor` present,
one clip of 6.25 s and 150 tracks, bounds 0.104 x 0.137 x 0.130 m. Scrubbed at
fourteen points in both directions.

**Anchor behaviour.** The anchor's world position travels 14.2 mm across the
interaction, strictly monotonic, no discontinuity, no jump, no reversal.

**Finger sequencing.** Fingertip-to-palm distances measured at five points: at
p 0.75 the index has travelled 96% of its range, the ring finger 78%, the thumb
71%. The fingers do not move as a block.

**Flower lag.** Flower radius is unchanged until after p 0.25, then 2.225 at
0.75 and 2.869 at 1.00 against 1.169 closed. The hand leads and the flower
follows, as specified.

**Flower and hand intersection.** Measured with a BVH nearest-surface normal
test: **168 flower vertices (2.40%) are inside the hand mesh at p 0.00, up to
4.8 mm deep; 123 vertices (1.76%) at p 0.25; zero from p 0.50 onward.**

**Asset composition.** 48,536 triangles, 6 primitives, 56 nodes, 526.1 KB of
WebP textures (three at 2048², three at 512²), 285.9 KB of animation samplers.
Geometry and skinning are 74% of the uncompressed file.

**Pose actions are missing.** The saved master contains only
`HELORIA_HAND_REVEAL` (51 F-curves) and `HELORIA_FLOWER_BLOOM_SYNC` (117).
`HELORIA_HAND_CLOSED`, `HELORIA_HAND_OPEN` and `HELORIA_FLOWER_BLOOM` were
authored by the tools and are not in the file.

**Absent asset classes.** Zero `.glsl`, `.vert`, `.frag`, `.woff2`, `.mp3`,
`.exr`, `.hdr`, `.ktx2` files anywhere in the repository. `howler` is installed
and imported nowhere.

**Visual defects.** At p 0.00 the flower is visible through the gap between the
middle and ring fingers from a three-quarter camera. At p 0.50 the flower
renders as a crumpled, unreadable mass.

---

## 3. WHAT IS NOT YET BUILT

Classified as not built, not as failures. None of these was expected to exist at
this stage.

Virtual progression; stage/segment system; asset manager; draw-circle gate; hold
interaction; hand scroll choreography; environmental typography; GLSL shader
system (plugin configured, zero shader files); post-processing; audio; UI/HUD;
adaptive quality; lazy loading and preload groups; GPU upload queue; loading
state or progress indicator; Draco loader wiring; KTX2 pipeline; HDRI
environment.

Also not written: `docs/zero-reference-analysis.md`,
`docs/heloria-experience-spec.md`, `docs/heloria-hand-flower.md`.

### What could not be established

- **Real-device performance.** All browser measurement ran under SwiftShader
  software rasterisation in a container. Frame timing recorded a 415 ms median,
  which is a property of the test environment, not of the asset. **No valid
  claim about FPS on real hardware can be made from this audit.**
- **Behaviour under forced WebGL context loss.** The handlers are present and
  correct by inspection; no loss was induced.
- **Mobile GPU behaviour**, including shader precision, texture memory pressure
  and real touch input. Only viewport and DPR geometry were tested.
- **Licence terms of the prototype hand.** Not recorded in the file and not
  verified.
- **The HDRI's effect on the look.** The file does not exist in the repository
  and has never been used in any render.

---

## 4. FOUNDATION PROBLEMS

| ID | Problem | Severity |
| --- | --- | --- |
| F-03 | No update registry. The loop renders but orchestrates nothing, so there is no defined seam or ordering for progression, stages and post-processing to attach to. | **High** (blocking the next phase) |
| F-05 | No disposal walker. `dispose()` disposes the renderer and nothing in the scene. Correct today, incorrect at the first `teardown`. | **High** (before a second scene) |
| F-02 | No delta time reaches anything. `App.tick` takes no arguments. | Medium |
| F-04 | Exposure is not a controlled value. Default in production, 1.05 in the dev harness, AgX in Blender. | Medium |
| F-06 | No capability detection and no WebGL failure path. A context failure throws uncaught onto a black page. | Medium |
| F-08 | The temporary dev harness is wired into the production build and ships in `dist/`. | Medium |
| F-07 | The canvas is `aria-hidden` with no accessible name. Correct while blank, wrong at first content. | Low now |
| F-09 | No resource hints beyond Vite's `modulepreload`. | Low |
| F-01 | `howler` installed, never imported. | Low |
| F-10 | Rollup chunk-size advisory on `three`. | Low, no action |

---

## 5. HAND PROBLEMS

| ID | Problem | Severity |
| --- | --- | --- |
| P-02 | The closed hand is a loose claw, not a protective cup. Fingertip-to-palm reduces only 31% from open to closed, with visible gaps and the thumb behind rather than across the fingers. Substantial unused rig range remains (58 to 66 degrees used against a 120 degree limit). | **High** |
| P-03 | The flower is visible through the finger gap when closed, from a three-quarter camera. Concealment is camera-dependent rather than geometric. | **High** |
| M-01 | No subsurface scattering in the web asset. The primary reason the hand reads as vinyl. | **High** |
| M-05 | No contact shadow or ambient occlusion anywhere. | **High** |
| P-01 | `HELORIA_HAND_CLOSED` and `HELORIA_HAND_OPEN` are not saved in the master. | Medium |
| M-03 | The 2048² normal map is nearly flat (14.1 KB), so there is no pore or wrinkle detail. | Medium |
| M-02 | Roughness varies only 0.34 to 0.56 from one low-frequency noise. Uniform sheen. | Medium |
| M-04 | Palm creases are painted into the colour map, so they do not shade. | Medium |
| P-04 | The first 25% of progress produces 7% of the hand's travel. | Medium |
| H-S1 | The source asset ships with all ten textures missing; every surface is authored by this project. | High (context) |
| H-S5 | Flat forearm stump permanently constrains framing. | Medium |
| H-S7 | Licence unverified; prototype only. | High (commercial) |

---

## 6. FLOWER PROBLEMS

| ID | Problem | Severity |
| --- | --- | --- |
| F-03 | At bloomProgress 0.50 the flower is an unreadable crumpled mass, at exactly the moment specified as "first clear glimpse". | **High** |
| F-01 | Petal subsurface (0.34) does not survive glTF export. The petals are opaque card in the browser. | **High** |
| F-05 | Petal overlap in the bud is unmanaged; adjacent petals interpenetrate when wrapped. Root cause of F-03. | Medium |
| F-04 | Sepals read as detached leaves rather than a calyx, because they are generated by the petal function at negative pitch. | Medium |
| (none) | Stamens are well modelled (36, two whorls, coloured anthers) but read as an undifferentiated pale cluster in WebGL. | Low |

The flower is otherwise sound: bespoke, deterministic, reproducible from seed
20260920, correctly scaled at about 55 mm in a 90 mm palm, with real per-petal
asymmetry, independent two-bone control on all 13 petals, a correctly lagged
bloom, and **zero texture bytes** because all colour is a vertex attribute.

---

## 7. HAND + FLOWER INTEGRATION PROBLEMS

| ID | Problem | Severity |
| --- | --- | --- |
| D-01 | The flower intersects the hand at p 0.00 (168 verts, 4.8 mm) and p 0.25 (123 verts, 3.9 mm), violating a stated acceptance criterion. Shares a root cause with P-02. | **High** |
| D-02 | Concealment holds for the Blender camera and fails for a three-quarter camera. A pose-level fix is robust; a camera-level one is not. | **High** |
| D-03 | The midpoint of the reveal is the weakest frame in the sequence. | **High** |
| D-04 | No translucency in the web asset. | Medium |
| D-05 | Nearly static first quarter will make a hold feel unresponsive. | Medium |
| D-06 | Six skinned draw calls is the floor of the frame budget (the flower splits into four primitives by material). Not a defect; a constraint. | Low |

**What works:** the attachment chain survived export intact, with the anchor a
real node under the palm joint; one clip drives both skins from one mixer time;
scrubbing is continuous and monotonic in both directions; the hand-leads-flower
lag is present and measurable.

---

## 8. WEBGL ASSET PROBLEMS

| ID | Problem | Severity |
| --- | --- | --- |
| A-01 | Textures are WebP, not KTX2. **526 KB on the wire becomes roughly 51 MB of GPU memory** (three 2048² maps at about 16 MB each, plus nails). Contradicts the project's own asset specification. | **High** |
| A-05 | No transmission or volume extension, so no petal translucency. | **High** |
| A-04 | All six materials export double-sided. Correct for petals, wrong for skin and nails, which doubles fragment work on the most expensive shader in the scene. | Medium |
| A-02 | A 2048² normal map carrying almost no information (14.1 KB) costs a full 16 MB of VRAM. | Medium |
| A-03 | Roughness is a full 2048² map of a smooth, low-frequency field. A 512² map would be identical. | Medium |
| A-06 | A Draco GLB exists at 1.44 MB with no `DRACOLoader` configured and no self-hosted decoder. | Medium |
| A-07 | 2,791 ms to first usable frame on localhost with no loading indicator. | High (system, not asset) |
| A-08 | The master contains no images; textures exist only in the GLB, baked at export. Legitimate, but undocumented. | Low |

---

## 9. LIGHTING / MATERIAL PROBLEMS

The HDRI named in the brief, `syferfontein_6d_clear_puresky_4k.exr`, **is not in
the repository.** No `.exr` or `.hdr` file exists. `tools/render_tests.py` looks
for a 1K version and falls back to a Nishita sky when absent; every render
produced so far used the studio light set, not an HDRI. The Three.js side uses
`RoomEnvironment`, a generated studio box.

Assessment of the candidate (CC0, Poly Haven, 21 EVs, 5400K, 4K EXR is
73.95 MB): acceptable as a prototype input at 1K; **wrong for the final hand and
flower shots**, because a clear-sky HDRI imposes a warm-gold and blue palette
that fights the near-monochrome brand, and because it is sky-only, so there is
no ground bounce and the undersides of fingers and petals receive nothing.
Never shippable in that form.

| ID | Problem | Severity |
| --- | --- | --- |
| M-05 | No contact shadow or AO. The largest single reason the hand and flower do not read as touching. | **High** |
| M-01 | No subsurface on skin in the web asset. | **High** |
| M-06 | The environment is `RoomEnvironment`, a placeholder with no directional intent, colour story or relationship to the brand. | Medium |
| M-02 / M-03 / M-04 | Narrow roughness variation, near-flat normal map, creases painted rather than shaded. | Medium |
| M-08 | Three different exposure and view-transform settings across Blender, production and the dev harness. | Medium |
| M-07 | Double-sided skin and nails. | Medium |

---

## 10. VISUAL QUALITY GAPS

Full list of 28 observations in doc 09. The gaps that account for most of the
distance:

1. **No contact shadow anywhere.** The flower sits on the palm rather than in
   it.
2. **No subsurface on skin.** Reads as vinyl; no edge glow, no warm terminator.
3. **The mid-bloom is unreadable**, at the exact moment of the reveal.
4. **No depth in the frame.** One subject against a flat black void. The
   benchmark never shows an object against nothing.
5. **No post-processing in the browser.** Blender has depth of field focused on
   the flower; the browser is uniformly sharp, so the visual hierarchy is lost.
6. **The closed hand does not read as protecting something.**
7. **Petals are opaque**, which is the difference between a petal and card.
8. **Knuckles have no anatomy**; fingers read as smooth tubes.
9. **The environment is a placeholder.**
10. **No secondary motion.** No settle, sway, breath or weight on the hand.

What is genuinely good and should not be disturbed: the composition (hand right
of centre, left third reserved for typography), the camera distance and lens,
the finger sequencing, the flower's lag, the flower's form and asymmetry in the
open state, and the correct real-world scale.

---

## 11. FUTURE ARCHITECTURE RISKS

1. **Every system will invent its own clock.** Without delta time and an ordered
   update registry, progression, adaptive quality and shader timing will each
   attach to `gsap.ticker` independently and the per-frame ordering becomes
   incidental. This is the highest-probability architectural failure.
2. **The first `teardown` will leak.** Without a disposal walker written before
   the stage lifecycle, GPU memory will accumulate across stage changes and the
   habit will be set by the first two stages.
3. **Texture memory will be discovered on a phone.** 51 MB for one prop, with a
   file size that gives no warning. Adding a second and third stage on the same
   pattern reaches the limit before anyone profiles.
4. **Typography will be blocked by an unmade decision.** DOM text behind a
   transparent canvas versus scene-rendered text determines occlusion, depth of
   field, accessibility and the font pipeline. Nothing can start until it is
   made.
5. **The hand's root transform is not animated at all.** Choreographing it
   through the experience means driving it from progression in code, which needs
   the progression value to exist first.
6. **Shader precision will bite on mobile only.** A near-black palette plus
   `mediump` on Adreno and Mali is a banding failure invisible on every
   development machine.
7. **The prototype hand is a release blocker, not a technical one.** Its blast
   radius is small (one file names it), which is the mitigation, but the
   replacement must happen before launch.
8. **Two representations of the same material** (procedural in the master, baked
   in the GLB) will drift silently unless re-export is part of the routine.

---

## 12. ZERO REFERENCE PRINCIPLES RELEVANT NOW

Full treatment in doc 11. The ones that bear on the next phase:

| # | Principle | Status for Heloria |
| --- | --- | --- |
| P1 | One eased virtual value drives everything | The asset is already built for it; the application is not |
| P3 | Validate the gesture mathematically (signed angle, radial CV, closure) | Ready to build now; needs Heloria's own visual response |
| P4 | Loading is a designed moment and progress is honest | Unmet: 2,791 ms of nothing |
| P5 | Never a white pre-paint; invisible handover to WebGL | **Already met**, verified under a stalled bundle |
| P7 | Texture memory is the real budget, not file size | Unmet: 526 KB becomes ~51 MB |
| P8 | Self-host every decoder | Applies the moment Draco or KTX2 is wired |
| P9 | One deliberate tone-mapping point, plus dithering | Unmet: three exposure settings, no dithering on a near-black palette |
| P10 | Shader precision is a mobile correctness issue | Applies at the first shader |
| P11 | Synchronise sound to a rendered frame, not a timer | Applies at the first sound |
| P12 | Hide the cost inside the gesture | Applies at the hold |
| P13 | Refuse the expensive problem when the cheaper one gives the same result | Heloria chose real-time PBR where Zero refused it; that choice has to be earned |
| P2 | Self-contained segments with a full lifecycle | Not yet; but the disposal walker is the prerequisite to write now |

---

## 13. TOP 15 REQUIRED REMEDIATIONS

Ordered by the work required to close the most important gaps.

### R1
- **PRIORITY:** 1
- **PROBLEM:** The closed hand is a loose claw that neither reads as protective
  nor contains the bud, which simultaneously causes visible intersection and
  camera-dependent concealment (P-02, D-01, D-02).
- **FILE/SYSTEM:** `tools/build_hand_flower.py`, `HAND_CLOSED` table
- **EXACT CHANGE:** Increase proximal and middle flexion towards the rig's
  published 120 degree limits, bring the thumb across the fingers rather than
  behind them, and close the inter-finger gaps. Re-run the BVH penetration test
  and the multi-angle concealment check as acceptance.
- **WHY:** One pose fixes three High findings, including the opening frame of
  the experience.
- **EXPECTED RESULT:** Zero flower vertices inside the hand at p 0.00 and 0.25;
  no flower visible from any camera in the intended envelope.
- **DEPENDENCIES:** None.

### R2
- **PRIORITY:** 2
- **PROBLEM:** At bloomProgress 0.50 the flower is an unreadable crumpled mass
  at the exact moment of the reveal (F-03, F-05, D-03).
- **FILE/SYSTEM:** `tools/create_heloria_flower.py`, `apply_openness` and the
  closed-pose constants
- **EXACT CHANGE:** Make the bud unwrap as a consistent spiral: increase the
  per-petal spiral about local Y, stagger the phases more widely so no two
  petals occupy the same space at the same openness, and verify readability at
  0.35, 0.45, 0.50 and 0.60 rather than only at the endpoints.
- **WHY:** The interaction exists to deliver the reveal, and the reveal's
  midpoint is currently its weakest frame.
- **EXPECTED RESULT:** Readable, separated petals at every intermediate state.
- **DEPENDENCIES:** None.

### R3
- **PRIORITY:** 3
- **PROBLEM:** No contact shadow or ambient occlusion, so the flower reads as
  resting on the palm rather than being held (M-05, doc 09 observation 20).
- **FILE/SYSTEM:** renderer setup, plus a first post-processing pass
- **EXACT CHANGE:** Add contact shadowing. Evaluate a soft shadow map against a
  screen-space AO pass and choose on measured cost, not preference.
- **WHY:** Highest visible gain per unit of work in the entire audit.
- **EXPECTED RESULT:** The two objects read as touching.
- **DEPENDENCIES:** R6 (the render step must exist before a composer can
  replace it).

### R4
- **PRIORITY:** 4
- **PROBLEM:** 526 KB of WebP becomes roughly 51 MB of GPU memory, contradicting
  the project's own asset specification (A-01, A-02, A-03).
- **FILE/SYSTEM:** `tools/export_glb.py`, `public/models/`
- **EXACT CHANGE:** Convert to KTX2 with per-map settings: keep base colour at
  2048² if it earns it, drop roughness to 512², and either give the normal map
  real detail or remove it. Compare compressed against uncompressed before
  committing each setting.
- **WHY:** On a mid-range phone this single prop would consume most of the
  opening shot's texture budget, with no warning from the file size.
- **EXPECTED RESULT:** GPU texture cost in single-digit megabytes with no
  visible quality loss.
- **DEPENDENCIES:** R5 (the decoder must be self-hosted before the format is
  adopted).

### R5
- **PRIORITY:** 5
- **PROBLEM:** A Draco GLB exists with no loader and no decoder; KTX2 will need
  a transcoder (A-06).
- **FILE/SYSTEM:** `public/vendor/`, loader configuration in `src/`
- **EXACT CHANGE:** Vendor the Draco decoder and the Basis transcoder into the
  repository and point the loaders at the local path. Never a CDN.
- **WHY:** Verbatim from the benchmark's published experience: a CDN slowdown
  made every compressed asset fail to decode even though the assets were hosted
  locally.
- **EXPECTED RESULT:** 3.52 MB becomes 1.44 MB with no third-party runtime
  dependency.
- **DEPENDENCIES:** None.

### R6
- **PRIORITY:** 6
- **PROBLEM:** The loop renders but orchestrates nothing: no delta time, no
  ordered update registry, no explicit render step (F-02, F-03).
- **FILE/SYSTEM:** `src/core/App.ts`
- **EXACT CHANGE:** Accept `(time, deltaTime, frame)` from `gsap.ticker`,
  introduce an ordered list of updatables, and make rendering the explicit last
  step.
- **WHY:** Five of the six systems blocked in doc 10 are blocked by exactly this.
  It is far cheaper in a 128-line file than after progression, stages and
  post-processing attach to it.
- **EXPECTED RESULT:** A defined frame pipeline with specified ordering.
- **DEPENDENCIES:** None. **This is the gate for most of what follows.**

### R7
- **PRIORITY:** 7
- **PROBLEM:** No disposal walker, so `teardown` cannot be written correctly
  (F-05).
- **FILE/SYSTEM:** `src/core/` (new utility)
- **EXACT CHANGE:** A `disposeObject(root)` that traverses and disposes
  geometries, materials, their textures and any render targets, plus a test that
  a load-and-dispose cycle returns `renderer.info.memory` to its baseline.
- **WHY:** The first two stages will set the habit; written after the fact it
  never gets applied retroactively.
- **EXPECTED RESULT:** Stage changes free their GPU memory, provably.
- **DEPENDENCIES:** None. Must precede the stage system.

### R8
- **PRIORITY:** 8
- **PROBLEM:** No subsurface on skin; the hand reads as vinyl (M-01).
- **FILE/SYSTEM:** hand material in the web application
- **EXACT CHANGE:** Decide explicitly between a transmission-based material, a
  wrapped-lighting approximation in a custom shader, or baking the lighting as
  the benchmark did. Record the decision and its reasoning before implementing.
- **WHY:** It is the largest single contributor to the hand looking CG, and
  principle P13 says the expensive path has to be earned rather than assumed.
- **EXPECTED RESULT:** Warm, soft shadow terminators and edge translucency.
- **DEPENDENCIES:** R6.

### R9
- **PRIORITY:** 9
- **PROBLEM:** 2,791 ms to first usable frame with nothing on screen (A-07, P4).
- **FILE/SYSTEM:** `index.html`, a new loading module
- **EXACT CHANGE:** Report real bytes received and real GPU uploads completed.
  Design what occupies the first paint, which already has the correct colour.
- **WHY:** It is the first thing every visitor experiences and it is currently
  the least designed part of the project.
- **EXPECTED RESULT:** Loading becomes part of the experience rather than a gap
  before it.
- **DEPENDENCIES:** R6, and whichever stage first loads the GLB.

### R10
- **PRIORITY:** 10
- **PROBLEM:** Three different exposure and view-transform settings across
  Blender, production and the dev harness; no dithering on a near-black palette
  (M-08, P9).
- **FILE/SYSTEM:** renderer setup, output pass
- **EXACT CHANGE:** One tone-mapping point with a recorded exposure value that
  matches the Blender view transform, plus blue-noise dithering in the final
  pass.
- **WHY:** Without it, lighting decided in Blender does not transfer, and this
  palette will band visibly.
- **EXPECTED RESULT:** One look, transferable between tools, with no rings in
  gradients.
- **DEPENDENCIES:** R3 (the same pass).

### R11
- **PRIORITY:** 11
- **PROBLEM:** Petal translucency does not survive export (F-01, A-05, D-04).
- **FILE/SYSTEM:** flower material in the web application
- **EXACT CHANGE:** Add transmission and thickness on the web side, or a
  deliberate wrapped-lighting cheat. Geometry and thickness already exist.
- **WHY:** A white flower without translucency is white card, and this is the
  hero object of the reveal.
- **EXPECTED RESULT:** Petals glow where light passes through them.
- **DEPENDENCIES:** R6.

### R12
- **PRIORITY:** 12
- **PROBLEM:** All six materials are double-sided; skin and nails should not be
  (A-04, M-07).
- **FILE/SYSTEM:** `tools/export_glb.py`
- **EXACT CHANGE:** Set backface culling on skin and nails; keep petals
  double-sided.
- **WHY:** Free fragment-cost reduction on the scene's most expensive shader.
- **EXPECTED RESULT:** Lower fragment cost, no visual change.
- **DEPENDENCIES:** None.

### R13
- **PRIORITY:** 13
- **PROBLEM:** `HELORIA_HAND_CLOSED`, `HELORIA_HAND_OPEN` and
  `HELORIA_FLOWER_BLOOM` are not saved in the master (P-01).
- **FILE/SYSTEM:** `tools/build_hand_flower.py`, `tools/create_heloria_flower.py`
- **EXACT CHANGE:** Set `use_fake_user` on the pose actions so Blender persists
  them.
- **WHY:** They were specified deliverables, and a pose library is how the
  motion gets re-derived or re-timed later.
- **EXPECTED RESULT:** Five actions in the master; no change to the web asset.
- **DEPENDENCIES:** None.

### R14
- **PRIORITY:** 14
- **PROBLEM:** The temporary dev harness ships in the production build (F-08).
- **FILE/SYSTEM:** `vite.config.ts`
- **EXACT CHANGE:** Gate the second Rollup entry behind a mode check, or remove
  the harness when the real interaction replaces it.
- **WHY:** A development route is publicly reachable on any deploy of `dist/`.
- **EXPECTED RESULT:** One production entry.
- **DEPENDENCIES:** None.

### R15
- **PRIORITY:** 15
- **PROBLEM:** No capability detection and no WebGL failure path; the canvas is
  `aria-hidden` with no accessible name (F-06, F-07).
- **FILE/SYSTEM:** `src/main.ts`, `src/core/App.ts`, `index.html`
- **EXACT CHANGE:** Guard renderer construction, expose the capability set, and
  provide a DOM fallback carrying the company's actual content. Give the canvas
  a role and label when it starts carrying content.
- **WHY:** Today a context failure is a black page and an uncaught exception,
  and the accessibility floor recorded as "must stay" in the brand analysis would
  be broken by the current markup.
- **EXPECTED RESULT:** A graceful degradation path and an accessible experience.
- **DEPENDENCIES:** None, but best done with the first real content.

---

## 14. NEXT BUILD ORDER

Discrete tasks, in sequence. No task combines unrelated fixes. Nothing here
builds a system that should not yet exist.

1. **R6**: delta time and an ordered update registry in `App.ts`.
2. **R7**: the disposal walker plus its memory-baseline test.
3. **R13**: persist the named pose actions (fast, isolated).
4. **R1**: re-author the closed hand pose; verify with the BVH penetration test
   and a multi-angle concealment check.
5. **R2**: fix the bud unwrap so intermediate states are readable; verify at
   0.35, 0.45, 0.50, 0.60.
6. **R12**: correct sided-ness on skin and nails at export.
7. **R5**: vendor the Draco decoder; wire `DRACOLoader`.
8. **R4**: convert textures to KTX2 with per-map settings; measure before and
   after.
9. **Write `docs/heloria-hand-flower.md`**: the asset document specified by the
   previous task and not produced.
10. **Build the virtual progression value** (`targetProgress`,
    `currentProgress`, derived velocity), driven by wheel and touch, eased with
    delta time. Nothing else changes.
11. **Build the draw-circle gate** as a self-contained module: signed angle,
    radial coefficient of variation, closure. Heloria's own thresholds and its
    own visual response.
12. **Write the first GLSL shader** for the stroke feedback, establishing the
    precision and dithering policy in the same change.
13. **Build the hold interaction**, writing to the progression value rather than
    to the mixer directly.
14. **R3 + R10**: the first post-processing pass: contact shadow, then one
    tone-mapping point with dithering.
15. **R9**: the loading experience, on real bytes and real uploads.
16. **R8**: decide and implement the skin shading approach.
17. **R11**: petal translucency.
18. **R14**: remove or gate the dev harness once the real interaction replaces
    it.
19. **R15**: capability detection, failure path, canvas accessibility.
20. **Write `docs/heloria-experience-spec.md`** before any second stage, since
    the asset spec's stage assignments are provisional until it exists.

Deliberately **not** in this list: the stage system (needs the experience spec),
environmental typography (needs the DOM-versus-scene decision), audio, adaptive
quality, lazy loading, the GPU upload queue, and any HDRI decision.

---

## 15. READINESS

These are readiness statements, not quality ratings.

**FOUNDATION: READY**
Build clean, types clean, console clean, one clock, correct DPR handling
verified at four ratios, context loss and visibility handled, first paint
engineered and verified. It is smaller than its next task, and R6 and R7 are
seams to add rather than repairs, but nothing in it is wrong.

**HAND: NOT READY**
The rig, sequencing, thumb participation, wrist stability and deformation are
sound. The closed pose does not read as protective, the surface has no
subsurface and no meaningful normal detail, and the licence is unverified.

**FLOWER: NOT READY**
Bespoke, reproducible, correctly scaled, genuinely asymmetric, well rigged, and
excellent in the open state. Unreadable at the midpoint of its own reveal and
opaque in the browser.

**HAND + FLOWER: NOT READY**
Mechanically complete and verified: the anchor holds, one clip drives both
skins, scrubbing is continuous and monotonic, and the flower correctly lags the
hand. It fails on presentation: measurable intersection when closed,
camera-dependent concealment, and an unreadable midpoint.

**WEBGL ASSET: NOT READY**
Loads, displays, preserves materials and skinning, exposes animation, and
scrubs, all verified in a browser with a clean console. Blocked on texture
memory: 526 KB on the wire becomes roughly 51 MB of GPU memory, against the
project's own specification.

**READY FOR NEXT DEVELOPMENT PHASE: YES**

The question this audit was set is whether the foundation and the hand/flower
asset are strong enough to begin building
DRAW CIRCLE → HOLD → HAND OPENS → FLOWER BLOOMS.

They are. The transport layer is proven end to end: one normalised value drives
two skinned rigs through a single clip, continuously and reversibly, with the
flower physically anchored to the palm and correctly lagging the hand. That is
the hard part of this asset, and it works.

The five remaining defects (R1 through R5) are bounded, understood, individually
measurable, and none of them is architectural. Four of them live in the two
Python tools, which regenerate the asset deterministically, so fixing them costs
a re-run rather than a re-model.

The one genuine caution is sequencing: **R6 and R7 should be done before the
progression and stage code is written**, not after. They are cheap in a 128-line
`App.ts` and expensive once five systems depend on it.
