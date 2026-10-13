# 10 Future system readiness

**Audit only. No system was built or modified.**

For each planned system: is the current architecture ready to receive it, does
it require architectural preparation first, or is it not yet relevant?

Definitions used:
- **READY**: can be built directly against what exists today.
- **REQUIRES ARCHITECTURAL PREPARATION**: something must exist first, named
  precisely below.
- **NOT YET RELEVANT**: nothing about it should be decided at this stage.

---

## Summary

| System | Status |
| --- | --- |
| Virtual progression | **REQUIRES ARCHITECTURAL PREPARATION** |
| Stage system | **REQUIRES ARCHITECTURAL PREPARATION** |
| Draw circle | **READY** |
| Hold interaction | **REQUIRES ARCHITECTURAL PREPARATION** |
| Hand scroll choreography | **REQUIRES ARCHITECTURAL PREPARATION** |
| Environmental typography | **REQUIRES ARCHITECTURAL PREPARATION** |
| GLSL | **READY** |
| Post-processing | **REQUIRES ARCHITECTURAL PREPARATION** |
| Audio | **READY** |
| UI | **READY** |
| Adaptive quality | **REQUIRES ARCHITECTURAL PREPARATION** |
| Lazy loading | **NOT YET RELEVANT** |
| GPU upload queue | **NOT YET RELEVANT** |

---

## Virtual progression: REQUIRES ARCHITECTURAL PREPARATION

The benchmark's architecture is documented (CONFIRMED): no native scroll, no
ScrollTrigger, no oversized DOM. Wheel and touch update a virtual value that
eases toward a target, and asset loading, animation, shader timing, text and
overlays all read from that one value.

The hand and flower asset is already built for exactly this: one clip, one
mixer time, one normalised input, verified scrubbable in both directions.

**What must exist first:**

1. **Delta time through the render loop.** `App.tick` currently takes no
   arguments. `gsap.ticker` already supplies `(time, deltaTime, frame)`. An
   easing integrator that does not receive delta is framerate-dependent, so this
   is a prerequisite rather than a nicety.
2. **An ordered update registry on `App`.** Progression must update before
   anything reads it, and rendering must happen after everything has read it. If
   progression attaches itself to `gsap.ticker` independently, that ordering is
   incidental.
3. **A decision on the state shape**, recorded before implementation:
   `targetProgress`, `currentProgress`, and a derived `velocity`. Velocity is
   worth deriving from the start because later systems (motion blur, audio
   pitch, lag on secondary motion, adaptive quality) all want it and none of
   them can recover it later without storing history.

## Stage system: REQUIRES ARCHITECTURAL PREPARATION

The benchmark's segment contract is documented: `scrollVh`, `enter(ctx)`,
`scrub(ctx, p)` with local progress, `update(ctx, t, dt)` every frame, and
`teardown(ctx)`. Nine segments, each self-contained, and jumping to any stage
replays the preceding lifecycles rather than teleporting.

**What must exist first:**

1. **A disposal walker.** `App.dispose()` currently calls `renderer.dispose()`
   and disposes no scene content, because there is none. `teardown` is
   meaningless without a utility that walks a subtree and disposes geometries,
   materials, their textures and any render targets. Writing the lifecycle
   before the walker guarantees the first two teardowns are written ad hoc.
2. **The update registry** (as above), which is what `update` hangs from.
3. **A decision on scene isolation**: one `Scene` with stage subtrees, or a
   `Scene` per stage. This determines whether `teardown` removes a subtree or
   drops a scene, and it is much cheaper to decide now than to change later.
4. **An asset ownership rule**: whether a stage owns its assets or borrows them
   from a shared manager. The hand and flower will be used by more than one
   stage, so the answer cannot be "each stage loads its own".

## Draw circle: READY

The gesture check is fully documented and it is small (CONFIRMED):

```javascript
const wound    = totalSignedAngle(points, center);
const radiusCV = std(radii) / mean(radii);
const closed   = dist(points[0], points.at(-1)) < meanRadius;
if (wound > 5.76 && radiusCV < 0.35 && closed) unlock();
```

The mathematics is three measurements on a point list: total signed angle,
radial coefficient of variation, and closure. It needs no scene, no progression
and no stage system. It needs pointer events, a point buffer and a way to draw
the stroke.

**Ready to build now**, and it is the natural next piece because it is
self-contained and it is the first thing the visitor touches.

Two cautions. First, CLAUDE.md section 1.1 forbids copying the benchmark's exact
interactions; the *principle* here is "validate the gesture mathematically
rather than by tolerance boxes", and the specific thresholds and the frost
response are theirs. Heloria needs its own response. Second, the stroke needs
visual feedback, and that feedback is a shader, which makes this the natural
first use of the GLSL pipeline.

## Hold interaction: REQUIRES ARCHITECTURAL PREPARATION

The benchmark's shape is documented: `showAt`, `holdDuration`,
`onHoldProgress(ctx, p)`, `onHoldComplete(ctx)`.

For Heloria the hold is what drives `bloomProgress`, and the asset is ready for
that today.

**What must exist first:** the progression value, so that a hold writes to the
same authoritative number that everything else reads, rather than driving the
mixer directly. Also worth settling first: doc 04 P-04 records that the first
quarter of the hand's travel is nearly static, so a hold mapped linearly to
`bloomProgress` will feel unresponsive for its first quarter unless something
else responds in that window.

## Hand scroll choreography: REQUIRES ARCHITECTURAL PREPARATION

Requires progression and stages. It also requires a decision that does not exist
yet: **the hand's transform is currently not animated at all**. The clip
contains finger and petal motion only; position, rotation and scale of the whole
hand are static. Choreographing the hand through the experience means either
extending the clip or driving the root transform from progression in code. The
second is more flexible and is what the single-value architecture implies.

