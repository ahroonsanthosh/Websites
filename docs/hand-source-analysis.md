# Hand Source Analysis

Everything below was read out of the .blend file itself with the Blender
Python API (Blender 4.5.14 LTS, `bpy` module, headless). Nothing here is
inferred from the filename, the vendor page or the preview image.

---

## 1. Locating the file

The task said the hand had already been downloaded into the project. **It had
not.** A search of the repository found no `.blend` file anywhere:

```
$ find /home/user/hl -name "*.blend"
(no results)
```

The only copy present on the machine was the file attached to the request:

```
/root/.claude/uploads/.../ee8a8b91-Do_HandRigged_detailrender_shared_2026_04_01_FullFunction.blend
```

That file was copied, unmodified, to:

```
assets/source/hand/Do_HandRigged_detailrender_shared_2026_04_01_FullFunction.blend
```

Both copies verified identical (`md5 48c88615d95877a0c9d15957d259a051`,
1,985,362 bytes). The source copy is read-only input: every tool in `tools/`
opens it and saves elsewhere. It is never written back to.

---

## 2. Licensing status

| Field | Value |
| --- | --- |
| Stated source | https://www.turbosquid.com/Download/2564269_97038407 |
| Status in this project | **PROTOTYPE ONLY** |
| Cleared for Heloria commercial production | **No** |
| Licence terms | Not recorded in the .blend file and not verified by this analysis |

The file carries no embedded licence text, no copyright custom property and no
author metadata. The download URL above is the only provenance we have, and it
is a download endpoint rather than a product page, so the licence tier actually
purchased cannot be confirmed from it.

**Rule for this project:** the hand is a prototype stand-in. It must not be
presented as cleared for commercial deployment, and the production pipeline
must allow it to be swapped for a commercially licensed equivalent without
changing the scene architecture. Section 8 records what a replacement has to
match for that swap to be a drop-in.

---

## 3. File and scene

| Property | Value |
| --- | --- |
| Blender version that wrote the file | 4.5.91 |
| Scene name | `Scene` |
| Unit system | Metric, `scale_length` 1.0, length unit metres |
| Frame rate | 24 fps |
| Frame range | 1 to 150 |
| Render engine | Cycles |
| Render resolution | 1920 x 1200 |
| Collections | `Do_HandModel` |
| Worlds | `World`, node-based, a single Background node |
| Node groups | none |

**Scale warning.** The units say metres but the hand measures
16.77 x 5.40 x 22.95 units. The model is authored at **centimetre scale
labelled as metres**: a 23-unit hand is a 230 mm hand. Everything downstream
has to account for this. The web export multiplies the rig by 0.01 so the GLB
is in real metres (measured bounding box in Three.js: 0.104 x 0.137 x 0.130 m).

---

## 4. Objects

| Object | Type | Data | Parent | Modifiers |
| --- | --- | --- | --- | --- |
| `Hand` | MESH | `Hand_Mesh` | `Rig` | Armature |
| `Nails` | MESH | `Nails_Mesh` | `Rig` | Armature |
| `Rig` | ARMATURE | `Hand_Armature` | none | none |

All three sit at the origin with identity rotation and unit scale.

### Mesh detail

| | `Hand` | `Nails` |
| --- | --- | --- |
| Vertices | 2,829 | 178 |
| Polygons | 5,534 | 256 |
| Triangles | 5,534 (fully triangulated) | 256 |
| UV layers | `UVmap` | `UVmap` |
| Colour attributes | `Attribute` | `Attribute` |
| Material slots | `Skin_caucasian`, empty | empty, `Nails_caucasian` |
| Shading | smooth | smooth |
| Custom split normals | **no** | **no** |
| Vertex groups | 21 | 21 |
| Shape keys | none | none |

Bounds, in file units:

```
Hand   x -12.45 .. 4.32   y -2.91 .. 2.49   z -0.23 .. 22.72
Nails  x -12.54 .. 4.23   y -0.48 .. 0.69   z 10.37 .. 22.81
```

**UV layout is not usable for baking.** The `UVmap` layer runs from
u -21.9 to 22.9 and v -21.3 to 22.3 across 16,602 loops. It is a tiled layout
built for the vendor's tiling texture set, not a packed 0..1 unwrap. Any bake
needs a second, packed UV set, which is what `tools/export_glb.py` creates
(`bake_uv`, via Smart UV Project).

---

## 5. Orientation and handedness

Determined geometrically, then confirmed by render.

- Hand mesh centroid: (-2.949, -0.536, 11.763)
- Nails mesh centroid: (-3.498, 0.078, 18.851)

