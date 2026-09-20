# Heloria Labs

A realtime WebGL experience, built as a single full-viewport canvas application
rather than a conventional page-based website.

Brand reference: https://www.helorialabs.com/

---

## Permanent quality benchmark

**https://why.zero.university/ is the permanent technical and visual quality
benchmark for this project.**

It must be consulted before every major visual, interaction, animation, asset,
shader and performance decision. This is not a one-off at the start of the
project; it is a standing obligation that applies to every such decision for as
long as the project runs.

Supporting technical case study:
https://tympanus.net/codrops/2026/07/17/zero-the-engineering-behind-a-defiant-interactive-narrative/

### The benchmark is a standard, not a template

"Refer to Zero" never means "make it look like Zero". It means: achieve the
same degree of deliberate art direction, technical control, interaction
quality, visual fidelity and performance engineering.

The result must clearly be Heloria. Never copy Zero's source code, assets,
copy, branding, exact interactions, layouts, typography, visual compositions or
licensed resources.

### Reference protocol

Before implementing any major visual, interaction, animation, scene,
transition, shader, asset system or UI system:

1. Inspect the benchmark.
2. Inspect the corresponding part of the current Heloria implementation.
3. Identify the relevant technical and visual principles the benchmark
   demonstrates.
4. Determine how the same principle can be expressed differently for Heloria.
5. Document the intended implementation before coding.
6. Implement.
7. Run the site.
8. Inspect the actual browser output.
9. Compare the result against the benchmark on quality, not literal appearance.
10. Identify the largest discrepancies.
11. Fix the largest discrepancies.
12. Inspect again.

Never skip steps 1 to 11 for a major feature.

### Checkpoint questions

Every major task begins by answering these:

- **Reference observation:** what does the benchmark do exceptionally well that
  is relevant here?
- **Heloria interpretation:** how should Heloria reach the same level of craft
  while remaining original?
- **Technical implementation:** what exact Three.js, GLSL, GSAP, CSS, asset or
  browser implementation will achieve it?
- **Quality test:** what would make this implementation look obviously worse
  than the benchmark?

Address the answers to the last question before proceeding.

---

## Current state

The project foundation only. There is deliberately no design, no hero scene, no
3D assets, no shaders, no animation, no navigation, no sections and no effects.

`src/core/App.ts` owns the renderer, the canvas, the frame timer and the
viewport contract. It renders an empty scene. Everything built on top of it
should go through it rather than creating a second renderer or a second render
loop.

## Stack

| Tool | Role |
| --- | --- |
| Vite | Dev server and production build |
| TypeScript | Strict, no emit; Vite handles transpilation |
| Three.js | Direct use, no wrapper |
| GSAP | Animation, once there is something to animate |
| Howler | Audio, once there is audio |
| vite-plugin-glsl | `.glsl`, `.vert`, `.frag`, `.vs`, `.fs` imports with `#include` |

Do not introduce Next.js, React Three Fiber, a website template, a UI framework
or a component library. Do not add any library without a concrete reason.

## Commands

```
npm install
npm run dev        # dev server
npm run typecheck  # tsc, no emit
npm run build      # typecheck, then production build
npm run preview    # serve the production build
```

## Standards

**Visual.** Do not accept generic 3D scenes, generic Three.js lighting, generic
GLSL effects, generic scroll animation, generic glassmorphism, stock-looking
assets, arbitrary particles, decorative noise, excessive bloom, excessive
gradients, fake futuristic UI, template layouts or AI-generated-looking
composition. If an effect has no clear purpose, remove it.

**Architecture.** One full-viewport WebGL canvas. A DOM and UI layer over the
canvas where appropriate. Virtual progression, scene lifecycle, scene
isolation, staged asset loading, adaptive quality, custom shaders,
post-processing, and synchronised animation and audio.

**Mobile.** Not an afterthought. Every major scene is checked at 390 x 844,
412 x 915 and 768 x 1024. The visual intention must survive. Reduce rendering
complexity rather than degrading the concept.

**Performance.** Apply Draco, KTX2 and Basis, texture atlases, staged GPU
uploads, `createImageBitmap`, `requestIdleCallback`, shader prewarming, lazy
initialisation, adaptive quality, scene teardown, memory management and mobile
shader precision where they improve the actual experience, not mechanically.

**Assets.** Never add an asset merely because it looks impressive. Every asset
needs a purpose, source, licence, production resolution, compression strategy,
target size and mobile strategy. Prefer Poly Haven, ambientCG, and Fab,
Megascans or Sketchfab where legally usable. Verify licensing.

**Working method.** Reference, specify, implement, run, inspect, compare,
critique, fix, inspect again, optimise, proceed. Never build a whole section
and move on because it works.

**Stop conditions.** Stop after a major stage if the visual direction is
unclear, asset requirements are unclear, the implementation looks generic, the
browser output differs materially in quality from the intended standard,
performance is unacceptable, or the architecture is becoming fragile. Fix the
underlying issue rather than papering over it with more effects.

---

The question is never "does this work?". It is "does this feel deliberately
authored and technically polished enough to stand beside a serious creative
WebGL project?".
