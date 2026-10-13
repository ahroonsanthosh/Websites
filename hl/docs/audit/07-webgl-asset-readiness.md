# 07 WebGL asset readiness

**Audit only. No asset was re-exported, recompressed or modified.**

---

## 1. Measured contents of the exported GLB

Parsed from the binary, not from the exporter's report.

| | `heloria-hand-flower.glb` | `heloria-hand-flower.draco.glb` |
| --- | --- | --- |
| File size | **3.52 MB** (3,691,240 B) | **1.44 MB** (1,511,988 B) |
| JSON chunk | 87.3 KB | 85.3 KB |
| Binary chunk | 3.435 MB | 1.359 MB |
| Triangles | 48,536 | 48,536 |
| Primitives (draw calls) | 6 | 6 |
| Meshes | 3 | 3 |
| Nodes | 56 | 56 |
| Skins | 2 (21 + 29 joints) | 2 |
| Materials | 6 | 6 |
| Images | 6 | 6 |
| Animation | 1 clip, 150 channels, 150 samplers, **285.9 KB**, 6.25 s | same |
| Extensions | `KHR_materials_specular`, `KHR_materials_ior`, `EXT_texture_webp` | the above plus `KHR_draco_mesh_compression` |

### Where the bytes are

| Component | Bytes | Share of the 3.52 MB |
| --- | --- | --- |
| Geometry + skinning attributes | ~2.62 MB | **74%** |
| Animation samplers | 285.9 KB | 8% |
| Textures (6 WebP images) | 526.1 KB | 15% |
| JSON | 87.3 KB | 2% |

