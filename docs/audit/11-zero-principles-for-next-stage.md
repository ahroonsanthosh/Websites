# 11 Zero principles relevant to Heloria's next stage

**Audit only.**

Sources, and how each observation is labelled:

- **CONFIRMED**: stated in the published engineering article,
  https://tympanus.net/codrops/2026/07/17/zero-the-engineering-behind-a-defiant-interactive-narrative/
- **OBSERVED**: read directly from the live site's shipped DOM, stylesheet and
  markup at https://why.zero.university/ during this audit.
- **INFERRED**: reasoned from the above. Marked so it is not mistaken for fact.

This document lists only the principles that bear on **where Heloria actually
is**. Techniques the benchmark uses that Heloria has no current use for are
deliberately omitted; adopting them now would be cargo cult.

**The reference is a quality benchmark, not a template.** Nothing here is a
licence to copy code, assets, typography, branding, interactions or
compositions.

---

## P1. One value drives everything

**ZERO OBSERVATION (CONFIRMED).** No native scroll, no ScrollTrigger, no
oversized scrolling DOM. Wheel and touch update a virtual scroll value that eases
toward its target, and asset loading, animation, shader timing, text and overlays
are all driven from that single value.

**HELORIA RELEVANCE.** Directly and immediately. The hand and flower asset is
already built for it: one clip, two skins, one mixer time, one normalised input,
verified scrubbable in both directions. The asset is ahead of the application.

**WHEN TO IMPLEMENT.** Next, immediately after the three `App.ts` seams in doc
10.

**WHY.** Every subsequent system reads from it. Building the hold interaction,
the choreography or the typography before the authoritative value exists means
each invents its own source of truth, and reconciling them later is a rewrite.

---

## P2. Self-contained segments with a full lifecycle

**ZERO OBSERVATION (CONFIRMED).** Each stage is a segment with `scrollVh`,
`enter`, `scrub(p)` on local progress, `update(t, dt)` every frame, and
`teardown`. Nine segments. Jumping to any stage replays every preceding
lifecycle rather than teleporting, so the experience is always initialised as if
scrolled through naturally.

**HELORIA RELEVANCE.** High, but not yet. Heloria has one scene.

**WHEN TO IMPLEMENT.** When the second scene is designed, not before. What
should happen *now* is the disposal walker (doc 10), because `teardown` is
meaningless without it.

**WHY.** The replay-rather-than-teleport rule is the part worth taking early: it
is a constraint on how stages are written, and code written without it in mind
usually cannot be retrofitted to satisfy it.

---

## P3. Validate a gesture mathematically, not by tolerance boxes

**ZERO OBSERVATION (CONFIRMED).** Three measurements on the stroke: total signed
angle (about 2π for a full turn), radial coefficient of variation (low means
round, not a scribble), and closure (start and end within the mean radius).

**HELORIA RELEVANCE.** Direct. Heloria's opening is a drawn circle.

**WHEN TO IMPLEMENT.** Now. It is self-contained and needs nothing else.

**WHY.** These three measures are the honest definition of "a circle", and they
are scale-, speed- and position-independent, which is what makes a gesture gate
feel fair on a trackpad, a mouse and a finger alike. The *principle* transfers;
the thresholds, the frost response and the visual language are Zero's and must
not be reproduced. Heloria needs its own answer to what the stroke looks like
and what it does when it closes.

---

## P4. Loading is a designed moment, and progress is honest

**ZERO OBSERVATION (OBSERVED).** A counter runs to 99 with per-digit roll,
masked top and bottom; `role="progressbar"` with live `aria-valuenow`; a
body-level class gates the whole UI during load; each stage's navigation button
carries its own spinner and disabled state; stage jumps show a full-screen
overlay with a spinner.

**HELORIA RELEVANCE.** Direct and currently unmet. Measured: **2,791 ms from
navigation to first usable frame on localhost with nothing on screen.** On a
real connection the 3.52 MB asset is several seconds of blank.

**WHEN TO IMPLEMENT.** With the first stage that loads the GLB, which is the
next one.

**WHY.** It is the first thing every visitor experiences, and it is currently
the least designed part of the project. The principle is not "put a number in
the corner"; it is that loading is part of the experience and that the progress
shown is real.

---

## P5. Never a white pre-paint, and an invisible handover to WebGL

