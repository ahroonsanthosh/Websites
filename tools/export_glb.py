"""Export the hand/flower master to a web-ready GLB.

The Blender master uses procedural skin, which glTF cannot carry, so the skin
is baked to textures first. The flower carries its colour in a vertex
attribute and needs no textures at all.

Outputs:
    public/models/heloria-hand-flower.glb          uncompressed
    public/models/heloria-hand-flower.draco.glb    Draco-compressed geometry

The editable master is never written to.
"""

from __future__ import annotations

import json
import os
import sys

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

# The skin material is defined once, in the builder, and re-applied to the
# opened master here rather than being baked into the .blend. Editing
# `make_skin_material` and re-running this script is then the whole loop: the
# definition and the exported asset cannot drift apart, and tuning a material
# does not require regenerating the rig and the flower.
import build_hand_flower  # noqa: E402
ROOT = os.path.dirname(HERE)
MASTER = os.path.join(ROOT, "assets", "production", "heloria-hand-flower.blend")
OUT_DIR = os.path.join(ROOT, "public", "models")
OUT = os.path.join(OUT_DIR, "heloria-hand-flower.glb")
OUT_DRACO = os.path.join(OUT_DIR, "heloria-hand-flower.draco.glb")

BAKE_SAMPLES = 24

# Per-map bake resolutions, chosen from measurement rather than convention.
#
# Every one of these was 2048 (hand) or 512 (nails), which cost about 53 MB of
# GPU memory uncompressed, or 71 MB once the mip chain the glTF sampler asks
# for is generated. The maps were measured by re-sampling each one and
# comparing only the texels inside the UV islands, with the packing gutters
# excluded, because averaging across an island edge produces a large error that
# says nothing about the content:
#
#   skin base colour   halving costs 2.93/255 RMSE (1.1%), quartering 4.94
#   skin roughness     halving costs 1.90/255 (0.7%), quartering 3.64
#   skin normal        0.1% of texels carry any content at all; it is flat
#   nail base colour   halving costs 10.14/255, the highest relative detail
#   nail roughness     halving costs 0.84/255
#   nail normal        0.4% of texels carry content
#
# So the base colour keeps the most resolution because it carries the only
# detail a close-up actually shows (mottling, palm creases). Roughness is a
# low-frequency field by construction: it comes from one noise node mapped into
# 0.34 to 0.56. The normal maps are very nearly uniform, and are kept only so
# the material's faint relief survives, not because they carry detail.
BAKE_SIZES = {
    "heloria_skin": {"basecolor": 1024, "roughness": 512, "normal": 256},
    "heloria_nail": {"basecolor": 512, "roughness": 256, "normal": 256},
}
# Centimetre master -> metre web asset.
EXPORT_SCALE = 0.01


# Non-texture material parameters that have to survive the bake.
#
# `bake_object` finishes by replacing the procedural network with a fresh
# Principled wired to the three baked maps. That is correct for the parts glTF
# carries as textures, and it silently discards everything else the author set:
# IOR, specular level, subsurface, coat. For the skin those were IOR 1.40 and
# Specular IOR Level 0.42, and losing them is not cosmetic.
#
# Blender only writes `KHR_materials_ior` when one of transmission, volume or
# specular is also written (see the exporter's `ior.py`), and it only writes
# `KHR_materials_specular` when the specular level is not the neutral 0.5. A
# rebuilt material sits at Blender's defaults, so neither extension was
# emitted, and the runtime therefore fell back to glTF's implicit IOR of 1.5.
# Measured consequence: the skin shipped with a normal-incidence reflectance of
# F0 = 0.040, where a dielectric at IOR 1.40 is F0 = 0.0278 and the author's
# 0.42 specular level takes it to 0.0233. The hand was reflecting 72% more
# light at its highlights than the material it was supposed to be.
#
# The second consequence is structural. With no extensions on the material,
# Three.js instantiates `MeshStandardMaterial`, which has no `ior`, no
# `specularIntensity` and no `sheen` at all; the extensions are what make it a
# `MeshPhysicalMaterial` and put those controls within reach.
#
# Only the skin is listed. The nail material loses its authored coat (0.35) and
# subsurface (0.28) to the same reset and is recorded as a known defect in the
# R8 note rather than changed here, because altering the nails is outside what
# R8 was asked to do.
BAKED_MATERIAL_PARAMS = {
    "HELORIA_SKIN": {
        "IOR": 1.40,
        "Specular IOR Level": 0.42,
    },
}


