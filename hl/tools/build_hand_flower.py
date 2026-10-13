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

# Skin relief and roughness, tuned against measurements of the baked maps
# rather than by eye. Every one of these is re-measured after a bake: see the
# R8 note in docs/audit/02-foundation-architecture-audit.md.
SKIN_BUMP_STRENGTH = 0.55
SKIN_BUMP_DISTANCE = 0.085
SKIN_BUMP_BROAD_MIX = 0.30        # weight of the 9 mm undulation against the 4.5 mm cells

# The input ranges below are measured on this mesh, not assumed, because both
# of these signals occupy far less than 0..1 and a Map Range that spans 0..1
# therefore delivers a fraction of the amplitude it appears to ask for. That
# is the arithmetic that made the original roughness map a flat field: one
# noise mapped 0..1 -> 0.34..0.56 looks like a 0.22 spread and measured 0.0125
# of standard deviation on the baked map.
#
#   Blender noise Fac, recovered by inverting the shipped roughness map:
#     p01 0.380, mean 0.504, p99 0.629, sd 0.057
#   Pointiness, from a diagnostic bake of the raw socket on this mesh:
#     p01 0.482, mean 0.513, p99 0.533, sd 0.0105
#
# Pointiness in particular is far narrower than its nominal 0..1: a smooth
# organic mesh has no sharp edges, so the whole hand lives inside a band five
# hundredths wide.
SKIN_NOISE_FAC_RANGE = (0.38, 0.63)
SKIN_POINTINESS_RANGE = (0.482, 0.533)
SKIN_ROUGH_CONCAVE = 0.56         # folds: moist, wide scatter
SKIN_ROUGH_CONVEX = 0.38          # knuckles and tendons: dry, tighter highlight
SKIN_ROUGH_JITTER = 0.09
SKIN_ROUGH_MIN = 0.28
SKIN_ROUGH_MAX = 0.70