**ZERO OBSERVATION (OBSERVED, with the reasoning in their own shipped
comments).** A fixed gradient div at `z-index: 0` behind a transparent canvas at
`z-index: 1`, mirroring the procedural loader gradient exactly, so the WebGL
background pass takes over seamlessly. Their comment records that painting the
gradient on `<body>` let the solid colour flash through while the body box was
momentarily unsized, which is why it is a fixed div.

**HELORIA RELEVANCE.** Half-met and verified. With the `three` chunk stalled
2.5 s, Heloria's document already paints `rgb(5, 7, 10)`, matching the renderer
clear colour exactly, from a stylesheet link in `<head>`. **The continuity
principle is engineered, not accidental.** What does not exist is any content on
that first paint.

**WHEN TO IMPLEMENT.** The content question belongs with P4.

**WHY.** The hard part is already done. Keeping it done is a standing constraint:
the clear colour and the CSS background must never drift apart, which CLAUDE.md
section 7 already requires.

---

## P6. Small-viewport units where DOM must agree with a canvas

**ZERO OBSERVATION (OBSERVED, from their shipped comment).** They use `svh`, not
`vh`, for the pre-canvas placeholder, because the canvas sizes itself from
`window.innerHeight`, which on phones equals the small viewport while the URL
bar is visible, i.e. exactly at page load. Plain `vh` measures the large
viewport, so the DOM element rendered bigger and lower than the canvas element
drawn over it, and the mismatched fringes read as the number being cut.

**HELORIA RELEVANCE.** Not yet, precisely. Heloria has no DOM element that must
align with canvas content. It becomes relevant the moment the typography or the
loading counter exists.

**WHEN TO IMPLEMENT.** With the first DOM element that must align with something
drawn in the canvas.

**WHY.** It is a bug that only appears on a real phone at first paint, which is
the hardest place to catch it. Knowing the cause in advance costs nothing.

---

## P7. Texture memory is the real budget, not file size

**ZERO OBSERVATION (CONFIRMED).** "A 2048² texture still occupies around 16MB of
VRAM regardless of its file size. KTX2 with ETC1S compression stays compressed on
the GPU, uses much less memory, and uploads significantly faster."

**HELORIA RELEVANCE.** Direct, and currently the largest technical liability in
the asset. Heloria's GLB carries 526 KB of WebP that becomes roughly **51 MB of
GPU memory**, because three of the six images are 2048². The project's own
`docs/heloria-asset-spec.md` already mandates KTX2 and the export does not
comply.

**WHEN TO IMPLEMENT.** Before the asset ships in the real page.

**WHY.** On a mid-range phone this single prop would consume most of the texture
budget for the opening shot, and the file size gives no warning that it will.

---

## P8. Self-host every decoder

**ZERO OBSERVATION (CONFIRMED).** "The Draco and KTX2/Basis transcoders are
bundled in `public/vendor/` rather than loaded from a CDN. We learned that lesson
the hard way when a slowdown on `gstatic` and `unpkg` caused every compressed
asset to fail decoding, even though the assets themselves were hosted locally.
If your decoder lives on someone else's server, so does your pipeline."

**HELORIA RELEVANCE.** Applies the moment Draco or KTX2 is wired. A Draco GLB
already exists at 1.44 MB with no loader configured for it.

**WHEN TO IMPLEMENT.** In the same change that wires the first compressed asset.

**WHY.** It costs nothing at the time and is expensive to discover in
production.

---

## P9. A single deliberate tone-mapping point, and dithering

**ZERO OBSERVATION (CONFIRMED).** Their foreground pass applies film grain and
**the one** tone mapping, and the text pass composites after tone mapping
specifically to keep type crisp.

**HELORIA RELEVANCE.** Direct. Heloria currently has three different exposure
and view-transform settings across Blender, the production entry and the dev
harness, and no grain or dithering at all. With a near-black palette, banding is
close to guaranteed.

**WHEN TO IMPLEMENT.** With the first post-processing pass.

**WHY.** One tone-mapping point makes the Blender look transferable to the
browser. Dithering is not a style choice on this palette; it is what prevents
visible rings in every gradient.

---

## P10. Shader precision is a mobile correctness issue