The nails sit on the **+Y** side, so **+Y is dorsal and the palm faces -Y**.
Fingers run along **+Z** (bone heads at z 3.4, fingertips near z 22.8). The
thumb is on the **-X** side (thumb bones from x -6.5 to -10.8).

A render from -Y with the camera's up aligned to +Z puts the palm towards the
viewer, fingers up, and the thumb on the viewer's left. That is a **right
hand**.

The forearm is cut off at a flat stump at the wrist (z near 0). There is no
arm, no wrist detail on the cut, and the cut is visible if it enters frame, so
the shot has to crop below it.

---

## 6. Armature

`Rig` / `Hand_Armature`, **21 bones**, all deform-enabled and all connected.
Root is `radius_ulna`.

```
radius_ulna                    len 3.563
├─ index_meta     len 8.759
│  └─ index_prox  len 5.168
│     └─ index_midd  len 2.735
│        └─ index_dist  len 2.278
├─ midd_meta      len 8.272
│  └─ midd_prox   len 5.397
│     └─ midd_midd   len 3.210
│        └─ midd_dist   len 2.365
├─ ring_meta      len 7.821
│  └─ ring_prox   len 4.913
│     └─ ring_midd   len 2.791
│        └─ ring_dist   len 2.335
├─ pinky_meta     len 7.906
│  └─ pinky_prox  len 3.438
│     └─ pinky_midd  len 1.830
│        └─ pinky_dist  len 1.700
└─ thumb_trapez   len 5.774
   └─ thumb_meta  len 3.152
      └─ thumb_prox  len 3.119
         └─ thumb_dist  len 2.349
```

All four finger metacarpals share a head at (-1.079, 0.188, 3.404), as does
`thumb_trapez`. Pose bone rotation modes are mixed: some QUATERNION, some XYZ.

### Flexion axis

Every finger bone's **local Z** is the flexion axis, which is stated by the
rig's own limit constraints rather than assumed:

| Bone class | X limit | Y limit | Z limit |
| --- | --- | --- | --- |
| `*_meta` | -20 .. 20 | 0 .. 0 | -90 .. 80 |
| `*_prox` | -20..-30 .. 25..30 | -10 .. 10 | -60 .. 120 |
| `*_midd` | -2 .. 2 | -2 .. 2 | -2 .. 120 |
| `*_dist` | -2 .. 2 | -2 .. 2 | -10 .. 90 |
| `thumb_trapez` | -20 .. 20 | 0 .. 0 | -30 .. 175 |
| `thumb_meta` | -10 .. 35 | -20 .. 20 | -20 .. 55 |
| `thumb_prox` | -10 .. 10 | -10 .. 10 | -20 .. 80 |
| `thumb_dist` | -2 .. 2 | -2 .. 2 | -10 .. 90 |
| `radius_ulna` | -30 .. 30 | -20 .. 20 | -30 .. 30 |

Positive local Z is flexion. The middle and distal joints are hinges by
construction (±2 degrees on X and Y), which is anatomically right.

### Constraints

Every one of the 21 pose bones carries a `LIMIT_ROTATION` constraint in LOCAL
space at influence 1.0, with the ranges above.

Four bones also carry `COPY_ROTATION`, all targeting `midd_meta` in REPLACE
mode:

| Bone | Influence |
| --- | --- |
| `index_meta` | 1.0 |
| `ring_meta` | 1.0 |
| `pinky_meta` | 1.0 |
| `thumb_trapez` | 0.8 |

**This has a direct consequence for authoring.** Keyframing `index_meta`,
`ring_meta` or `pinky_meta` does nothing: the constraint overwrites the pose.
Driving `midd_meta` cups all four metacarpals together, which is anatomically
reasonable and is what the Heloria closed pose does. `thumb_trapez` at 0.8
makes an independent thumb impossible, so the production build sets that one
constraint's influence to 0 (on its own copy, never on the source) and poses
the thumb directly.

A second consequence: **glTF cannot carry constraints.** The export must bake
sampled animation, or the constraint results are lost. `tools/export_glb.py`
uses `export_force_sampling=True`; Blender itself reports
`Baking animation because of unsupported constraints acting on the bone`
during export, which confirms the bake happened.

---

## 7. Materials, textures and existing animation

### Materials

Two, both node-based, both blend method `HASHED`.

**`Skin_caucasian`**: Principled BSDF with Subsurface Weight 1.0, Subsurface
Scale 0.05, IOR 1.45. Base Color, Metallic, Roughness and Normal are all
linked to image textures, plus a Displacement node and five Mix nodes.

