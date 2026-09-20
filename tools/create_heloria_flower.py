"""Generate the Heloria flower.

A bespoke, deterministic, rerunnable flower generator. No downloaded or
marketplace geometry, no photographic textures.

Design intent
-------------
The flower has to read as botanically plausible in a close-up while still
belonging to Heloria rather than to a stock library. It is built as a
star-form flower with eight recurved primary petals and a tighter inner whorl
of five, closest in habit to a wood anemone, deliberately not a rose.

The distinctive quality is in three places, all of them geometric rather than
decorative, so they survive in any renderer:

1. Every petal carries a raised median ridge that splits into five shallow
   veins towards the tip, so grazing light produces a real highlight break
   instead of a flat sheen.
2. Petal tips are very slightly recurved and asymmetric: one edge sits higher
   than the other, and the amount differs per petal.
3. No radial symmetry. Yaw, length, curl, twist and cup are all perturbed per
   petal from a fixed seed, so the flower is reproducible but never mechanical.

Colour is carried in a vertex colour attribute rather than a texture: a pale
bone white that cools towards a desaturated violet at the petal base. That
keeps the flower textureless, which means it costs nothing to transfer and
survives glTF export intact as COLOR_0.

Scale: built in the same centimetre-scale units as the hand asset, so the open
flower is about 5.4 units (54 mm) across and sits in a cupped palm.

Usage
-----
    blender --background --python tools/create_heloria_flower.py -- --output out.blend

or import `build_flower()` from another Blender script.
"""

from __future__ import annotations

import math
import random
import sys

import bpy
import bmesh
from mathutils import Euler, Matrix, Vector

# --------------------------------------------------------------------------
# Determinism
# --------------------------------------------------------------------------

SEED = 20260920

# --------------------------------------------------------------------------
# Proportions, in centimetre-scale units to match the hand asset
# --------------------------------------------------------------------------

PRIMARY_COUNT = 8
SECONDARY_COUNT = 5
SEPAL_COUNT = 5

PRIMARY_LENGTH = 2.45
PRIMARY_WIDTH = 0.62
SECONDARY_LENGTH = 1.42
SECONDARY_WIDTH = 0.38

CENTRE_RADIUS = 0.34
# Short: the flower is held in a palm, so a long stem would have to pass
# through the hand. 1.15 units reaches the palm surface and stops.
STEM_LENGTH = 0.60
STEM_RADIUS = 0.115

# Length and width resolution of a petal sheet. High enough that the petal
# deforms smoothly under a two-bone chain without faceting on the silhouette.
PETAL_U = 14
PETAL_V = 9

PETAL_THICKNESS = 0.022

# Colours, linear scene-referred. Deliberately low saturation: the brand is
# near-monochrome and a saturated flower would fight it.
PETAL_TIP_COLOUR = (0.905, 0.887, 0.858)
PETAL_BASE_COLOUR = (0.470, 0.430, 0.520)
CENTRE_COLOUR = (0.372, 0.318, 0.155)
STEM_COLOUR = (0.128, 0.152, 0.088)
SEPAL_COLOUR = (0.150, 0.172, 0.101)
RECEPTACLE_COLOUR = (0.300, 0.318, 0.150)
STAMEN_FILAMENT_COLOUR = (0.880, 0.845, 0.700)
ANTHER_COLOUR = (0.420, 0.300, 0.105)

NAMES = {
    "mesh": "Heloria_Flower",
    "armature_obj": "Heloria_Flower_Rig",
    "armature_data": "Heloria_Flower_Armature",
    "root_bone": "flower_root",
    "stem_bone": "flower_stem",
    "centre_bone": "flower_centre",
    "action": "HELORIA_FLOWER_BLOOM",
}


# --------------------------------------------------------------------------
# Small maths helpers
# --------------------------------------------------------------------------

