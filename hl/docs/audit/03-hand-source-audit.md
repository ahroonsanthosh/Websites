# 03 Hand source asset audit

**Audit only. The source .blend was opened read-only and never written to.**

A full technical inventory of this file already exists at
`docs/hand-source-analysis.md`, produced by direct `bpy` inspection. This
document does not repeat it. It states the measured facts needed for a
judgement, and then judges **technical suitability** for what Heloria intends:
a cinematic close-up of a hand opening to reveal a flower.

---

## 1. Provenance and licensing

| Field | Value |
| --- | --- |
| Stated source | https://www.turbosquid.com/Download/2564269_97038407 |
| File in repository | `assets/source/hand/Do_HandRigged_detailrender_shared_2026_04_01_FullFunction.blend` |
| Size / md5 | 1,985,362 bytes / `48c88615d95877a0c9d15957d259a051` |
| Written by | Blender 4.5.91 |
| Status in this project | **PROTOTYPE ONLY** |
| Cleared for Heloria commercial deployment | **No** |
| Licence terms | **Not recorded in the file and not verified.** No embedded licence text, no copyright property, no author metadata. |

The URL is a download endpoint rather than a product page, so the licence tier
actually purchased cannot be established from it. This asset must not be
described as commercially cleared. The pipeline dependency on it is narrow
(see section 6), which is the mitigating fact.

---

## 2. Measured inventory

| Property | `Hand` | `Nails` |
| --- | --- | --- |
| Vertices | 2,829 | 178 |
| Polygons / triangles | 5,534 / 5,534 | 256 / 256 |
| UV layers | `UVmap` | `UVmap` |
| Material | `Skin_caucasian` | `Nails_caucasian` |
| Custom split normals | none | none |
| Shape keys | none | none |
| Vertex groups | 21 | 21 |
| Modifiers | Armature | Armature |

Armature `Rig` / `Hand_Armature`: **21 bones**, root `radius_ulna`, four finger
chains of `meta / prox / midd / dist` plus a thumb chain of
`trapez / meta / prox / dist`. All deform, all connected.

Scale: the file is metric-metres by declaration but the hand measures
16.77 x 5.40 x 22.95 units, i.e. **modelled in centimetres labelled as metres**.

Orientation: palm faces -Y, fingers run +Z, thumb sits at -X. This is a **right
hand**, confirmed by render.

Constraints: 21 `LIMIT_ROTATION` (local space, influence 1.0) plus four
`COPY_ROTATION` targeting `midd_meta` on `index_meta`, `ring_meta`,
`pinky_meta` (influence 1.0) and `thumb_trapez` (0.8).

Existing animation: one action, `Pose_OK`, frames 1 to 60, 198 F-curves.
Sampling frames 1, 20, 40 and 60 returns **identical rotations**, so it is a
held static pose, not an animation. The pose is the "OK" gesture.

Textures: **ten image datablocks, all unpacked, all missing, all reporting
0 x 0.** The relative paths point outside the file to a
`Upload_2026_02_24_TurboSquid/Texture/` directory that does not exist. Texture
resolutions are therefore **unknown and unrecoverable from this file.**

---

## 3. Suitability against what Zero does with hands

The benchmark's approach is documented, not guessed. From the engineering
article (CONFIRMED):

> "Real time lighting on a skinned mesh would have been too expensive, and the
> lighting needed to match the original artwork exactly. Instead, we baked the
> lighting into textures and blended between them."

and

> "all of the hand textures are packed into a single 4x4 atlas, with each mesh
> using UV offsets and scaling to reference its own section."

Two consequences for this audit:

1. Zero's hands are **not physically lit at runtime at all.** They are lit
   images, crossfaded between keyframes with premultiplied alpha, in one atlas.
   Their hand quality is an *art* pipeline, not a shading pipeline.
2. Heloria has chosen the opposite: a real-time PBR skinned mesh under an
   environment. That is a legitimate and different decision, but it means
   Heloria is taking on a problem Zero explicitly refused, and must clear a
   higher bar in materials and lighting to reach a comparable result.

This is the single most important finding in the whole audit for how the hand
should be approached, and it is recorded again in doc 11.

---

## 4. Technical suitability, criterion by criterion

