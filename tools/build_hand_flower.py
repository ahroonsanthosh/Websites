"""Assemble the Heloria hand-and-flower production master.

Inputs
------
* assets/source/hand/Do_HandRigged_detailrender_shared_2026_04_01_FullFunction.blend
  (prototype hand, licensing recorded in docs/hand-source-analysis.md)
* tools/create_heloria_flower.py (bespoke Heloria flower)

Output
------
* assets/production/heloria-hand-flower.blend

The source file is opened read-only and saved under a new name. It is never
written back to.

Run:
    python tools/build_hand_flower.py      (with bpy installed as a module)
"""

from __future__ import annotations

import math
import os
import random
import sys

import bpy
from mathutils import Euler, Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import create_heloria_flower as FLOWER  # noqa: E402

SOURCE = os.path.join(
    ROOT, "assets", "source", "hand",
    "Do_HandRigged_detailrender_shared_2026_04_01_FullFunction.blend")
MASTER = os.path.join(ROOT, "assets", "production", "heloria-hand-flower.blend")

ANCHOR_NAME = "HeloriaFlowerAnchor"

# --------------------------------------------------------------------------
# Timeline. 150 frames at 24fps is 6.25 seconds: the reveal has to feel
# deliberate, not like a UI transition.
# --------------------------------------------------------------------------

FRAME_START = 1
FRAME_END = 150


def p_to_frame(p: float) -> float:
    return FRAME_START + p * (FRAME_END - FRAME_START)


# bloomProgress -> hand openness (0 closed, 1 open) and flower openness.
# The flower deliberately trails the hand: nothing of it moves until the palm
# is already opening, so the viewer discovers it rather than being shown it.
SYNC = [
    # p,    hand,  flower
    (0.00, 0.000, 0.000),
    (0.15, 0.035, 0.000),
    (0.30, 0.230, 0.000),
    (0.45, 0.480, 0.055),
    (0.60, 0.700, 0.260),
    (0.75, 0.870, 0.560),
    (0.90, 0.975, 0.860),
    (1.00, 1.000, 1.000),
]

# --------------------------------------------------------------------------
# Hand pose definitions, in degrees about each bone's local Z, which is the
# flexion axis this rig uses (confirmed from its LIMIT_ROTATION constraints).
# --------------------------------------------------------------------------

# Cupped and protective, not a fist: the fingers close over a cavity rather
# than into the palm, and the metacarpals cup with them.
HAND_CLOSED = {
    "midd_meta": 16.0,          # drives index/ring/pinky metacarpals by constraint
    "index_prox": 58.0, "index_midd": 74.0, "index_dist": 30.0,
    "midd_prox": 62.0, "midd_midd": 80.0, "midd_dist": 33.0,
    "ring_prox": 64.0, "ring_midd": 82.0, "ring_dist": 35.0,
    "pinky_prox": 66.0, "pinky_midd": 80.0, "pinky_dist": 33.0,
    "thumb_trapez": 40.0, "thumb_meta": 34.0, "thumb_prox": 56.0, "thumb_dist": 22.0,
}

# Open, but never flat: a relaxed presenting hand keeps a slight curve in every
# finger. A ruler-flat hand is the clearest sign of a rigged prop.
HAND_OPEN = {
    "midd_meta": 2.0,
    "index_prox": 6.0, "index_midd": 9.0, "index_dist": 5.0,
    "midd_prox": 5.0, "midd_midd": 8.0, "midd_dist": 5.0,
    "ring_prox": 7.0, "ring_midd": 11.0, "ring_dist": 6.0,
    "pinky_prox": 10.0, "pinky_midd": 14.0, "pinky_dist": 8.0,
    "thumb_trapez": 6.0, "thumb_meta": 4.0, "thumb_prox": 8.0, "thumb_dist": 4.0,
}