def refresh_source_materials():
    """Re-apply the builder's material definitions to the opened master.

    Keeps `tools/build_hand_flower.make_skin_material` the single definition of
    what the skin is, without needing the master regenerated to pick up a
    change to it.
    """
    before = bpy.data.materials.get("HELORIA_SKIN")
    if before is None:
        raise SystemExit("materials: HELORIA_SKIN is not in the master")
    after = build_hand_flower.make_skin_material()
    if after is not before:
        raise SystemExit("materials: make_skin_material created a new datablock "
                         "instead of rebuilding the master's; the mesh slots "
                         "would still point at the old one")
    print("  HELORIA_SKIN rebuilt from build_hand_flower.make_skin_material")


def apply_baked_material_params(mat):
    """Restore the authored parameters the bake's material rebuild drops."""
    wanted = BAKED_MATERIAL_PARAMS.get(mat.name)
    if not wanted:
        return
    bsdf = next((n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        raise SystemExit(f"params: {mat.name} has no Principled node after baking")
    for key, value in wanted.items():
        if key not in bsdf.inputs:
            raise SystemExit(f"params: {mat.name} has no {key!r} input")
        bsdf.inputs[key].default_value = value
        print(f"  {mat.name:16s} {key} = {value}")


# Material sidedness, decided per material from measured geometry and measured
# pixels, not from convention.
#
# glTF has one boolean per material: `doubleSided`. Blender writes it as the
# inverse of `use_backface_culling`. Every material in the master shipped with
# culling off, so all six were exported `doubleSided: true`. That is a default
# nobody chose, and it makes the renderer rasterise back faces that in most
# cases can never be seen.
#
# Two measurements decided this table.
#
# 1. Geometry, on the evaluated mesh with modifiers applied. A surface may only
#    be culled if it is watertight (no boundary edges) and consistently wound;
#    anything else has an interior the camera can reach.
#
#      HELORIA_PETAL    3250 faces   0 boundary edges   0 inconsistent
#      HELORIA_SEPAL    1250 faces   0 boundary edges   0 inconsistent
#      HELORIA_CENTRE   2208 faces   0 boundary edges   0 inconsistent
#      HELORIA_STEM      112 faces   0 boundary edges  20 inconsistent  <- defect
#      HELORIA_SKIN    16602 faces 264 boundary edges   0 inconsistent  <- open
#      HELORIA_NAIL      768 faces 180 boundary edges   0 inconsistent  <- open
#
#    The skin's 264 boundary edges form six loops: one 84-edge loop at the
#    forearm cut, which is simply uncapped, and five loops at the fingertips
#    whose centres are identical to the nail shells' five loops. The nail beds
#    are cut out of the skin and plugged by the nail sheets, so neither mesh is
#    closed on its own even though the union nearly is.
#
# 2. Pixels. Each material was culled on its own and the asset rendered from a
#    160-point Fibonacci sphere at five bloom values, 800 renders per material,
#    each compared against the same viewpoint rendered double-sided:
#
#      HELORIA_CENTRE       50 changed px across 52.4M   worst frame  4 px
#      HELORIA_STEM         42                            worst frame  2 px
#      HELORIA_SEPAL        56                            worst frame  2 px
#      HELORIA_PETAL       186                            worst frame  4 px
#      HELORIA_NAIL        107                            worst frame 10 px
#      HELORIA_SKIN    436,014                            worst frame 3434 px
#
#    The flower's four figures are silhouette antialiasing: single pixels on
#    edge-on triangles, scattered, never adjacent. The skin's are not. From
#    below, culling the skin opens the forearm stump into a hole 21,468 pixels
#    across at 640x640. The nail's ten worst pixels are a real sliver too: the
#    nail rim and the skin rim are coincident but not coplanar, so at a grazing
#    underside angle the camera sees through the seam.
#
# Hence: cull the three flower surfaces that are provably closed, and keep the
# three that are not. Nothing here is set single-sided because an audit
# expected it; skin and nails stay double-sided because the measurement says
# their back faces are reachable, and making them single-sided would trade a
# small fill-rate saving for a visible hole.
#
# Two geometry defects are recorded rather than papered over, because a
# double-sided material is not a fix for either of them:
#
#   - HELORIA_STEM is wound inside out. All 50 source side quads face the axis
#     rather than away from it, and the bottom cap was reversed by hand to
#     compensate, which is where the 20 inconsistent edges come from. Culling
#     it would drop the cap. It stays double-sided until the winding is
#     corrected in `create_heloria_flower.build_stem`, which is a change to the
#     mesh generator and so outside this pass.
#   - The hand's forearm is an open tube. Capping it is the prerequisite for
#     culling the skin, and that is a topology change, also outside this pass.
SIDEDNESS = {
    "HELORIA_PETAL": True,    # closed shell, Solidify with use_rim
    "HELORIA_SEPAL": True,    # closed shell
    "HELORIA_CENTRE": True,   # closed shell
    "HELORIA_STEM": False,    # closed, but wound inside out: see above
    "HELORIA_SKIN": False,    # open at the forearm and at five nail beds
    "HELORIA_NAIL": False,    # open sheets plugging the nail beds
}


def apply_sidedness():
    """Set back-face culling per material, and fail loudly on a surprise.

    This runs against the opened master at export time rather than being baked
    into the .blend, so the decision above and the exported asset cannot drift
    apart, and re-running the export is all it takes to change one.
    """
    seen = set()
    for name, cull in SIDEDNESS.items():
        mat = bpy.data.materials.get(name)
        if mat is None:
            raise SystemExit(f"sidedness: material {name!r} is not in the master")
        mat.use_backface_culling = cull
        seen.add(name)
        print(f"  {name:16s} use_backface_culling={cull}  -> glTF doubleSided={not cull}")
    # A material added to the master without a decision here would otherwise
    # inherit Blender's default and ship double-sided unnoticed.
    used = {ms.material.name
            for ob in bpy.data.objects if ob.type == "MESH"
            for ms in ob.material_slots if ms.material}
    missing = sorted(used - seen)
    if missing:
        raise SystemExit(f"sidedness: no decision recorded for {missing}")


def bake_object(ob, sizes, prefix):
    """Bake base colour, roughness and a tangent-space normal for one object.

    `sizes` maps each pass name to its own resolution, so a map that carries
    detail and a map that does not are not forced to the same cost.
    """
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = BAKE_SAMPLES
    scene.cycles.use_denoising = False
    scene.render.bake.use_selected_to_active = False
    scene.render.bake.margin = 8

    # The source UV map is tiled far outside 0..1 for the vendor's texture
    # set, so it cannot be baked into. A dedicated packed UV set is made.
    if "bake_uv" in ob.data.uv_layers:
        ob.data.uv_layers.remove(ob.data.uv_layers["bake_uv"])
    uv = ob.data.uv_layers.new(name="bake_uv")
    ob.data.uv_layers.active = uv

    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=1.15, island_margin=0.012)
    bpy.ops.object.mode_set(mode="OBJECT")

    mat = ob.data.materials[0]
    nt = mat.node_tree
    images = {}
    passes = (
        ("basecolor", "DIFFUSE", "sRGB"),
        ("roughness", "ROUGHNESS", "Non-Color"),
        ("normal", "NORMAL", "Non-Color"),
    )
    for name, bake_type, colorspace in passes:
        size = sizes[name]
        img = bpy.data.images.new("%s_%s" % (prefix, name), size, size,
                                  alpha=False, float_buffer=False,
                                  is_data=(colorspace != "sRGB"))
        img.colorspace_settings.name = colorspace
        node = nt.nodes.new("ShaderNodeTexImage")
        node.image = img
        node.location = (-1400, 600)
        node.select = True
        nt.nodes.active = node
        if bake_type == "DIFFUSE":
            scene.render.bake.use_pass_direct = False
            scene.render.bake.use_pass_indirect = False
            scene.render.bake.use_pass_color = True
        bpy.ops.object.bake(type=bake_type, use_clear=True, uv_layer="bake_uv")
        images[name] = img
        nt.nodes.remove(node)
        print("  baked", prefix, name, "%dx%d" % (size, size))

    # Replace the procedural network with a plain glTF-compatible material.
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial"); out.location = (600, 0)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled"); bsdf.location = (300, 0)
    uvnode = nt.nodes.new("ShaderNodeUVMap"); uvnode.uv_map = "bake_uv"
    uvnode.location = (-700, 0)

    def tex(img, y):
        n = nt.nodes.new("ShaderNodeTexImage")
        n.image = img
        n.location = (-420, y)
        nt.links.new(uvnode.outputs["UV"], n.inputs["Vector"])
        return n

    tc = tex(images["basecolor"], 260)
    tr = tex(images["roughness"], 0)
    tn = tex(images["normal"], -260)
    nmap = nt.nodes.new("ShaderNodeNormalMap"); nmap.location = (-120, -260)
    nmap.uv_map = "bake_uv"
    nt.links.new(tc.outputs["Color"], bsdf.inputs["Base Color"])
    nt.links.new(tr.outputs["Color"], bsdf.inputs["Roughness"])
    nt.links.new(tn.outputs["Color"], nmap.inputs["Color"])
    nt.links.new(nmap.outputs["Normal"], bsdf.inputs["Normal"])
    bsdf.inputs["Metallic"].default_value = 0.0
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    apply_baked_material_params(mat)

    # Keep only the packed UV set: glTF would otherwise carry the unusable
    # tiled original as a second, dead UV channel.
    for layer in [l.name for l in ob.data.uv_layers if l.name != "bake_uv"]:
        ob.data.uv_layers.remove(ob.data.uv_layers[layer])
    return images