| Criterion | Finding | Verdict |
| --- | --- | --- |
| **Anatomy** | Proportions are plausible: metacarpal lengths 7.8 to 8.8 units, proximal phalanges 3.4 to 5.4, a correctly offset thumb chain. Joint limits encode real hinge behaviour (middle and distal joints constrained to ±2 degrees off-axis). | **Suitable** |
| **Silhouette** | At 5,534 triangles the raw silhouette facets visibly on finger edges in a close-up. One subdivision level (33,204 triangles evaluated) resolves it; two (used for Cycles) is comfortable. | **Suitable with subdivision**, which the production file already applies |
| **Topology** | Fully triangulated, so it subdivides as a triangle mesh rather than a quad cage. Acceptable for a prop at this scale; it is not a mesh you would want to re-sculpt. | **Adequate, not good** |
| **Deformation potential** | 21 vertex groups against 21 bones, weights present and functioning. Bends at the measured poses produce no visible collapse at the knuckles. | **Suitable** |
| **Finger control** | Four independent finger chains on a known single flexion axis (local Z), with published limits. Very workable. | **Good** |
| **Thumb control** | **Compromised as shipped.** `thumb_trapez` copies `midd_meta` at 0.8 influence, so the thumb cannot be posed independently. The production build sets that influence to 0 on its own copy. | **Requires the documented workaround** |
| **Metacarpal control** | `index_meta`, `ring_meta` and `pinky_meta` are fully overwritten by `midd_meta`. All four metacarpals must cup together. Anatomically defensible, but it removes per-finger palm shaping. | **Constrained** |
| **Skin realism** | **The asset supplies none.** Every texture is missing. There is no albedo, no roughness variation, no normal detail, no pore data of any kind. Everything visible in the current renders is procedurally authored by this project. | **Not supplied; must be authored** |
| **Close-up suitability** | Geometry holds up under subdivision. What fails a close-up is the absent texture set, which is exactly what a close-up examines. | **Geometry yes, surface no** |
| **Camera suitability** | The forearm terminates in a **flat cut stump** at z ≈ 0 with no interior and no wrist detail. Any framing that includes it shows a severed cylinder. | **Constrains framing** |
| **Animation potential** | No usable animation ships with it. `Pose_OK` is a static vendor gesture. All motion must be authored. | **Blank slate, which is fine** |
| **WebGL suitability** | Low vertex count, one UV set, one armature, 21 joints: well within any mobile skinning budget. The tiled UV layout (u -21.9 to 22.9) cannot be baked into and required a second packed UV set. | **Suitable with the UV workaround** |

---

## 5. Problems carried by the source asset

| ID | Problem | Severity | Notes |
| --- | --- | --- | --- |
| H-S1 | All ten textures missing; resolutions unknown | **High** | Forces a fully authored surface. Already worked around procedurally, but it means the vendor asset contributes geometry only. |
| H-S2 | UV layout tiled far outside 0..1 | Medium | Cannot be baked into. Worked around with a Smart UV Project set at export. The packed set is machine-generated, so seam placement is not art-directed. |
| H-S3 | `thumb_trapez` copy-rotation at 0.8 | Medium | Worked around by zeroing influence. |
| H-S4 | Three metacarpals fully constrained to `midd_meta` | Low | Anatomically reasonable; removes shaping freedom. |
| H-S5 | Flat forearm stump | Medium | Permanently constrains camera and composition, or requires a cuff, fade or crop. |
| H-S6 | Fully triangulated topology | Low | Limits re-sculpting; fine for the intended use. |
| H-S7 | Licence unverified, prototype only | **High (commercial)** | Not a technical blocker. A release blocker. |

---

## 6. Replaceability

The asset's blast radius is genuinely small, which is the strongest argument for
proceeding with it as a prototype. A commercially licensed replacement is a
drop-in if it provides:

1. A right hand oriented palm -Y, fingers +Z, thumb -X (or a transform to it).
2. Finger chains flexing on one known axis, plus a palm bone equivalent to
   `midd_meta` for `HeloriaFlowerAnchor` to hang from.
3. Bone names matching the table in `docs/hand-source-analysis.md` section 6, or
   a rename map applied in `tools/build_hand_flower.py`.
4. A triangle count in the same order (about 5k pre-subdivision).

Nothing else depends on this specific file. The flower generator, the anchor,
the synchronisation curve, the export and the entire Three.js side are
independent of it. `tools/build_hand_flower.py` is the only file that names it.

---

## 7. Verdict

**Technically suitable as a prototype. Not suitable as a shipped asset**, on
licensing grounds first and surface-quality grounds second.

The geometry and rig are good enough to build the whole interaction on, and the
interaction work done against them transfers to a replacement. The absent
texture set means this asset supplies a shape and a skeleton and nothing else,
so every judgement about "how real the hand looks" in later documents is a
judgement about work this project authored, not about the vendor asset.