Draco compresses the geometry by roughly 4.2x on the hand, 6.0x on the nails and
8.6 to 10.5x on the flower primitives (from the encoder's own report), bringing
the file to 1.44 MB. **Texture and animation bytes are unchanged by Draco**, so
they become 57% of the compressed file.

### Textures, individually

| Image | Format | Bytes | Baked dimensions |
| --- | --- | --- | --- |
| `heloria_skin_basecolor` | WebP | 249.4 KB | 2048 x 2048 |
| `heloria_skin_roughness` | WebP | 245.2 KB | 2048 x 2048 |
| `heloria_skin_normal` | WebP | **14.1 KB** | 2048 x 2048 |
| `heloria_nail_basecolor` | WebP | 10.4 KB | 512 x 512 |
| `heloria_nail_roughness` | WebP | 6.1 KB | 512 x 512 |
| `heloria_nail_normal` | WebP | 0.9 KB | 512 x 512 |

---

## 2. Verified in the browser

Loaded through `GLTFLoader` in headless Chromium against the running dev server.

| Requirement | Result |
| --- | --- |
| Load the GLB | **Yes.** 200, 3,691,240 bytes, one request. |
| Display the hand | **Yes.** `Heloria_Hand`, `Heloria_Hand_Nails` present as skinned meshes. |
| Display the flower | **Yes.** `Heloria_Flower_1` through `_4` (one skinned mesh per material). |
| Preserve materials | **Yes.** All six arrive by name: `HELORIA_SKIN`, `HELORIA_NAIL`, `HELORIA_PETAL`, `HELORIA_CENTRE`, `HELORIA_STEM`, `HELORIA_SEPAL`. |
| Preserve skinning | **Yes.** Two skins, 21 and 29 joints, deforming correctly across the whole range. |
| Access animations | **Yes.** One clip, `Animation`, 6.25 s, 150 tracks. |
| Scrub the animation | **Yes.** Verified at fourteen points, monotonic, no jumps (doc 06). |
| Measured bounds | 0.104 x 0.137 x 0.130 m, i.e. a 137 mm hand. Correct real-world scale. |
| Console | Clean. |

Time from navigation to first usable frame on localhost: **2,791 ms**, with no
loading indicator on screen for the whole of that window.

---

## 3. Problems

### A-01 Textures are WebP, not KTX2. **High.**

This is the most consequential asset finding.

The benchmark article states the trap precisely (CONFIRMED):

> "While a PNG may be small on disk, it is fully decompressed in GPU memory. A
> 2048² texture still occupies around 16MB of VRAM regardless of its file size.
> KTX2 with ETC1S compression stays compressed on the GPU, uses much less
> memory, and uploads significantly faster."

Applied to this asset:

| Texture | Disk | Estimated VRAM as RGBA8 |
| --- | --- | --- |
| skin basecolor 2048² | 249 KB | ~16 MB |
| skin roughness 2048² | 245 KB | ~16 MB |
| skin normal 2048² | 14 KB | ~16 MB |
| nails, three at 512² | 17 KB | ~3 MB |
| **Total** | **526 KB** | **~51 MB** |

So 526 KB on the wire becomes roughly **51 MB of GPU memory**, before mipmaps
(which add about a third). The file looks light and the GPU cost is not.

`docs/heloria-asset-spec.md` already mandates KTX2 for GPU-resident textures.
The exported asset does not comply with the project's own specification.

### A-02 A 2048² normal map that is nearly flat. **Medium.**

14.1 KB for a 2048² image means almost no detail: the baked bump is subtle
enough that the map is close to uniform. The project is paying a full 16 MB of
VRAM for something carrying very little information.

Either the skin bump should be strong enough to justify the map, or the map
should be much smaller, or it should be dropped and the detail carried another
way.

### A-03 Roughness is a full 2048² map of a low-frequency signal. **Medium.**

The roughness bake comes from a noise node at scale 3.4 mapped into the range
0.34 to 0.56. That is a smooth, low-frequency field. It does not need 4.2
million texels. A 512² map, or a factor plus a small detail map, would be
visually identical.

### A-04 Every material is double-sided. **Medium.**

All six materials export with `doubleSided: true`.

- For the **skin and nails** this is simply wrong: a closed hand mesh has no
  visible backfaces, and double-siding disables backface culling, so every
  hidden triangle is still rasterised and shaded.
- For the **petals** it is correct and necessary, since a petal is a thin
  surface seen from both sides.

The cost is fragment work on a shader that will become the most expensive in the
scene once real skin shading is added.

### A-05 No transmission or volume extension. **High for the flower.**

Discussed in doc 05 F-01. The petals' subsurface exists only in Blender. In the
browser they are opaque.

### A-06 Draco is exported but not wired up. **Medium.**

`heloria-hand-flower.draco.glb` exists and is 59% smaller. Nothing in `src/`
configures a `DRACOLoader`, and there is no decoder in `public/`. The compressed
asset is currently dead weight in the repository.

The benchmark's lesson here is specific and worth recording verbatim
(CONFIRMED):

> "The Draco and KTX2/Basis transcoders are bundled in `public/vendor/` rather
> than loaded from a CDN. We learned that lesson the hard way when a slowdown on
> `gstatic` and `unpkg` caused every compressed asset to fail decoding, even
> though the assets themselves were hosted locally. If your decoder lives on
> someone else's server, so does your pipeline."

When Draco is wired up, the decoder must be self-hosted.

### A-07 No loading state of any kind. **High, but it is a system, not an asset defect.**

2,791 ms of nothing on localhost. On a real connection the 3.52 MB asset is
several seconds. There is no progress, no placeholder, no indication that
anything is happening. Classified NOT YET BUILT in doc 01; recorded here because
this asset is what will expose it.

### A-08 The master and the web asset disagree about materials. **Low, but document it.**

The Blender master contains **no images at all**; its skin is procedural, and
the textures are baked during export. So the master and the GLB are two
different material representations of the same asset, and a change to the
procedural skin is invisible until a re-export and re-bake. This is a legitimate
pipeline, but it must be written down, because "the master has no textures"
looks like a defect to anyone who opens it cold.

---

## 4. What is genuinely good

- **48,536 triangles** for a hero hand and flower is a sensible budget, not
  bloated and not starved.
- **The flower ships zero texture bytes.** All of its colour is a vertex
  attribute. This is the correct decision and is exactly the kind of substitution
  the benchmark describes when it replaced gradient images with a few lines of
  GLSL.
- **One clip driving two skins** means one mixer time controls everything, which
  matches the architecture the experience needs.
- The anchor survived export as a real node.
- Real-world scale is correct in metres.

---

## 5. Which Zero techniques are required now, and which can wait

| Technique | Required now? | Reasoning |
| --- | --- | --- |
| **KTX2 / Basis** | **Yes, before the asset ships in the real page** | 51 MB of VRAM for one prop is the single largest technical liability in the asset. On a mid-range phone that is most of the texture budget spent on the opening shot. |
| **Draco** | **Yes, and it is nearly free** | The file already exists at 1.44 MB. The remaining work is a self-hosted decoder and loader wiring. |
| **Self-hosted decoders** | **Yes, whenever Draco or KTX2 is wired** | Non-negotiable per the quoted lesson. |
| **Texture atlasing** | **Not yet** | There are six images in one asset. Atlasing pays when there are dozens. Revisit when the stage set exists. |
| **Staged loading / preload groups** | **Not yet, but design for it** | There is one asset. The grouping decision belongs with the stage system. |
| **GPU upload queue (`createImageBitmap`, idle-time uploads, tiled uploads)** | **Not yet** | With three large textures, a single synchronous flush before the scene appears is sufficient and much simpler. The queue earns its complexity at a dozen-plus textures. |
| **Prewarming (shader compilation)** | **Soon** | A skinned PBR material with a normal map is a non-trivial compile, and it will stall the first frame it appears on. Cheap to add once there is a stage boundary to hang it on. |
| **Mipmap reduction** | **With KTX2** | Decide per map at conversion time, as the benchmark did with its previewer. |

---

## 6. Verdict

**The asset is ready to be loaded and driven. It is not ready to be shipped.**

Load, display, materials, skinning, animation access and continuous scrubbing
all verified working in a real browser with a clean console.

The blocking issue for shipping is A-01: 526 KB on the wire that becomes about
51 MB in GPU memory, in direct contradiction of the project's own asset
specification. A-04 and A-03 are cheap corrections in the same pass. A-06 is
mostly wiring. A-05 is a quality gap that will decide whether the flower looks
alive.
