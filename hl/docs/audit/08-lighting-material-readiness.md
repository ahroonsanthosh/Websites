# 08 Lighting and material readiness

**Audit only. No material, light or HDRI was modified.**

---

## 1. The HDRI: it is not in the repository

The task refers to `syferfontein_6d_clear_puresky_4k.exr` as "the project's
HDRI". **No `.exr` or `.hdr` file exists anywhere in the repository**, verified
by extension search. There is no `public/hdr/` directory.

What exists instead:

- `tools/render_tests.py` has an `hdri` lighting mode that looks for
  `assets/source/hdri/syferfontein_6d_clear_puresky_1k.exr`. When the file is
  absent it prints a notice and falls back to Blender's Nishita physical sky.
  **That fallback path is what would run today.**
- The Three.js side uses `RoomEnvironment`, a procedural studio box generated at
  runtime. No HDRI is involved at all.
- All Blender renders produced so far used the **studio** mode: a four-light set
  (key, fill, rim, bounce) against a dark world, not the HDRI.

So the HDRI has never been used, and no judgement about it can be based on
observed output. What follows is an assessment of the candidate, consistent with
the evaluation already recorded in `docs/heloria-asset-spec.md` section 7.

### Verified provenance of the candidate

From the Poly Haven asset page: Syferfontein 6d Clear (Pure Sky), **CC0**,
authors Greg Zaal with sky edits by Jarod Guest, a sky-only edit of
`syferfontein_6d_clear`. Published at 1K, 2K, 4K, 8K and 16K in EXR and HDR.
Metadata: 21 EVs, 5400K white balance. Described as a clear low-contrast
sunrise: soft golden horizon, cool blue sky, subtle haze.

**The 4K EXR is 73.95 MB.**

### Is it appropriate?

| Use | Verdict | Reasoning |
| --- | --- | --- |
| **Prototype** | **Acceptable** | CC0, well made, no licensing friction. Fine for checking that materials respond to an environment at all. |
| **Final hand shot** | **Probably not** | A clear-sky HDRI has one hard sun and a large blue dome. Skin lit by it goes warm-gold on the lit side and blue in shadow. That is a palette decision being made by a photograph of South Africa rather than by a designer, and it fights the near-monochrome, institutional brand recorded in `docs/heloria-brand-analysis.md`. |
| **Final flower shot** | **No** | The flower is white and its whole quality depends on translucency and delicate shading. A single hard sun blows the lit petals and leaves the rest flat. It wants a large soft source and real bounce. |
| **Shipped as an asset** | **Never in this form** | 73.95 MB is 12x the project's entire desktop transfer budget. |

A further structural objection: it is a **sky-only** edit, so there is no ground
in the environment and therefore no bounce from below. The underside of the
fingers and the underside of the flower receive almost nothing. Every render so
far has needed an explicit bounce light for exactly this reason.

### Recommendation, unchanged from the asset spec

Use 1K, not 4K, as an authoring input; ship only a prefiltered derivative
(256 px cube faces, KTX2); and seriously evaluate a **synthesised** environment
before committing, because it removes the asset, costs nothing to transfer, and
can be tuned to Heloria's palette rather than to a photograph.

---

## 2. Current materials, as they actually exist

### In Blender (the master)

| Material | Model | Notes |
| --- | --- | --- |
| `HELORIA_SKIN` | Principled, fully procedural | Mottled base from noise scale 6.5 through a low-contrast ramp; fine capillary overlay at 0.10; pore bump from voronoi scale 95 blended with noise scale 210, strength 0.10, distance 0.008; roughness mapped from noise 3.4 into 0.34 to 0.56; **subsurface 0.22**, radius (1.0, 0.32, 0.20), scale 0.35; IOR 1.40. |
| `HELORIA_NAIL` | Principled | Roughness 0.20, subsurface 0.28, coat 0.35. |
| `HELORIA_PETAL` | Principled + vertex colour | Roughness 0.38, **subsurface 0.34**, IOR 1.40, subtle noise bump. |
| `HELORIA_CENTRE` / `STEM` / `SEPAL` | Principled | Roughness 0.52 to 0.60, subsurface 0.12 to 0.26. |

The master contains **no images**. Everything above is procedural.

### In the GLB (what the browser actually gets)

| Aspect | Blender | GLB |
| --- | --- | --- |
| Skin base colour | procedural | baked 2048² WebP |
| Skin roughness | procedural, 0.34 to 0.56 | baked 2048² WebP |
| Skin normal | procedural bump | baked 2048² WebP, nearly flat (14 KB) |
| Skin subsurface | **0.22** | **absent** |
| Petal colour | vertex attribute | vertex attribute (preserved) |
| Petal subsurface | **0.34** | **absent** |
| Sided-ness | per material | **all six double-sided** |

---

## 3. Why the current result looks CG

Observed from the Three.js capture at `bloomProgress = 0.5`, and traced to
causes rather than described.

### M-01 The skin has no subsurface scattering. **High.**