# Fingers do not open together. The index leads, the little finger trails, and
# each distal joint lags its own proximal joint.
FINGER_LAG = {
    "index": 0.00, "midd": 0.06, "ring": 0.12, "pinky": 0.18, "thumb": 0.10,
    "midd_meta": 0.04,
}
JOINT_LAG = {"prox": 0.00, "midd": 0.05, "dist": 0.10, "meta": 0.0, "trapez": 0.0}


def bone_lag(name: str) -> float:
    if name == "midd_meta":
        return FINGER_LAG["midd_meta"]
    finger = name.split("_")[0]
    joint = name.split("_")[-1]
    return FINGER_LAG.get(finger, 0.0) + JOINT_LAG.get(joint, 0.0)


def smoothstep(a, b, x):
    if b == a:
        return 0.0 if x < a else 1.0
    t = min(1.0, max(0.0, (x - a) / (b - a)))
    return t * t * (3.0 - 2.0 * t)


# --------------------------------------------------------------------------
# Materials
# --------------------------------------------------------------------------

def make_skin_material():
    """Procedural skin.

    The prototype hand ships with its texture set unlinked and the image files
    absent, so there is nothing to restore. Rather than leave the material
    broken, the skin is rebuilt procedurally: mottled base colour, pore-scale
    bump from a voronoi/noise pair, roughness that varies across the surface,
    and subsurface scattering scaled for centimetre units.
    """
    mat = bpy.data.materials.get("HELORIA_SKIN") or bpy.data.materials.new("HELORIA_SKIN")
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()

    out = nt.nodes.new("ShaderNodeOutputMaterial"); out.location = (900, 0)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled"); bsdf.location = (600, 0)

    coord = nt.nodes.new("ShaderNodeTexCoord"); coord.location = (-900, 0)

    # Large mottling: the uneven blush that stops skin reading as vinyl.
    mott = nt.nodes.new("ShaderNodeTexNoise"); mott.location = (-680, 260)
    mott.inputs["Scale"].default_value = 6.5
    mott.inputs["Detail"].default_value = 4.0
    mott.inputs["Roughness"].default_value = 0.62
    nt.links.new(coord.outputs["Object"], mott.inputs["Vector"])

    ramp = nt.nodes.new("ShaderNodeValToRGB"); ramp.location = (-460, 260)
    # Low contrast on purpose. Skin mottling is a whisper; any visible
    # patching immediately reads as a texture rather than as a body.
    ramp.color_ramp.elements[0].position = 0.28
    ramp.color_ramp.elements[0].color = (0.392, 0.226, 0.178, 1.0)
    ramp.color_ramp.elements[1].position = 0.78
    ramp.color_ramp.elements[1].color = (0.468, 0.290, 0.232, 1.0)
    nt.links.new(mott.outputs["Fac"], ramp.inputs["Fac"])

    # Fine capillary break-up on top of the mottling.
    fine = nt.nodes.new("ShaderNodeTexNoise"); fine.location = (-680, 40)
    fine.inputs["Scale"].default_value = 24.0
    fine.inputs["Detail"].default_value = 8.0
    nt.links.new(coord.outputs["Object"], fine.inputs["Vector"])

    tint = nt.nodes.new("ShaderNodeMix"); tint.data_type = "RGBA"
    tint.blend_type = "OVERLAY"; tint.location = (-200, 200)
    tint.inputs["Factor"].default_value = 0.10
    nt.links.new(ramp.outputs["Color"], tint.inputs[6])
    nt.links.new(fine.outputs["Color"], tint.inputs[7])
    nt.links.new(tint.outputs[2], bsdf.inputs["Base Color"])

    # Pores: voronoi cells at skin scale, plus noise so they are not regular.
    vor = nt.nodes.new("ShaderNodeTexVoronoi"); vor.location = (-680, -220)
    vor.feature = "F1"
    vor.inputs["Scale"].default_value = 95.0
    nt.links.new(coord.outputs["Object"], vor.inputs["Vector"])

    micro = nt.nodes.new("ShaderNodeTexNoise"); micro.location = (-680, -430)
    micro.inputs["Scale"].default_value = 210.0
    micro.inputs["Detail"].default_value = 6.0
    nt.links.new(coord.outputs["Object"], micro.inputs["Vector"])

    bmix = nt.nodes.new("ShaderNodeMix"); bmix.data_type = "FLOAT"
    bmix.location = (-420, -300); bmix.inputs["Factor"].default_value = 0.45
    nt.links.new(vor.outputs["Distance"], bmix.inputs[2])
    nt.links.new(micro.outputs["Fac"], bmix.inputs[3])

    bump = nt.nodes.new("ShaderNodeBump"); bump.location = (-160, -320)
    bump.inputs["Strength"].default_value = 0.10
    bump.inputs["Distance"].default_value = 0.008
    nt.links.new(bmix.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

    # Roughness: skin is never uniform, and the variation is what sells it.
    rough = nt.nodes.new("ShaderNodeTexNoise"); rough.location = (-680, -640)
    rough.inputs["Scale"].default_value = 3.4
    rough.inputs["Detail"].default_value = 5.0
    nt.links.new(coord.outputs["Object"], rough.inputs["Vector"])
    rmap = nt.nodes.new("ShaderNodeMapRange"); rmap.location = (-420, -640)
    rmap.inputs["To Min"].default_value = 0.34
    rmap.inputs["To Max"].default_value = 0.56
    nt.links.new(rough.outputs["Fac"], rmap.inputs["Value"])
    nt.links.new(rmap.outputs["Result"], bsdf.inputs["Roughness"])

    bsdf.inputs["Subsurface Weight"].default_value = 0.22
    bsdf.inputs["Subsurface Radius"].default_value = (1.0, 0.32, 0.20)
    # Scene units are centimetres, so a few millimetres of scatter is ~0.35.
    bsdf.inputs["Subsurface Scale"].default_value = 0.35
    bsdf.inputs["IOR"].default_value = 1.40
    bsdf.inputs["Specular IOR Level"].default_value = 0.42
    bsdf.inputs["Metallic"].default_value = 0.0

    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


def make_nail_material():
    mat = bpy.data.materials.get("HELORIA_NAIL") or bpy.data.materials.new("HELORIA_NAIL")
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial"); out.location = (400, 0)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled"); bsdf.location = (140, 0)
    bsdf.inputs["Base Color"].default_value = (0.560, 0.372, 0.330, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.20
    bsdf.inputs["Subsurface Weight"].default_value = 0.28
    bsdf.inputs["Subsurface Radius"].default_value = (1.0, 0.45, 0.35)
    bsdf.inputs["Subsurface Scale"].default_value = 0.18
    bsdf.inputs["Coat Weight"].default_value = 0.35
    bsdf.inputs["Coat Roughness"].default_value = 0.12
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


# --------------------------------------------------------------------------
# Build
# --------------------------------------------------------------------------

def clean_source():
    """Strip what the prototype file carries that we do not use."""
    # The source ships ten image datablocks whose files are absent. Keeping
    # them would export as broken texture references.
    for img in list(bpy.data.images):
        if img.users == 0 or not img.has_data:
            try:
                bpy.data.images.remove(img)
            except Exception:
                pass
    for mat in list(bpy.data.materials):
        if mat.name in ("Skin_caucasian", "Nails_caucasian"):
            bpy.data.materials.remove(mat)
    # Pose_OK is the vendor's demonstration gesture, not ours.
    act = bpy.data.actions.get("Pose_OK")
    if act:
        bpy.data.actions.remove(act)


def set_pose(rig, table, weight_fn=None):
    """Apply a flexion table. weight_fn(name) -> 0..1 blends toward the pose."""
    for name, deg in table.items():
        pb = rig.pose.bones.get(name)
        if not pb:
            continue
        w = 1.0 if weight_fn is None else weight_fn(name)
        pb.rotation_mode = "XYZ"
        pb.rotation_euler = (0.0, 0.0, math.radians(deg * w))


def blended_pose(rig, openness: float):
    """Pose the hand at a given openness, with per-bone lag."""
    for name in HAND_CLOSED:
        pb = rig.pose.bones.get(name)
        if not pb:
            continue
        lag = bone_lag(name)
        local = smoothstep(lag, min(1.0, lag + 0.78), openness)
        closed = HAND_CLOSED[name]
        opened = HAND_OPEN[name]
        pb.rotation_mode = "XYZ"
        pb.rotation_euler = (0.0, 0.0, math.radians(closed + (opened - closed) * local))


def key_hand(rig, name, frames):
    act = bpy.data.actions.get(name)
    if act:
        bpy.data.actions.remove(act)
    if rig.animation_data is None:
        rig.animation_data_create()
    act = bpy.data.actions.new(name)
    rig.animation_data.action = act
    for frame, openness in frames:
        bpy.context.scene.frame_set(int(round(frame)))
        blended_pose(rig, openness)
        for bname in HAND_CLOSED:
            pb = rig.pose.bones.get(bname)
            if pb:
                pb.keyframe_insert("rotation_euler", frame=int(round(frame)))
    for fc in act.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "BEZIER"
            kp.handle_left_type = "AUTO_CLAMPED"
            kp.handle_right_type = "AUTO_CLAMPED"
    return act


def build():
    bpy.ops.wm.open_mainfile(filepath=SOURCE)
    scene = bpy.context.scene
    scene.frame_start = FRAME_START
    scene.frame_end = FRAME_END
    scene.render.fps = 24

    clean_source()

    hand = bpy.data.objects["Hand"]
    nails = bpy.data.objects["Nails"]
    rig = bpy.data.objects["Rig"]

    hand.name = "Heloria_Hand"
    hand.data.name = "Heloria_Hand_Mesh"
    nails.name = "Heloria_Hand_Nails"
    nails.data.name = "Heloria_Hand_Nails_Mesh"
    rig.name = "Heloria_Hand_Rig"
    rig.data.name = "Heloria_Hand_Armature"

    skin = make_skin_material()
    nail = make_nail_material()
    hand.data.materials.clear(); hand.data.materials.append(skin)
    nails.data.materials.clear(); nails.data.materials.append(nail)

    # Subdivision: the source is 5.5k triangles, which faceted visibly on the
    # finger silhouette in a close-up. One level in the viewport, two at render.
    for ob in (hand, nails):
        sub = ob.modifiers.get("Subdivision") or ob.modifiers.new("Subdivision", "SUBSURF")
        sub.levels = 1
        sub.render_levels = 2
        sub.use_limit_surface = True

    # The thumb's base bone copies the middle metacarpal at 80% influence,
    # which makes an independent thumb impossible. The prototype keeps the
    # constraint but at zero influence so the thumb can be posed directly.
    tb = rig.pose.bones.get("thumb_trapez")
    if tb:
        for c in tb.constraints:
            if c.type == "COPY_ROTATION":
                c.influence = 0.0

    for pb in rig.pose.bones:
        pb.rotation_mode = "XYZ"

    # ---- flower --------------------------------------------------------
    flower_ob, flower_rig, info = FLOWER.build_flower()
    rng = random.Random(FLOWER.SEED)
    meta = {}
    for i in range(FLOWER.PRIMARY_COUNT):
        meta["petal_p%d" % (i + 1)] = FLOWER.PetalParams(
            rng, i, FLOWER.PRIMARY_COUNT, FLOWER.PRIMARY_LENGTH, FLOWER.PRIMARY_WIDTH, True)
    for i in range(FLOWER.SECONDARY_COUNT):
        meta["petal_s%d" % (i + 1)] = FLOWER.PetalParams(
            rng, i, FLOWER.SECONDARY_COUNT, FLOWER.SECONDARY_LENGTH, FLOWER.SECONDARY_WIDTH, False)

    # The flower's own bloom, on its own timing, kept for reference and reuse.
    FLOWER.create_bloom_action(flower_rig, meta)

    # ---- anchor --------------------------------------------------------
    # An empty bone-parented to the middle metacarpal. That bone is the palm
    # itself, so anything parented to it stays in the palm through the whole
    # cupping motion without any constraint solving at runtime.
    anchor = bpy.data.objects.get(ANCHOR_NAME)
    if anchor:
        bpy.data.objects.remove(anchor, do_unlink=True)
    anchor = bpy.data.objects.new(ANCHOR_NAME, None)
    anchor.empty_display_type = "PLAIN_AXES"
    anchor.empty_display_size = 1.2
    scene.collection.objects.link(anchor)

    anchor.parent = rig
    anchor.parent_type = "BONE"
    anchor.parent_bone = "midd_meta"
    bpy.context.view_layer.update()
    # Placed by world matrix and let Blender solve the bone-space local
    # transform: bone parenting is relative to the bone tail, which is not a
    # useful space to author in.
    anchor.matrix_world = (
        Matrix.Translation(Vector(PALM_ANCHOR_LOCATION))
        @ Euler(PALM_ANCHOR_ROTATION, "XYZ").to_matrix().to_4x4())

    flower_rig.parent = anchor
    flower_rig.location = (0.0, 0.0, 0.0)
    flower_rig.scale = (FLOWER_SCALE,) * 3

    # ---- actions -------------------------------------------------------
    key_hand(rig, "HELORIA_HAND_CLOSED", [(FRAME_START, 0.0)])
    key_hand(rig, "HELORIA_HAND_OPEN", [(FRAME_START, 1.0)])
    reveal = key_hand(rig, "HELORIA_HAND_REVEAL",
                      [(p_to_frame(p), h) for p, h, _ in SYNC])

    # Flower, retimed onto the master timeline so it lags the hand.
    sync_name = "HELORIA_FLOWER_BLOOM_SYNC"
    old = bpy.data.actions.get(sync_name)
    if old:
        bpy.data.actions.remove(old)
    if flower_rig.animation_data is None:
        flower_rig.animation_data_create()
    sync = bpy.data.actions.new(sync_name)
    flower_rig.animation_data.action = sync
    for p, _h, f_open in SYNC:
        frame = int(round(p_to_frame(p)))
        scene.frame_set(frame)
        FLOWER.apply_openness(flower_rig, meta, f_open)
        for bname in meta:
            for suffix in ("_base", "_tip"):
                pb = flower_rig.pose.bones.get(bname + suffix)
                if not pb:
                    continue
                pb.keyframe_insert("rotation_euler", frame=frame)
                if suffix == "_base":
                    pb.keyframe_insert("scale", frame=frame)
    for fc in sync.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "BEZIER"
            kp.handle_left_type = "AUTO_CLAMPED"
            kp.handle_right_type = "AUTO_CLAMPED"

    rig.animation_data.action = reveal
    scene.frame_set(FRAME_START)

    return {"hand": hand, "nails": nails, "rig": rig, "flower": flower_ob,
            "flower_rig": flower_rig, "anchor": anchor, "flower_info": info,
            "meta": meta}


# Anchor placement in world space, at the rest pose. Measured from the mesh:
# the palm surface across the metacarpal heads sits at about y = -2.0, centred
# near x = -3.0, z = 8.0. The flower's stem end is put on that surface and its
# axis tilted out of the palm and slightly towards the fingertips, so the head
# faces the camera when the hand presents rather than pointing at the ceiling.
PALM_ANCHOR_LOCATION = (-3.05, -3.05, 8.55)
PALM_ANCHOR_ROTATION = (math.radians(74.0), 0.0, math.radians(-14.0))
# A 40mm flower read as a brooch pinned to the palm rather than something
# held; 55mm fills the hollow of the palm the way a real cut bloom would.
FLOWER_SCALE = 1.15


def save():
    os.makedirs(os.path.dirname(MASTER), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=MASTER)
    print("saved master:", MASTER)


if __name__ == "__main__":
    parts = build()
    save()
    print("HELORIA_MASTER_OK", parts["flower_info"])
