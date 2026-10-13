# 05 Flower audit

**Audit only. Neither the generator nor the master was modified.**

---

## 1. Is it a bespoke authored asset or a basic procedural object?

**Bespoke and procedurally generated are not opposites here, and the distinction
the question is really asking about resolves in the asset's favour, with one
serious caveat.**

The flower is produced by `tools/create_heloria_flower.py`, 726 lines, from a
fixed seed (`SEED = 20260920`). It is not downloaded, not from a marketplace,
and not a primitive with a modifier stack. What makes it authored rather than
generic is that the generator encodes specific botanical decisions:

- A width profile with a narrow claw at the base, the widest point past halfway,
  and a drawn point at the tip, rather than an ellipse.
- A spine integrated from a pitch and a curl that accelerates towards the tip,
  with a small terminal lift, so petals recurve instead of bending like card.
- A raised median ridge that breaks into five shallow veins towards the tip,
  modelled **into the geometry** so it survives any renderer.
- Per-petal perturbation of yaw, length, width, pitch, curl, twist, cup,
  asymmetry, tip lift, ridge depth and colour tint, all drawn from the seeded
  PRNG.

The caveat is section 5: at intermediate openness the result currently does not
read as a flower.

---

## 2. Measured structure

From the master, read with `bpy`:

| Property | Value |
| --- | --- |
| Mesh vertices (pre-solidify) | 3,504 |
| Polygons (pre-solidify) | 2,903 |
| Triangles (pre-solidify) | 5,884 |
| Vertices (evaluated, with Solidify) | 7,008 |
| Triangles (evaluated) | 13,796 |
| Materials | `HELORIA_PETAL`, `HELORIA_CENTRE`, `HELORIA_STEM`, `HELORIA_SEPAL` |
| Colour attribute | `Col` (FLOAT_COLOR, point domain) |
| Modifiers | Armature, then Solidify (`PetalThickness`) |
| Armature bones | **29** |
| Petal chains | **13** (8 primary + 5 secondary), two bones each |
| Other bones | `flower_root`, `flower_stem`, `flower_centre` |
| Scale in the master | 1.15 on the anchor |

Composition, as required by the task: 8 primary petals, a 5-petal secondary
inner whorl, a receptacle dome with 36 stamens in two whorls, 5 sepals, and a
short stem (0.60 units before scaling).

**Petal resolution:** each petal is a 14 x 9 grid, so 13 x 8 quads per sheet.
That is enough for the two-bone chain to bend it as a continuous surface rather
than a hinge, which was the requirement.

**Independent control:** verified. Each petal has `petal_pN_base` /
`petal_pN_tip` (and `_sN_` for the inner whorl), with vertex weights blended by
a smoothstep across the petal length rather than a hard split.

---

## 3. Asymmetry: measured, not asserted

The generator draws per-petal values from the seeded PRNG within these ranges:

| Parameter | Primary range | Purpose |
| --- | --- | --- |
| Yaw offset | ±0.085 rad (±4.9 deg) | breaks even angular spacing |
| Length | ±7% | no two petals the same size |
| Width | ±8% | |
| Pitch | 52 to 62 deg | how steeply it leaves the receptacle |
| Curl | 74 to 92 deg | total bend, base to tip |
| Twist | ±9 deg | |
| Cup | 0.30 to 0.46 | cross-sectional concavity |
| Edge asymmetry | ±0.13 | one edge runs wider than the other |
| Tip lift | 0.04 to 0.13 | terminal recurve |
| Ridge depth | 0.055 to 0.085 | |
| Colour tint | ±0.035 | per-petal shift in the vertex colour |

There is **no exact radial symmetry** anywhere in the result. The bloom
animation adds a second layer of variation: a staggered phase per petal
(`petal_phase`, an alternating lead/lag around the whorl rather than a sweep)
plus per-petal rotation gains modulated by `sin(index * 2.399)` and
`cos(index * 1.732)`, so no two petals travel the same distance at the same
time.

---

## 4. Materials

Four Principled materials, no photographic textures anywhere.

| Material | Base colour | Roughness | Subsurface | Bump |
| --- | --- | --- | --- | --- |
| PETAL | vertex attribute `Col`, multiplied | 0.38 | 0.34, radius (0.62, 0.42, 0.52), scale 0.10 | noise, strength 0.22, scale 70 |
| CENTRE | vertex attribute `Col` | 0.56 | 0.12 | noise, strength 0.34, scale 190 |
| STEM | (0.128, 0.152, 0.088) | 0.60 | 0.18 | noise, strength 0.28 |
| SEPAL | (0.150, 0.172, 0.101) | 0.52 | 0.26 | noise, strength 0.24 |

Colour is carried in the mesh rather than in a texture: a base-to-tip gradient
from a desaturated violet (0.470, 0.430, 0.520) to a warm bone white
(0.905, 0.887, 0.858), offset per petal. The stamens carry their own colours in
the same attribute, filament to anther. The consequence is that the flower costs
**zero texture bytes and zero texture memory**, which is a genuinely good
decision and is the opposite of the trap the hand fell into (doc 07).

Nothing here is plastic, neon, over-glossy or over-saturated: roughness sits
between 0.38 and 0.60 and the most saturated value in the asset is a muted
green.

### F-01 Subsurface does not survive export. **High.**

The GLB declares `KHR_materials_specular` and `KHR_materials_ior` only. There is
no `KHR_materials_transmission` and no `KHR_materials_volume`. The petal
subsurface weight of 0.34 exists **only in Blender**.

- **Consequence:** in the browser the petals are fully opaque. Petal thickness
  and translucency, which are what make a white flower read as living tissue
  rather than as painted card, are absent from the web asset.