Skin is translucent. Light enters, scatters a few millimetres, and leaves
reddened, which is why fingers glow at the edges and why shadow terminators on
skin are soft and warm. The GLB has none of this: the hand is a diffuse surface
with a colour map. **This is the single largest reason it reads as vinyl.**

### M-02 Roughness variation is too narrow and too smooth. **Medium.**

The baked range is 0.34 to 0.56 driven by one low-frequency noise. Real skin
varies sharply and locally: knuckles and fingertips are glossier, the palm is
matte, creases are darker and rougher. A smooth field across the whole hand
gives a uniform sheen, which reads as a moulded object.

### M-03 The normal map carries almost no information. **Medium.**

14.1 KB at 2048². There is effectively no pore structure, no fine wrinkle, no
knuckle detail. At close range the surface has nothing for grazing light to
catch, so the hand looks smoothed rather than detailed.

### M-04 Palm creases read as drawn lines. **Medium.**

The creases visible in the render come from the baked colour map, not from
geometry or normals. A crease that is only a dark line does not shade
correctly: it does not catch light on one side and occlude on the other. It
looks like ink on a surface.

### M-05 There is no contact shadow and no ambient occlusion. **High.**

Nothing darkens where the flower meets the palm, between the fingers, or in the
crease of the cupped hand. Contact shadowing is the primary cue that two objects
are touching. Without it the flower reads as pasted onto the palm.

### M-06 The environment is a generic studio box. **Medium.**

`RoomEnvironment` is a Three.js utility that generates a small room with a few
emissive panels. It is a convenience for previewing, not a lighting design. It
gives a broadly plausible but characterless result with no directional intent,
no colour story, and no relationship to Heloria.

### M-07 Double-sided everything. **Medium.**

Correct for petals, wrong for skin and nails. Beyond the fragment cost, it means
backfaces are lit and can contribute to the silhouette edge.

### M-08 Exposure is not a controlled value. **Medium.**

The production entry leaves `toneMappingExposure` at its default; the dev
harness sets 1.05. Blender renders use AgX with Base Contrast. Three different
looks are in play across three surfaces, so lighting decided in one does not
transfer to another.

---

## 4. Against the benchmark's material and lighting sophistication

The comparison is more interesting than "ours is worse", because the benchmark
solved this problem by **refusing it**.

From the article (CONFIRMED):

> "Real time lighting on a skinned mesh would have been too expensive, and the
> lighting needed to match the original artwork exactly. Instead, we baked the
> lighting into textures and blended between them. Two texture slots are used,
> with the incoming slot updated for each keyframe and smoothly crossfaded."

and, on the visible craft of their surfaces, from the shipped stylesheet: a
single HUD control is assembled from seven stacked layers (fill, colour-burn
fill, soft inset highlight, strong inset highlight, plus-lighter edge light,
overlay edge dark, darken inner glow) over a saturating backdrop blur.

Two conclusions:

1. **Their hands are lit images, not lit geometry.** Their quality comes from
   art direction baked at production time, plus a crossfade and an atlas. They
   pay a fixed, predictable cost and get exactly the look that was drawn.
2. **Where they do shade, they build it from many small correct observations**,
   not from one effect.

Heloria has chosen real-time PBR, which is the harder and more flexible path.
The gap is therefore not "we should bake like they did" (our hand has to respond
to a scene the user moves through). The gap is that a real-time approach has to
earn its keep, and right now it is delivering *less* than a baked image would:
no subsurface, a flat normal map, uniform roughness, no contact shadow, and a
placeholder environment.

---

## 5. Are the assets prepared for high-end PBR?

| Requirement | Ready? |
| --- | --- |
| Clean geometry at sufficient density | **Yes.** 33k triangles for the hand at subdivision 1, 13.8k for the flower. |
| A usable UV set for baking | **Yes**, but machine-generated at export by Smart UV Project, so seams are not art-directed. Adequate for a subtle skin; a limitation for detailed maps. |
| Separate materials for distinct surfaces | **Yes.** Six, correctly separated. |
| Real-world scale | **Yes.** 137 mm hand, verified in the browser. |
| Colour carried without textures where possible | **Yes**, for the whole flower. |
| Subsurface path to the web | **No.** |
| Detail normal path | **No.** Present in name only. |
| Contact shadow / AO strategy | **No.** None. |
| A deliberate environment | **No.** Placeholder. |
| A single exposure and view transform policy | **No.** Three different ones in play. |

---

## 6. Verdict

**Geometry and material separation are ready. Shading and lighting are not
started.**

Nothing in the assets blocks high-end PBR; what is missing is the shading and
lighting work itself, and it is that work, not the models, that currently keeps
the result looking CG.

Priority order, by visible effect per unit of work:

1. Contact shadowing and occlusion (M-05), the cheapest large gain
2. Subsurface or a credible approximation on skin (M-01)
3. A designed environment replacing `RoomEnvironment` (M-06)
4. Real roughness and normal detail (M-02, M-03, M-04)
5. A single exposure policy (M-08)
6. Correct sided-ness (M-07)

The HDRI question can wait, because the answer depends on decision 3, and the
current candidate is most likely the wrong answer to it.