def make_skin_material():
    """Procedural skin.

    The prototype hand ships with its texture set unlinked and the image files
    absent, so there is nothing to restore. Rather than leave the material
    broken, the skin is rebuilt procedurally: mottled base colour, relief from
    a voronoi/noise pair, roughness that varies across the surface, and
    subsurface scattering scaled for centimetre units.

    **Feature scales are chosen against the map that has to carry them.** The
    object is 16.77 x 5.40 x 22.95 cm with 497 cm2 of evaluated surface, and
    the UV islands cover 68.2% of each map, so one texel spans:

        normal    256^2   1.055 mm
        roughness 512^2   0.527 mm
        basecolor 1024^2  0.264 mm

    Wanting four texels across a period, the finest structure the normal map
    can hold is about 4.2 mm, and the finest the roughness map can hold is
    about 2.1 mm. Object coordinates are centimetres, so a Blender noise or
    voronoi `Scale` of S has a period of 10/S millimetres, which puts the
    ceilings at S = 2.4 for anything feeding the normal and S = 4.7 for
    anything feeding roughness.

    This is the correction R8 made. The bump previously ran voronoi at 95 and
    noise at 210, which is a period of 0.105 mm and 0.048 mm: ten to twenty
    times finer than the normal map can represent. The bake averaged it to
    nothing, and the shipped map measured 0.475 degrees of mean deviation from
    flat, which is why grazing light found no surface to catch. The fix is not
    more strength, it is features the map can actually hold.
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

    # Relief, at the two scales a 256^2 map can hold. Pores are 0.1 to 0.3 mm
    # and are simply not representable here; what is representable, and what
    # actually reads at the distances this hand is seen from, is the mesoscale
    # structure: the crosshatch slack of the skin and the broader mounds over
    # the knuckles and tendons.
    vor = nt.nodes.new("ShaderNodeTexVoronoi"); vor.location = (-680, -220)
    vor.feature = "F1"
    vor.inputs["Scale"].default_value = 2.2      # 4.55 mm cells, 4.3 texels across
    nt.links.new(coord.outputs["Object"], vor.inputs["Vector"])

    micro = nt.nodes.new("ShaderNodeTexNoise"); micro.location = (-680, -430)
    micro.inputs["Scale"].default_value = 1.1    # 9.1 mm, broad slack and mounds
    micro.inputs["Detail"].default_value = 3.0   # extra octaves would land under
    micro.inputs["Roughness"].default_value = 0.45  # the map's resolution again
    nt.links.new(coord.outputs["Object"], micro.inputs["Vector"])

    bmix = nt.nodes.new("ShaderNodeMix"); bmix.data_type = "FLOAT"
    bmix.location = (-420, -300); bmix.inputs["Factor"].default_value = SKIN_BUMP_BROAD_MIX
    nt.links.new(vor.outputs["Distance"], bmix.inputs[2])
    nt.links.new(micro.outputs["Fac"], bmix.inputs[3])

    # Strength and distance are set for a measured result, not by eye: the
    # baked map is re-measured after every change and the target is a mean
    # deviation from flat of a few degrees. Skin is not a rough surface; it is
    # a smooth one with structure, and a normal map that reads as sandpaper is
    # as wrong as one that reads as vinyl.
    bump = nt.nodes.new("ShaderNodeBump"); bump.location = (-160, -320)
    bump.inputs["Strength"].default_value = SKIN_BUMP_STRENGTH
    bump.inputs["Distance"].default_value = SKIN_BUMP_DISTANCE
    nt.links.new(bmix.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

    # Roughness. The previous network was one noise mapped into 0.34 to 0.56,
    # which sounds like variation and is not: measured inside the UV islands
    # the shipped map had a standard deviation of 0.0125 around a mean of
    # 0.451, so the whole hand sat between roughly 0.44 and 0.46. One gloss
    # level over an entire object is the signature of something moulded, and
    # it was the largest single contributor to the vinyl read.
    #
    # Two signals now drive it.
    #
    # Pointiness is the convexity of the surface, and it is the only
    # anatomy-aware input available without painting a map. Convex ridges, the
    # knuckles and the tendons on the back of the hand, are exposed, stretched
    # and drier, and take a tighter highlight; the concave folds hold moisture
    # and scatter more widely. Without it the field is noise that happens to
    # be sitting on a hand, and it drifts across anatomy rather than following
    # it.
    geo = nt.nodes.new("ShaderNodeNewGeometry"); geo.location = (-900, -860)
    pmap = nt.nodes.new("ShaderNodeMapRange"); pmap.location = (-680, -860)
    pmap.inputs["From Min"].default_value = SKIN_POINTINESS_RANGE[0]
    pmap.inputs["From Max"].default_value = SKIN_POINTINESS_RANGE[1]
    # Inverted on purpose: high pointiness is convex, and convex is glossier.
    pmap.inputs["To Min"].default_value = SKIN_ROUGH_CONCAVE
    pmap.inputs["To Max"].default_value = SKIN_ROUGH_CONVEX
    pmap.clamp = True
    nt.links.new(geo.outputs["Pointiness"], pmap.inputs["Value"])

    # A mesoscale break-up on top, so neighbouring patches of the same
    # convexity are not identical. Scale 3.0 is a 3.3 mm period, which the
    # 512^2 roughness map holds with six texels across.
    rough = nt.nodes.new("ShaderNodeTexNoise"); rough.location = (-900, -640)
    rough.inputs["Scale"].default_value = 3.0
    rough.inputs["Detail"].default_value = 3.0
    nt.links.new(coord.outputs["Object"], rough.inputs["Vector"])
    rmap = nt.nodes.new("ShaderNodeMapRange"); rmap.location = (-680, -640)
    rmap.inputs["From Min"].default_value = SKIN_NOISE_FAC_RANGE[0]
    rmap.inputs["From Max"].default_value = SKIN_NOISE_FAC_RANGE[1]
    rmap.inputs["To Min"].default_value = -SKIN_ROUGH_JITTER
    rmap.inputs["To Max"].default_value = SKIN_ROUGH_JITTER
    rmap.clamp = True
    nt.links.new(rough.outputs["Fac"], rmap.inputs["Value"])

    radd = nt.nodes.new("ShaderNodeMath"); radd.operation = "ADD"
    radd.location = (-420, -760)
    nt.links.new(pmap.outputs["Result"], radd.inputs[0])
    nt.links.new(rmap.outputs["Result"], radd.inputs[1])

    # Clamped, because neither end is physical for skin: below about 0.28 it
    # becomes wet-looking, above about 0.70 it goes chalky.
    rclamp = nt.nodes.new("ShaderNodeClamp"); rclamp.location = (-200, -760)
    rclamp.inputs["Min"].default_value = SKIN_ROUGH_MIN
    rclamp.inputs["Max"].default_value = SKIN_ROUGH_MAX
    nt.links.new(radd.outputs[0], rclamp.inputs["Value"])
    nt.links.new(rclamp.outputs["Result"], bsdf.inputs["Roughness"])

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


# The named actions the master is required to carry. Two of them are the
# animation the web asset is exported from; the other three are the pose
# library, which is how the motion gets re-derived or re-timed later without
# guessing at frame numbers.
#
#   HELORIA_HAND_CLOSED        the closed hand, one keyframe
#   HELORIA_HAND_OPEN          the open hand, one keyframe
#   HELORIA_HAND_REVEAL        the hand animation, exported
#   HELORIA_FLOWER_BLOOM       the bloom in its own timing, one keyframe per key
#   HELORIA_FLOWER_BLOOM_SYNC  the bloom retimed onto the master timeline,
#                              exported, and lagging the hand
PERSISTED_ACTIONS = (
    "HELORIA_HAND_CLOSED",
    "HELORIA_HAND_OPEN",
    "HELORIA_HAND_REVEAL",
    "HELORIA_FLOWER_BLOOM",
    "HELORIA_FLOWER_BLOOM_SYNC",
)


def verify_persisted_actions():
    """Fail the build rather than save a master that is missing an action.

    Checked before the file is written, because the failure this guards against
    is silent: a zero-user action is simply absent from the saved file, and
    nothing in the build reports it.
    """
    missing = [n for n in PERSISTED_ACTIONS if n not in bpy.data.actions]
    if missing:
        raise SystemExit(f"actions: not created: {missing}")
    unprotected = [
        n for n in PERSISTED_ACTIONS
        if not bpy.data.actions[n].use_fake_user and bpy.data.actions[n].users == 0
    ]
    if unprotected:
        raise SystemExit(f"actions: would not survive the save: {unprotected}")
    for n in PERSISTED_ACTIONS:
        a = bpy.data.actions[n]
        print(f"  {n:28s} fcurves={len(a.fcurves):4d} "
              f"frames={a.frame_range[0]:.0f}..{a.frame_range[1]:.0f} "
              f"users={a.users} fake={a.use_fake_user}")


def key_hand(rig, name, frames):
    act = bpy.data.actions.get(name)
    if act:
        bpy.data.actions.remove(act)
    if rig.animation_data is None:
        rig.animation_data_create()
    act = bpy.data.actions.new(name)
    # A fake user, or this action does not survive the save.
    #
    # Each call assigns its new action to the rig, which drops the previous one
    # to zero users, and Blender does not write zero-user datablocks. The three
    # actions built here are CLOSED, OPEN and REVEAL, and only the last one to
    # be assigned was ever in the file: re-opening the master gave no way to
    # reach the closed or open pose except by scrubbing to frame 1 or 150.
    #
    # It is set on all three rather than only the two that happen to be
    # orphaned, so persistence does not depend on assignment order or on which
    # action is left active at save time.
    act.use_fake_user = True
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
    sync.use_fake_user = True
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

    verify_persisted_actions()

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