def stats():
    dg = bpy.context.evaluated_depsgraph_get()
    tris = 0
    per_object = {}
    for ob in bpy.data.objects:
        if ob.type != "MESH":
            continue
        ev = ob.evaluated_get(dg)
        me = ev.to_mesh()
        me.calc_loop_triangles()
        n = len(me.loop_triangles)
        per_object[ob.name] = n
        tris += n
        ev.to_mesh_clear()
    return {"triangles": tris, "per_object": per_object,
            "materials": len([m for m in bpy.data.materials if m.users]),
            "images": [(i.name, list(i.size)) for i in bpy.data.images if i.users],
            "actions": [a.name for a in bpy.data.actions]}


def main():
    bpy.ops.wm.open_mainfile(filepath=MASTER)
    scene = bpy.context.scene

    hand = bpy.data.objects["Heloria_Hand"]
    nails = bpy.data.objects["Heloria_Hand_Nails"]
    rig = bpy.data.objects["Heloria_Hand_Rig"]
    flower_rig = bpy.data.objects["Heloria_Flower_Rig"]

    # Web geometry budget: one subdivision level, not the render's two.
    for ob in (hand, nails):
        sub = ob.modifiers.get("Subdivision")
        if sub:
            sub.levels = 1
            sub.render_levels = 1

    print("re-applying source material definitions")
    refresh_source_materials()

    print("baking skin maps")
    bake_object(hand, BAKE_SIZES["heloria_skin"], "heloria_skin")
    bake_object(nails, BAKE_SIZES["heloria_nail"], "heloria_nail")

    # One clip containing both rigs, so a single mixer time drives everything.
    rig.animation_data.action = bpy.data.actions["HELORIA_HAND_REVEAL"]
    flower_rig.animation_data.action = bpy.data.actions["HELORIA_FLOWER_BLOOM_SYNC"]

    rig.scale = (EXPORT_SCALE,) * 3

    for ob in bpy.data.objects:
        if ob.type in {"CAMERA", "LIGHT"}:
            bpy.data.objects.remove(ob, do_unlink=True)

    print("material sidedness")
    apply_sidedness()

    measured = stats()
    print("STATS", json.dumps(measured))

    os.makedirs(OUT_DIR, exist_ok=True)
    common = dict(
        export_format="GLB",
        export_apply=True,
        export_yup=True,
        export_animations=True,
        export_animation_mode="ACTIVE_ACTIONS",
        export_bake_animation=True,
        export_force_sampling=True,
        export_anim_single_armature=False,
        export_optimize_animation_size=False,
        export_skins=True,
        export_morph=False,
        export_cameras=False,
        export_lights=False,
        export_extras=True,
        export_image_format="WEBP",
        export_image_quality=88,
    )
    bpy.ops.export_scene.gltf(filepath=OUT, use_selection=False, **common)
    print("exported", OUT, os.path.getsize(OUT))

    bpy.ops.export_scene.gltf(filepath=OUT_DRACO, use_selection=False,
                              export_draco_mesh_compression_enable=True,
                              export_draco_mesh_compression_level=6,
                              export_draco_position_quantization=14,
                              export_draco_normal_quantization=10,
                              export_draco_texcoord_quantization=12,
                              **common)
    print("exported", OUT_DRACO, os.path.getsize(OUT_DRACO))


if __name__ == "__main__":
    main()