def smoothstep(edge0: float, edge1: float, x: float) -> float:
    if edge1 == edge0:
        return 0.0 if x < edge0 else 1.0
    t = min(1.0, max(0.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)


def lerp(a, b, t):
    if isinstance(a, tuple):
        return tuple(x + (y - x) * t for x, y in zip(a, b))
    return a + (b - a) * t


# --------------------------------------------------------------------------
# Petal construction
# --------------------------------------------------------------------------

class PetalParams:
    """Everything that makes one petal differ from its neighbours."""

    def __init__(self, rng: random.Random, index: int, count: int,
                 length: float, width: float, primary: bool):
        self.index = index
        # Yaw is perturbed so petals are not evenly spaced around the axis.
        self.yaw = (2.0 * math.pi * index / count) + rng.uniform(-0.085, 0.085)
        if not primary:
            # Offset the inner whorl so it sits between the outer petals.
            self.yaw += math.pi / count
        self.length = length * rng.uniform(0.93, 1.07)
        self.width = width * rng.uniform(0.92, 1.08)
        # Pitch: how steeply the petal leaves the receptacle.
        self.pitch = math.radians(rng.uniform(52.0, 62.0) if primary
                                  else rng.uniform(63.0, 72.0))
        # Curl: total bend from base to tip. Positive bends the petal outward
        # and down, which is what gives the recurved, open habit.
        self.curl = math.radians(rng.uniform(74.0, 92.0) if primary
                                 else rng.uniform(52.0, 66.0))
        self.twist = math.radians(rng.uniform(-9.0, 9.0))
        self.cup = rng.uniform(0.30, 0.46)
        self.asymmetry = rng.uniform(-0.13, 0.13)
        self.tip_lift = rng.uniform(0.04, 0.13)
        self.ridge = rng.uniform(0.055, 0.085)
        self.primary = primary
        self.tint = rng.uniform(-0.035, 0.035)


def petal_halfwidth(u: float, p: PetalParams) -> float:
    """Width profile: a narrow claw at the base, widest just past halfway,
    drawn to a point at the tip."""
    body = 0.19 + 0.92 * math.sin(math.pi * (u ** 0.93)) ** 0.85
    tip = 1.0 - 0.82 * smoothstep(0.78, 1.0, u) ** 1.7
    return p.width * body * tip


def petal_centreline(p: PetalParams, samples: int):
    """Integrate the petal's spine in its own 2D plane (x out, z up)."""
    pts = []
    tangents = []
    x, z = 0.0, 0.0
    ds = p.length / (samples - 1)
    for i in range(samples):
        u = i / (samples - 1)
        # Bend accelerates towards the tip, then the last stretch lifts very
        # slightly: that small recurve is what stops the petal reading as a
        # bent card.
        theta = p.pitch - p.curl * (u ** 1.32) + p.tip_lift * smoothstep(0.78, 1.0, u)
        t = Vector((math.cos(theta), 0.0, math.sin(theta)))
        pts.append(Vector((x, 0.0, z)))
        tangents.append(t)
        x += t.x * ds
        z += t.z * ds
    return pts, tangents


def build_petal_verts(p: PetalParams, origin: Vector, base_radius: float):
    """Return (verts, faces, uvs_u, spine_world) for one petal sheet."""
    spine, tangents = petal_centreline(p, PETAL_U)
    verts = []
    uu = []
    yaw = Matrix.Rotation(p.yaw, 3, "Z")

    for i in range(PETAL_U):
        u = i / (PETAL_U - 1)
        hw = petal_halfwidth(u, p)
        t = tangents[i]
        # Frame across the petal: n is the surface normal, b the width axis.
        b = Vector((0.0, 1.0, 0.0))
        n = t.cross(b).normalized() * -1.0
        twist = Matrix.Rotation(p.twist * u, 3, t)
        b_t = twist @ b
        n_t = twist @ n
        for j in range(PETAL_V):
            v = -1.0 + 2.0 * j / (PETAL_V - 1)
            # Asymmetric widening: one edge runs slightly wider towards the tip.
            side = hw * (1.0 + p.asymmetry * (1.0 if v > 0 else -1.0) * u)
            across = v * side
            # Cup across the width, plus the median ridge and its five veins.
            cup = -p.cup * hw * (v * v)
            ridge = p.ridge * hw * (1.0 - v * v) ** 2.2
            veins = 0.16 * p.ridge * hw * math.cos(5.0 * math.pi * v) * smoothstep(0.25, 0.95, u)
            lift = cup + ridge + veins
            local = spine[i] + b_t * across + n_t * lift
            verts.append(origin + (yaw @ Vector((local.x + base_radius, local.y, local.z))))
            uu.append(u)

    faces = []
    for i in range(PETAL_U - 1):
        for j in range(PETAL_V - 1):
            a = i * PETAL_V + j
            faces.append((a, a + 1, a + PETAL_V + 1, a + PETAL_V))

    spine_world = [origin + (yaw @ Vector((s.x + base_radius, s.y, s.z))) for s in spine]
    return verts, faces, uu, spine_world


# --------------------------------------------------------------------------
# Other flower parts
# --------------------------------------------------------------------------

def build_centre(rng: random.Random, origin: Vector):
    """Receptacle dome plus a ring of stamens. Kept cheap: the centre is small
    on screen, but a flat disc there reads as fake immediately."""
    verts, faces, colours = [], [], []

    rings, segs = 5, 16
    base = len(verts)
    for r in range(rings + 1):
        a = (r / rings) * (math.pi * 0.5)
        y = math.sin(a) * CENTRE_RADIUS * 0.62
        rad = math.cos(a) * CENTRE_RADIUS
        for si in range(segs):
            th = 2.0 * math.pi * si / segs
            verts.append(origin + Vector((math.cos(th) * rad, math.sin(th) * rad, y)))
            colours.append(RECEPTACLE_COLOUR)
    for r in range(rings):
        for si in range(segs):
            a = base + r * segs + si
            b = base + r * segs + (si + 1) % segs
            c = base + (r + 1) * segs + (si + 1) % segs
            d = base + (r + 1) * segs + si
            faces.append((a, b, c, d))

    # Two whorls of stamens, hexagonal in section so the filament silhouette is
    # round rather than square, with a distinctly swollen anther at the tip.
    # The anthers carry their own colour through the vertex attribute, because
    # a uniformly cream centre is the most common tell of a generated flower.
    stamen_count = 36
    for k in range(stamen_count):
        inner = (k % 3 == 0)
        th = 2.0 * math.pi * k / stamen_count + rng.uniform(-0.05, 0.05)
        lean = rng.uniform(0.22, 0.40) if inner else rng.uniform(0.34, 0.58)
        height = CENTRE_RADIUS * (rng.uniform(1.25, 1.70) if inner
                                  else rng.uniform(1.70, 2.35))
        rad = CENTRE_RADIUS * (rng.uniform(0.28, 0.48) if inner
                               else rng.uniform(0.58, 0.86))
        start = origin + Vector((math.cos(th) * rad, math.sin(th) * rad, CENTRE_RADIUS * 0.40))
        tip = start + Vector((math.cos(th) * lean * height, math.sin(th) * lean * height, height))
        seg_n, side_n = 4, 6
        thick = CENTRE_RADIUS * 0.034
        ring0 = len(verts)
        for si in range(seg_n + 1):
            t = si / seg_n
            centre = start.lerp(tip, t)
            # Taper up the filament, then swell into the anther.
            r_here = (thick * (1.0 - 0.42 * t)
                      + thick * 2.9 * smoothstep(0.62, 0.92, t) * (1.0 - 0.55 * smoothstep(0.92, 1.0, t)))
            for q in range(side_n):
                qa = 2.0 * math.pi * q / side_n + th
                verts.append(centre + Vector((math.cos(qa) * r_here, math.sin(qa) * r_here, 0.0)))
                anther = smoothstep(0.58, 0.86, t)
                colours.append(lerp(STAMEN_FILAMENT_COLOUR, ANTHER_COLOUR, anther))
        for si in range(seg_n):
            for q in range(side_n):
                a = ring0 + si * side_n + q
                b = ring0 + si * side_n + (q + 1) % side_n
                c = ring0 + (si + 1) * side_n + (q + 1) % side_n
                d = ring0 + (si + 1) * side_n + q
                faces.append((a, b, c, d))
        cap = ring0 + seg_n * side_n
        faces.append(tuple(cap + q for q in range(side_n)))

    return verts, faces, colours


def build_stem(origin: Vector):
    verts, faces = [], []
    segs, sides = 5, 10
    for s in range(segs + 1):
        t = s / segs
        z = -t * STEM_LENGTH
        # Slightly thicker where it meets the receptacle.
        r = STEM_RADIUS * (1.0 + 0.55 * (1.0 - t) ** 2.4)
        # A gentle lean, so the stem is not a perfect cylinder on an axis.
        lean = Vector((0.052 * STEM_LENGTH * t ** 1.6, 0.021 * STEM_LENGTH * t ** 1.4, 0.0))
        for q in range(sides):
            a = 2.0 * math.pi * q / sides
            verts.append(origin + lean + Vector((math.cos(a) * r, math.sin(a) * r, z)))
    for s in range(segs):
        for q in range(sides):
            a = s * sides + q
            b = s * sides + (q + 1) % sides
            c = (s + 1) * sides + (q + 1) % sides
            d = (s + 1) * sides + q
            faces.append((a, b, c, d))
    faces.append(tuple(segs * sides + q for q in range(sides))[::-1])
    return verts, faces


# --------------------------------------------------------------------------
# Assembly
# --------------------------------------------------------------------------

def _purge(name: str):
    ob = bpy.data.objects.get(name)
    if ob:
        data = ob.data
        bpy.data.objects.remove(ob, do_unlink=True)
        for coll in (bpy.data.meshes, bpy.data.armatures):
            if data and data.name in coll:
                try:
                    coll.remove(data)
                except Exception:
                    pass


def make_materials():
    """Four materials, all physically based, none of them photographic."""
    mats = {}

    def principled(name, base, roughness, subsurface=0.0, sss_radius=(1.0, 0.5, 0.3),
                   sss_scale=0.06, ior=1.42, bump=0.0, bump_scale=48.0):
        mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
        mat.use_nodes = True
        nt = mat.node_tree
        nt.nodes.clear()
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        out.location = (520, 0)
        bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
        bsdf.location = (200, 0)
        bsdf.inputs["Base Color"].default_value = (*base, 1.0)
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["IOR"].default_value = ior
        bsdf.inputs["Metallic"].default_value = 0.0
        bsdf.inputs["Specular IOR Level"].default_value = 0.42
        if subsurface > 0.0:
            bsdf.inputs["Subsurface Weight"].default_value = subsurface
            bsdf.inputs["Subsurface Radius"].default_value = sss_radius
            bsdf.inputs["Subsurface Scale"].default_value = sss_scale
        if bump > 0.0:
            # Micro-relief only. The readable structure (ridge, veins) is in
            # the geometry; this is the cellular roughness on top of it.
            noise = nt.nodes.new("ShaderNodeTexNoise")
            noise.location = (-320, -240)
            noise.inputs["Scale"].default_value = bump_scale
            noise.inputs["Detail"].default_value = 6.0
            noise.inputs["Roughness"].default_value = 0.55
            bmp = nt.nodes.new("ShaderNodeBump")
            bmp.location = (-60, -240)
            bmp.inputs["Strength"].default_value = bump
            bmp.inputs["Distance"].default_value = 0.004
            nt.links.new(noise.outputs["Fac"], bmp.inputs["Height"])
            nt.links.new(bmp.outputs["Normal"], bsdf.inputs["Normal"])
        nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
        return mat, nt, bsdf

    # PETAL: the colour comes from the baked vertex attribute, multiplied by a
    # neutral tint, so the base-to-tip gradient needs no texture.
    mat, nt, bsdf = principled(
        "HELORIA_PETAL", (1.0, 1.0, 1.0), 0.38,
        subsurface=0.34, sss_radius=(0.62, 0.42, 0.52), sss_scale=0.10,
        ior=1.40, bump=0.22, bump_scale=70.0)
    col = nt.nodes.new("ShaderNodeVertexColor")
    col.layer_name = "Col"
    col.location = (-320, 120)
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.location = (-60, 120)
    mix.inputs["Factor"].default_value = 1.0
    mix.inputs[6].default_value = (1.0, 1.0, 1.0, 1.0)
    nt.links.new(col.outputs["Color"], mix.inputs[7])
    nt.links.new(mix.outputs[2], bsdf.inputs["Base Color"])
    mats["PETAL"] = mat

    mat_c, nt_c, bsdf_c = principled("HELORIA_CENTRE", (1.0, 1.0, 1.0), 0.56,
                                     subsurface=0.12, bump=0.34, bump_scale=190.0)
    col_c = nt_c.nodes.new("ShaderNodeVertexColor")
    col_c.layer_name = "Col"
    col_c.location = (-320, 120)
    nt_c.links.new(col_c.outputs["Color"], bsdf_c.inputs["Base Color"])
    mats["CENTRE"] = mat_c
    mats["STEM"] = principled("HELORIA_STEM", STEM_COLOUR, 0.60,
                              subsurface=0.18, sss_radius=(0.30, 0.45, 0.22),
                              bump=0.28, bump_scale=110.0)[0]
    mats["SEPAL"] = principled("HELORIA_SEPAL", SEPAL_COLOUR, 0.52,
                               subsurface=0.26, sss_radius=(0.32, 0.46, 0.24),
                               bump=0.24, bump_scale=95.0)[0]
    return mats


def build_flower(collection=None, origin=Vector((0.0, 0.0, 0.0))):
    """Build mesh + armature + bloom action. Returns (mesh_obj, rig_obj, info)."""
    rng = random.Random(SEED)
    scene = bpy.context.scene
    collection = collection or scene.collection

    _purge(NAMES["mesh"])
    _purge(NAMES["armature_obj"])

    all_verts = []
    all_faces = []
    material_index = []
    group_of_vert = {}     # vertex index -> (group name, weight_u)
    vert_colour = {}       # vertex index -> rgb, for parts that colour themselves
    petal_spines = {}      # bone base name -> world spine points
    petal_meta = {}

    def add_block(verts, faces, mat_idx, group=None, uu=None, colours=None):
        base = len(all_verts)
        all_verts.extend(verts)
        if colours:
            for k, c in enumerate(colours):
                vert_colour[base + k] = c
        for f in faces:
            all_faces.append(tuple(base + i for i in f))
            material_index.append(mat_idx)
        if group:
            for k in range(len(verts)):
                group_of_vert[base + k] = (group, uu[k] if uu else 0.0)
        return base

    # ---- petals -----------------------------------------------------------
    specs = []
    for i in range(PRIMARY_COUNT):
        specs.append(("p%d" % (i + 1), PetalParams(rng, i, PRIMARY_COUNT,
                                                   PRIMARY_LENGTH, PRIMARY_WIDTH, True)))
    for i in range(SECONDARY_COUNT):
        specs.append(("s%d" % (i + 1), PetalParams(rng, i, SECONDARY_COUNT,
                                                   SECONDARY_LENGTH, SECONDARY_WIDTH, False)))

    for key, p in specs:
        base_r = CENTRE_RADIUS * (0.86 if p.primary else 0.60)
        v, f, uu, spine = build_petal_verts(p, origin, base_r)
        add_block(v, f, 0, group="petal_%s" % key, uu=uu)
        petal_spines["petal_%s" % key] = spine
        petal_meta["petal_%s" % key] = p

    # ---- sepals -----------------------------------------------------------
    for i in range(SEPAL_COUNT):
        sp = PetalParams(rng, i, SEPAL_COUNT, 0.82, 0.26, False)
        sp.pitch = math.radians(rng.uniform(-24.0, -12.0))
        sp.curl = math.radians(rng.uniform(26.0, 44.0))
        sp.cup = 0.22
        v, f, uu, _ = build_petal_verts(sp, origin + Vector((0.0, 0.0, -0.10)),
                                        CENTRE_RADIUS * 0.52)
        add_block(v, f, 3, group="flower_base", uu=None)

    # ---- centre and stem --------------------------------------------------
    v, f, cols = build_centre(rng, origin)
    add_block(v, f, 1, group="flower_centre", uu=None, colours=cols)
    v, f = build_stem(origin + Vector((0.0, 0.0, -0.06)))
    add_block(v, f, 2, group="flower_stem", uu=None)

    # ---- mesh datablock ---------------------------------------------------
    me = bpy.data.meshes.new(NAMES["mesh"])
    me.from_pydata([tuple(v) for v in all_verts], [], all_faces)
    me.validate()
    for poly, mi in zip(me.polygons, material_index):
        poly.material_index = mi
        poly.use_smooth = True
    me.update()

    ob = bpy.data.objects.new(NAMES["mesh"], me)
    collection.objects.link(ob)

    mats = make_materials()
    for key in ("PETAL", "CENTRE", "STEM", "SEPAL"):
        me.materials.append(mats[key])

    # ---- vertex colours ---------------------------------------------------
    # Base-to-tip gradient per petal, with a per-petal tint offset. This is the
    # flower's entire colour treatment: no texture is used anywhere.
    attr = me.color_attributes.new(name="Col", type="FLOAT_COLOR", domain="POINT")
    for idx in range(len(me.vertices)):
        grp = group_of_vert.get(idx)
        if grp and grp[0].startswith("petal_"):
            u = grp[1]
            p = petal_meta[grp[0]]
            t = smoothstep(0.02, 0.62, u)
            c = lerp(PETAL_BASE_COLOUR, PETAL_TIP_COLOUR, t)
            c = tuple(min(1.0, max(0.0, x + p.tint * (1.0 - 0.5 * t))) for x in c)
        elif idx in vert_colour:
            c = vert_colour[idx]
        else:
            c = (1.0, 1.0, 1.0)
        attr.data[idx].color = (*c, 1.0)

    # ---- vertex groups ----------------------------------------------------
    static_groups = {"flower_base", "flower_centre", "flower_stem"}
    groups = {}
    for name in sorted({g for g, _ in group_of_vert.values()}):
        if name in static_groups:
            groups[name] = ob.vertex_groups.new(name=name)
        else:
            groups[name + "_base"] = ob.vertex_groups.new(name=name + "_base")
            groups[name + "_tip"] = ob.vertex_groups.new(name=name + "_tip")

    for idx, (name, u) in group_of_vert.items():
        if name in static_groups:
            target = {"flower_base": NAMES["root_bone"],
                      "flower_centre": NAMES["centre_bone"],
                      "flower_stem": NAMES["stem_bone"]}[name]
            grp = groups.get(name)
            grp.name = target
            grp.add([idx], 1.0, "REPLACE")
        else:
            # A two-bone chain per petal. The blend is wide so the petal bends
            # as a continuous surface rather than hinging.
            w_tip = smoothstep(0.26, 0.82, u)
            groups[name + "_base"].add([idx], 1.0 - w_tip, "REPLACE")
            groups[name + "_tip"].add([idx], w_tip, "REPLACE")

    # ---- thickness --------------------------------------------------------
    # Solidify rather than modelled shells: it keeps the source sheet editable
    # and gives an even, believable petal edge.
    solid = ob.modifiers.new("PetalThickness", "SOLIDIFY")
    solid.thickness = PETAL_THICKNESS
    solid.offset = 0.0
    solid.use_even_offset = True
    solid.use_rim = True
    solid.use_rim_only = False

    # ---- armature ---------------------------------------------------------
    arm = bpy.data.armatures.new(NAMES["armature_data"])
    rig = bpy.data.objects.new(NAMES["armature_obj"], arm)
    collection.objects.link(rig)

    view = bpy.context.view_layer
    view.objects.active = rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")

    eb = arm.edit_bones
    root = eb.new(NAMES["root_bone"])
    root.head = origin + Vector((0.0, 0.0, -0.12))
    root.tail = origin + Vector((0.0, 0.0, 0.16))

    stem_b = eb.new(NAMES["stem_bone"])
    stem_b.head = origin + Vector((0.0, 0.0, -0.06))
    stem_b.tail = origin + Vector((0.0, 0.0, -0.06 - STEM_LENGTH))
    stem_b.parent = root

    centre_b = eb.new(NAMES["centre_bone"])
    centre_b.head = origin + Vector((0.0, 0.0, 0.0))
    centre_b.tail = origin + Vector((0.0, 0.0, CENTRE_RADIUS * 1.6))
    centre_b.parent = root

    mid = PETAL_U // 2
    for name, spine in petal_spines.items():
        p = petal_meta[name]
        b0 = eb.new(name + "_base")
        b0.head = spine[0]
        b0.tail = spine[mid]
        b0.parent = root
        b1 = eb.new(name + "_tip")
        b1.head = spine[mid]
        b1.tail = spine[-1]
        b1.parent = b0
        b1.use_connect = True
        # Roll the bones so local Z is the petal's surface normal. Curling the
        # petal is then a single rotation about local X, for every petal, which
        # is what makes the bloom animation writable by hand.
        for bone, a, b in ((b0, spine[0], spine[mid]), (b1, spine[mid], spine[-1])):
            along = (Vector(b) - Vector(a)).normalized()
            radial = Vector((math.cos(p.yaw), math.sin(p.yaw), 0.0))
            side = along.cross(radial)
            if side.length < 1e-5:
                side = Vector((0.0, 1.0, 0.0))
            normal = side.normalized().cross(along).normalized()
            bone.align_roll(normal)

    bpy.ops.object.mode_set(mode="OBJECT")

    ob.parent = rig
    mod = ob.modifiers.new("Armature", "ARMATURE")
    mod.object = rig
    # Armature must evaluate before thickness, or the shell shears on bend.
    ob.modifiers.move(ob.modifiers.find("Armature"), 0)

    for pb in rig.pose.bones:
        pb.rotation_mode = "XYZ"

    info = {
        "petal_bones": sorted(petal_spines.keys()),
        "primary": ["petal_p%d" % (i + 1) for i in range(PRIMARY_COUNT)],
        "secondary": ["petal_s%d" % (i + 1) for i in range(SECONDARY_COUNT)],
        "triangles": sum(len(f) - 2 for f in all_faces),
        "vertices": len(all_verts),
    }
    return ob, rig, info


# --------------------------------------------------------------------------
# Bloom animation
# --------------------------------------------------------------------------

# The flower is modelled open, because the open state is the one the viewer
# studies. Closing is done by the rig, which also means any intermediate state
# is a real pose rather than an interpolation between two sculpts.

# Measured, not guessed. A sweep of base/tip rotations against the evaluated
# mesh gave the narrowest, tallest bud at these values: past about -70 degrees
# the petals arch back over the top and the bud opens out again.
CLOSED_BASE = math.radians(-64.0)   # about local X: lifts the petal upright
CLOSED_TIP = math.radians(-24.0)
CLOSED_SPIRAL = math.radians(12.0)  # about local Y: overlaps petals like a bud
CLOSED_SCALE = 0.92

BLOOM_KEYS = [
    # frame, openness 0..1 for primaries
    (1, 0.00),
    (20, 0.035),
    (40, 0.20),
    (60, 0.46),
    (80, 0.78),
    (100, 1.00),
    (115, 0.975),   # settle: petals relax back very slightly
]


def petal_phase(index: int, count: int, primary: bool) -> float:
    """Staggered start per petal, so the bud does not unwrap as one piece."""
    if primary:
        # Alternating lead/lag around the whorl, not a simple sweep.
        return 0.14 * ((index * 3) % count) / max(1, count - 1)
    return 0.22 + 0.10 * (index / max(1, count - 1))


def apply_openness(rig, meta, openness: float):
    """Pose the whole flower at a given openness. Used for keying and for
    direct scrubbing."""
    for name, p in meta.items():
        count = PRIMARY_COUNT if p.primary else SECONDARY_COUNT
        phase = petal_phase(p.index, count, p.primary)
        # Remap global openness through this petal's own delay and rate.
        local = smoothstep(phase, min(1.0, phase + 0.80), openness)
        # Each petal travels a slightly different distance.
        gain_b = 1.0 + (0.10 if p.primary else -0.06) * math.sin(p.index * 2.399)
        gain_t = 1.0 + 0.14 * math.cos(p.index * 1.732)
        for suffix, closed, gain in (("_base", CLOSED_BASE, gain_b),
                                     ("_tip", CLOSED_TIP, gain_t)):
            pb = rig.pose.bones.get(name + suffix)
            if not pb:
                continue
            pb.rotation_euler[0] = closed * gain * (1.0 - local)
            pb.rotation_euler[1] = CLOSED_SPIRAL * (1.0 - local) * (1.0 if p.primary else -1.0)
            if suffix == "_base":
                s = 1.0 + (CLOSED_SCALE - 1.0) * (1.0 - local)
                pb.scale = (s, 1.0, s)


def create_bloom_action(rig, meta):
    action = bpy.data.actions.get(NAMES["action"])
    if action:
        bpy.data.actions.remove(action)
    if rig.animation_data is None:
        rig.animation_data_create()
    action = bpy.data.actions.new(NAMES["action"])
    rig.animation_data.action = action

    for frame, openness in BLOOM_KEYS:
        bpy.context.scene.frame_set(frame)
        apply_openness(rig, meta, openness)
        for name in meta:
            for suffix in ("_base", "_tip"):
                pb = rig.pose.bones.get(name + suffix)
                if not pb:
                    continue
                pb.keyframe_insert("rotation_euler", frame=frame)
                if suffix == "_base":
                    pb.keyframe_insert("scale", frame=frame)

    for fc in action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "BEZIER"
            kp.handle_left_type = "AUTO_CLAMPED"
            kp.handle_right_type = "AUTO_CLAMPED"
    return action


def main():
    argv = sys.argv
    out = None
    if "--" in argv:
        rest = argv[argv.index("--") + 1:]
        if "--output" in rest:
            out = rest[rest.index("--output") + 1]

    # Fresh scene when run standalone.
    bpy.ops.wm.read_factory_settings(use_empty=True)
    ob, rig, info = build_flower()

    rng = random.Random(SEED)
    meta = {}
    for i in range(PRIMARY_COUNT):
        meta["petal_p%d" % (i + 1)] = PetalParams(rng, i, PRIMARY_COUNT,
                                                  PRIMARY_LENGTH, PRIMARY_WIDTH, True)
    for i in range(SECONDARY_COUNT):
        meta["petal_s%d" % (i + 1)] = PetalParams(rng, i, SECONDARY_COUNT,
                                                  SECONDARY_LENGTH, SECONDARY_WIDTH, False)
    create_bloom_action(rig, meta)

    print("HELORIA_FLOWER", info)
    if out:
        bpy.ops.wm.save_as_mainfile(filepath=out)
        print("saved", out)


if __name__ == "__main__":
    main()