**ZERO OBSERVATION (CONFIRMED).** "Several shaders had to be explicitly set to
`highp float` because many mobile GPUs, including Adreno and Mali, treat
`mediump` as a true 16 bit float. This caused bugs that never appeared on
desktop, such as all certificate strips moving identically or visible banding in
the burn effect."

**HELORIA RELEVANCE.** Applies to the first shader written, which is likely the
draw-circle stroke.

**WHEN TO IMPLEMENT.** At the first shader, as a written policy.

**WHY.** These failures are invisible on every machine this project is developed
on. A policy decided in advance costs one line per shader; discovered later it
costs a debugging campaign on borrowed hardware.

---

## P11. Synchronise sound to a rendered frame, not to a timer

**ZERO OBSERVATION (CONFIRMED).** The shatter sound is synchronised with the
first rendered frame rather than a timer, because on slower devices a timer can
play the audio before the animation is visible.

**HELORIA RELEVANCE.** Direct when audio arrives. Heloria's bloom has exactly
the same exposure: the reveal's first frame may wait on a shader compile or a
texture upload, and a timed sound will fire into a frame that has not appeared.

**WHEN TO IMPLEMENT.** With the first sound.

**WHY.** It is a one-line difference in where the cue is fired from, and it is
very hard to diagnose after the fact.

---

## P12. Hide the cost inside the gesture

**ZERO OBSERVATION (CONFIRMED).** During the glass shatter the renderer
temporarily lowers pixel ratio and disables blur and frost, "hiding the
performance cost within the gesture itself".

**HELORIA RELEVANCE.** Directly applicable to the hold. The bloom is the most
expensive moment in the planned interaction (two skinned meshes deforming, the
flower's 13 petal chains, plus whatever post-processing exists), and it is also
the moment the user is least able to notice a quality reduction, because they
are watching a specific thing happen.

**WHEN TO IMPLEMENT.** When the hold and the first post-processing pass both
exist.

**WHY.** It is the cheapest performance headroom available, and it requires the
quality axes to be designed as switchable from the start rather than retrofitted.

---

## P13. Refuse the expensive problem when the cheaper one gives the same result

**ZERO OBSERVATION (CONFIRMED).** "Real time lighting on a skinned mesh would
have been too expensive, and the lighting needed to match the original artwork
exactly. Instead, we baked the lighting into textures and blended between them."
Also: more than fifty individual images reduced to about a dozen atlases, and
"most gradient backgrounds were replaced with a few lines of GLSL".

**HELORIA RELEVANCE.** This is the principle Heloria should weigh most carefully
and is least likely to reach for.

Heloria has chosen real-time PBR on a skinned hand, which is the problem Zero
explicitly declined. That may still be right, because Heloria's hand has to sit
in a scene the user moves through rather than replay authored keyframes. But the
choice has to be *earned*: doc 08 shows the real-time path currently delivering
less than a baked image would, with no subsurface, a near-flat normal map,
uniform roughness and no contact shadow.

Heloria has already applied this principle well once: the flower carries its
entire colour scheme in a vertex attribute and ships **zero texture bytes**.
That is the same substitution Zero made when it replaced gradient images with
GLSL.

**WHEN TO IMPLEMENT.** As a standing question at every material decision, and
specifically as an explicit decision about the hand's shading approach before
more time is spent on it.

**WHY.** It is the difference between a scene that is expensive because it needs
to be and one that is expensive because nobody asked.

---

## What is deliberately not on this list

Recorded so their absence reads as a decision rather than an oversight:

- **GPU upload queue, `requestIdleCallback` draining, 256 px tiled uploads.**
  Zero built these against a measured 50 ms main-thread stall across dozens of
  textures. Heloria has three, in one asset. A single synchronous flush before
  the scene appears achieves the same result. Doc 10.
- **Texture atlasing.** Six images in one asset. Atlasing pays at dozens.
- **Adaptive quality manager.** There is currently one quality dial (pixel
  ratio) and it is hard-clamped. A manager with one dial is theatre.
- **Lazy loading and preload groups.** One asset, one stage.
- **An eight-pass post-processing chain.** Heloria needs three passes at most,
  and one of them (contact shadow) matters more than the other seven combined.
- **A custom cursor atlas, an XP meter, a scroll ruler, a loader counter.**
  These are Zero's interactions and CLAUDE.md section 1.1 forbids reproducing
  them. The problems they solve are real; the solutions are theirs.