- **Visible in evidence:** compare the Cycles render (petals glow where light
  passes through) with the Three.js capture (petals read as flat white card).

---

## 5. Behaviour at 0, 25, 50, 75 and 100 percent

Measured from the evaluated mesh, about the anchor axis, in file units:

| bloomProgress | max radius | axial min | axial max | verts inside the hand | deepest penetration |
| --- | --- | --- | --- | --- | --- |
| 0.00 | 1.169 | -0.771 | 2.760 | **168 (2.40%)** | **0.483 units (4.8 mm)** |
| 0.25 | 1.169 | -0.771 | 2.760 | **123 (1.76%)** | **0.387 units (3.9 mm)** |
| 0.50 | 1.121 | -0.771 | 2.774 | 0 | 0 |
| 0.75 | 2.225 | -0.771 | 2.174 | 0 | 0 |
| 1.00 | 2.869 | -0.771 | 1.602 | 0 | 0 |

Penetration was measured by building a BVH from the evaluated hand mesh and
testing every flower vertex against the nearest surface normal, not by eye.

### What this confirms

- The bud is genuinely closed at 0 and 0.25: radius 1.17 units against 2.87 open,
  so it occupies 41% of its final width. It is a bud, not a shrunken flower.
- The opening is progressive and correctly lagged: **no radial change at all
  until after 0.25**, first growth by 0.50 is negative (1.169 to 1.121, the
  petals tightening slightly as they begin to rotate), then 2.225 at 0.75 and
  2.869 at 1.00. The flower genuinely trails the hand.
- Axial extent falls from 2.760 to 1.602 as the bud unwraps into a disc, which
  is the correct behaviour.

### F-02 The flower intersects the hand when closed. **High.**

168 vertices, 2.4% of the mesh, sit inside the hand at `bloomProgress = 0`, up
to 4.8 mm deep; 123 vertices at 0.25.

- **Why it matters:** acceptance criterion 6 states the flower must never
  penetrate the palm. It does. Today it is masked because the same geometry that
  it penetrates also hides it, but the hand material carries subsurface
  scattering (0.22 in Blender), and intersecting geometry inside a scattering
  surface can read as a dark patch. It also means any future change to the
  closed pose, the flower scale or the camera can expose it.
- **Cause:** the closed bud (2.76 units tall, 1.17 radius) is larger than the
  cavity the current closed hand actually forms, which doc 04 P-02 shows is a
  loose claw rather than a closed cup.
- **Note:** P-02 and F-02 have the same root cause and are likely fixed by the
  same change.

### F-03 At 50% the flower reads as a crumpled mass. **High.**

This is the clearest visual defect in the asset work. In the Three.js capture at
`bloomProgress = 0.5` the flower is a screwed-up white shape with no readable
petal separation.

- **Cause, from the measured data:** at 0.50 the flower is at *flower* openness
  0.16 (from the synchronisation table), which is inside the window where the
  petals have begun to rotate but have not separated. With 13 petals wrapped
  into a 1.12-unit radius and a petal thickness of only 0.022 units, adjacent
  petals interpenetrate.
- **Why it matters:** 0.50 is the midpoint of the reveal, the exact moment the
  task specifies as "first clear glimpse of the flower". The first glimpse
  currently shows something unreadable.
- **Severity: High.** It is the single most damaging visual defect found.

---

## 6. Suitability for close-up rendering

| Criterion | Finding |
| --- | --- |
| Topology | 14 x 9 grid per petal, smooth-shaded, deforms without faceting on the silhouette. **Adequate.** |
| Thickness | Solidify at 0.022 units (0.22 mm) with even offset and rim. Reads as a real edge in the Cycles renders. **Adequate.** |
| Centre | 36 stamens in two whorls, hexagonal in section, with a swollen anther and its own colour. Good in Blender; in the browser the anthers are barely differentiated. **Adequate, weak in WebGL.** |
| Sepals | Five, generated by the same petal function with a negative pitch. They read as separate green leaves rather than as a calyx clasping the receptacle. **Weak.** |
| Stem | Shortened to 0.60 units so it does not pass through the palm. Tapered, leaning, 10-sided. Almost entirely occluded in practice. **Adequate.** |
| Scale | 40 mm at the original 0.82 scale read as a brooch; at the current 1.15 the open flower is about 55 mm across in a roughly 90 mm palm. **Correct now.** |
| Translucency | Present in Blender, absent in the GLB (F-01). **Fails for the web.** |
| Roughness | 0.38 to 0.60, no excessive gloss. **Good.** |

### F-04 The sepals read as detached leaves. **Medium.**

Visible in the Three.js capture at 0.50, where two green ovals sit beside the
white mass rather than beneath it. They are generated with the petal function at
a negative pitch, which gives them a petal's silhouette rather than a sepal's.

### F-05 Petal bud interpenetration is not managed. **Medium, and the cause of F-03.**

The closing animation rotates each petal about its local X and adds a 12-degree
spiral about local Y, but nothing prevents adjacent petals from occupying the
same space when wrapped. A real bud overlaps in a consistent direction, like a
clenched spiral.

---

## 7. Verdict

The flower is a genuinely bespoke, reproducible, well-parameterised asset with
correct scale, real asymmetry, sound topology, independent petal control, a
correctly lagged bloom, and a texture-free colour strategy that costs nothing to
ship.

It has one defect serious enough to block the reveal from working as intended
(F-03, the unreadable mid-bloom), one correctness defect (F-02, penetration when
closed), and one export gap that removes the quality that most distinguishes a
petal from a piece of card (F-01, no translucency in the GLB).

**Open state: ready. Closed state: ready but intersecting. Intermediate states:
not ready.**
