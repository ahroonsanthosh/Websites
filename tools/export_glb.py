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
ROOT = os.path.dirname(HERE)
MASTER = os.path.join(ROOT, "assets", "production", "heloria-hand-flower.blend")
OUT_DIR = os.path.join(ROOT, "public", "models")
OUT = os.path.join(OUT_DIR, "heloria-hand-flower.glb")
OUT_DRACO = os.path.join(OUT_DIR, "heloria-hand-flower.draco.glb")

BAKE_SAMPLES = 24
# Centimetre master -> metre web asset.
EXPORT_SCALE = 0.01


def bake_object(ob, size, prefix):
    """Bake base colour, roughness and a tangent-space normal for one object."""
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
        print("  baked", prefix, name)

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

    print("baking skin maps")
    bake_object(hand, 2048, "heloria_skin")
    bake_object(nails, 512, "heloria_nail")

    # One clip containing both rigs, so a single mixer time drives everything.
    rig.animation_data.action = bpy.data.actions["HELORIA_HAND_REVEAL"]
    flower_rig.animation_data.action = bpy.data.actions["HELORIA_FLOWER_BLOOM_SYNC"]

    rig.scale = (EXPORT_SCALE,) * 3

    for ob in bpy.data.objects:
        if ob.type in {"CAMERA", "LIGHT"}:
            bpy.data.objects.remove(ob, do_unlink=True)

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