**`Nails_caucasian`**: Principled BSDF, IOR 1.5, no subsurface. Base Color,
Metallic, Roughness and Normal linked to image textures.

### Textures: all ten are missing

| Image datablock | Path recorded in the file | Size |
| --- | --- | --- |
| `skin_light.png` | `//Texture/skin_light.png` | 0 x 0 |
| `skin_normal.png` | `//../Upload_2026_02_24_TurboSquid/Texture/skin_normal.png` | 0 x 0 |
| `skin_roughness.png.001` | `//../Upload_2026_02_24_TurboSquid/Texture/skin_roughness.png` | 0 x 0 |
| `skin_height.png` | `//../Upload_2026_02_24_TurboSquid/Texture/skin_height.png` | 0 x 0 |
| `skin_metallic.png` | `//../Upload_2026_02_24_TurboSquid/Texture/skin_metallic.png` | 0 x 0 |
| `nail_basecolor.png.001` | `//../Upload_2026_02_24_TurboSquid/Texture/nail_basecolor.png` | 0 x 0 |
| `nail_normal.png.001` | `//../Upload_2026_02_24_TurboSquid/Texture/nail_normal.png` | 0 x 0 |
| `nail_roughness.png.001` | `//../Upload_2026_02_24_TurboSquid/Texture/nail_roughness.png` | 0 x 0 |
| `nail_metallic.png.001` | `//Texture/nail_metallic.png` | 0 x 0 |
| `non_metallic.png` | `//../Upload_2026_02_24_TurboSquid/Texture_Skin/nail_metallic.png` | 0 x 0 |

Every image is **unpacked**, reports size 0 x 0 (never loaded), and points at a
relative path outside the file that does not exist. **The asset ships with no
textures at all.** The material graphs are intact but every texture input
resolves to nothing.

**Texture resolutions are therefore unknown**, and cannot be recovered from
this file. They are not guessed here.

This is the single largest gap in the source asset, and it is why the Heloria
build rebuilds the skin procedurally (`make_skin_material()` in
`tools/build_hand_flower.py`) and bakes it to 2K maps for the web asset.

### Existing animation

One action: **`Pose_OK`**, frame range 1 to 60, 198 F-curves across all 21
bones.

It is **not an animation**. Sampling frames 1, 20, 40 and 60 gives identical
rotations on every bone, so it is a single static pose held for 60 frames. The
pose itself is the "OK" gesture: index curled (prox 42.6 deg, midd 78.1 deg,
dist 46.2 deg) with a heavily rotated thumb (`thumb_trapez` 157.9 deg) bringing
thumb and index together.

It is the vendor's demonstration pose, not useful to Heloria, and the
production build removes it. The rest pose (no action) is a flat open hand.

---

## 8. What a commercially licensed replacement must match

For the hand to be swapped without touching scene architecture, a replacement
needs:

1. A right hand, palm on one axis, fingers on another, modelled or transformed
   into the same orientation (palm -Y, fingers +Z, thumb -X).
2. An armature whose finger chains flex on a known single axis, with a palm
   bone equivalent to `midd_meta` for `HeloriaFlowerAnchor` to hang from.
3. Bone names matching the table in section 6, or a rename map applied at
   build time in `tools/build_hand_flower.py`.
4. Real, present textures, or acceptance of the procedural skin path.
5. Triangle count in the same order (5k before subdivision), so the geometry
   budget holds.

Nothing else in the pipeline depends on this specific file. The flower, the
anchor, the sync curve, the export and the Three.js side are all independent
of it.

---

## 9. Summary of findings

| Question | Answer |
| --- | --- |
| Mesh names | `Hand` (`Hand_Mesh`), `Nails` (`Nails_Mesh`) |
| Armature name | `Rig` (`Hand_Armature`) |
| Bone count | 21, all deform, all connected |
| Hierarchy root | `radius_ulna` |
| Existing actions | one, `Pose_OK`, which is a static pose not an animation |
| Orientation | right hand, palm -Y, fingers +Z, thumb -X |
| Scene scale | centimetres labelled as metres; 0.01 applied at export |
| UV layout | single tiled `UVmap`, far outside 0..1, unusable for baking |
| Materials | `Skin_caucasian`, `Nails_caucasian`, both node-based |
| Textures | ten datablocks, all unpacked, all missing, resolutions unknown |
| Normals | smooth shaded, no custom split normals |
| Modifiers | Armature on both meshes, nothing else |
| Constraints | 21 LIMIT_ROTATION, 4 COPY_ROTATION targeting `midd_meta` |
| Animation data | none beyond `Pose_OK` |