## Environmental typography: REQUIRES ARCHITECTURAL PREPARATION

The intended composition is large words behind the hand, environment behind the
words.

**Can the architecture support it?** Yes in principle, and the Blender
composition has already reserved the space for it, which is the part most
projects get wrong. But nothing exists yet:

1. **No fonts in the repository.** Zero `.woff2` files.
2. **No text rendering path.** The asset spec calls for MSDF atlases generated
   at build time; no generator and no atlas exists.
3. **No decision between DOM text behind a transparent canvas and text rendered
   in the scene.** This is the fork that determines everything else. Scene text
   can be occluded by the hand correctly and can take depth of field; DOM text
   is selectable, accessible and crisp. The benchmark does both: scene sprites
   composited *after* tone mapping in a deferred pass, plus a DOM overlay for
   UI.
4. **Typeface confirmation.** `docs/heloria-brand-analysis.md` records Anybody
   and Martian Mono on the current site, with licensing unverified for embedding.

Occlusion is the hard requirement: for words to be *behind* the hand they must
be occluded by it, which means either real depth in the scene or a rendered
mask. That is a compositing decision, and it should be made before the
typography work starts.

## GLSL: READY

`vite-plugin-glsl` is configured with `#include` resolution and watch mode,
`src/types/glsl.d.ts` declares the module types, and CLAUDE.md already forbids
inline template-literal shaders. Zero shader files exist, so the pipeline is
untested end to end, but there is nothing to prepare: the first `.frag` file
will exercise it.

One thing to settle at the first shader, not later: **precision.** The benchmark
records that several of its shaders had to be forced to `highp float` because
Adreno and Mali treat `mediump` as true 16-bit, producing bugs invisible on
desktop (identical strip motion, visible banding). Heloria's near-black palette
makes banding a near-certainty, so a precision and dithering policy belongs in
the first shader rather than in a later mobile fix.

## Post-processing: REQUIRES ARCHITECTURAL PREPARATION

The benchmark runs eight ordered passes with lazy initialisation, idle-time
prewarming, and per-frame enabling of the text pass when nothing is visible.

**What must exist first:** the update registry and an explicit render step, so
there is a single place where "render the scene" becomes "render through the
composer".

**Which passes are actually useful for Heloria**, on the evidence in doc 09:

| Pass | Worth it? |
| --- | --- |
| Depth of field | **Yes.** The Blender shot already uses it to make the flower the focal point after the reveal; the browser loses that hierarchy entirely. |
| Grain and a single tone-mapping stage | **Yes.** Near-black gradients band without dithering, and one deliberate tone-mapping point fixes the exposure inconsistency in doc 08 M-08. |
| Contact shadow / screen-space AO | **Yes, and highest value.** Doc 09 observation 20 identifies its absence as the largest single reason the hand and flower do not read as touching. |
| Bloom | **No**, and CLAUDE.md section 2 bans it by default. Nothing in this scene is emissive. |
| Colour grading / LUT | **Not yet.** After the palette is decided. |

## Audio: READY

Howler is installed and never imported, so there is nothing to undo. Audio needs
no architectural preparation beyond an unlock on first interaction, and the
draw-circle gate is that interaction.

One principle from the benchmark worth adopting immediately (CONFIRMED): the
shatter sound is synchronised **to the first rendered frame, not to a timer**,
because on slow devices a timer fires before the visuals appear. Heloria's
bloom has the same exposure: a sound cued by a timer will drift from a reveal
whose first frame waited on a shader compile.

## UI: READY

Nothing exists, and nothing needs to exist first. The one architectural decision
already made and correct is that `index.html` carries a single canvas with the
comment that DOM overlays sit above it. A `pointer-events: none` overlay layer
above the canvas is the standard shape and the benchmark uses it too.

## Adaptive quality: REQUIRES ARCHITECTURAL PREPARATION

The benchmark's manager is documented: a rolling frame-time buffer, downgrade
above 22 ms, upgrade below 12 ms, with a cooldown, adjusting pixel ratio, blur
samples, geometry detail and text resolution while keeping the experience
identical.

**What must exist first:** delta time in the loop (to measure), the update
registry (to place the monitor), and at least one quality axis that can actually
be varied. Today the only variable is pixel ratio, and it is hard-clamped at 2
in `Viewport`. There is no point building a manager with one dial.

**Not yet**, but the prerequisite is the same delta-time change that
progression needs.

## Lazy loading: NOT YET RELEVANT

One asset, one stage. Preload groups are a decision that belongs with the stage
system, and making it now would be guessing.

## GPU upload queue: NOT YET RELEVANT

The benchmark's queue (`createImageBitmap`, `requestIdleCallback`,
`renderer.initTexture`, 256 px tiled uploads, synchronous flush before a stage
appears) exists to solve a problem it measured: a single texture upload blocking
the main thread for 50 ms.

Heloria has three large textures in one asset. A **single synchronous flush
before the scene first appears** achieves the same result with none of the
machinery. The queue earns its complexity at a dozen-plus textures across
several stages.

The part worth taking now is not the queue but the underlying discipline:
**never let a texture's first upload happen during motion.** That applies from
the first stage transition onward.

---

## The common prerequisite

Five of the six systems marked REQUIRES ARCHITECTURAL PREPARATION are blocked by
the same three small changes to `src/core/App.ts`:

1. Delta time through the tick.
2. An ordered update registry with an explicit render step last.
3. A disposal walker.

None is a repair. All three are seams, and they are far cheaper to add to a
128-line `App.ts` than to retrofit once progression, stages and post-processing
are attached to it.
