"""Render the hand/flower test frames from the production master.

Two lighting environments:
  studio  - a controlled three-light set, the primary look
  hdri    - the candidate Poly Haven sky, for comparison only

Usage:
    python tools/render_tests.py [--light studio|hdri] [--samples N]
                                 [--res WxH] [--out DIR] [--steps 0,0.25,...]
"""

from __future__ import annotations

import math
import os
import sys

import bpy
from mathutils import Euler, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MASTER = os.path.join(ROOT, "assets", "production", "heloria-hand-flower.blend")
HDRI = os.path.join(ROOT, "assets", "source", "hdri",
                    "syferfontein_6d_clear_puresky_1k.exr")

FRAME_START, FRAME_END = 1, 150

# Composition: the hand sits right of centre and reads at about two thirds of
# frame height. The empty third on the left is deliberate; large typography
# goes behind the hand there, so the shot has to be designed with that hole in
# it from the start rather than cropped for it later.
# The hand is about 23 units (230mm) tall, so the camera has to sit over a
# metre back in scene units for it to read at roughly two thirds of frame
# height. The aim point is pushed left of the hand so the hand lands right of
# centre and the empty left third stays clear for typography.
CAM_LOCATION = (11.0, -118.0, 27.0)
CAM_TARGET = (-11.5, -1.6, 12.6)
CAM_LENS = 85.0
CAM_FSTOP = 2.8


def clear_lights():
    for ob in list(bpy.data.objects):
        if ob.type in {"LIGHT", "CAMERA"}:
            bpy.data.objects.remove(ob, do_unlink=True)


def area_light(name, loc, target, size, energy, colour=(1.0, 1.0, 1.0), spread=None):
    d = bpy.data.lights.new(name, "AREA")
    d.size = size
    d.energy = energy
    d.color = colour
    if spread is not None:
        d.spread = math.radians(spread)
    o = bpy.data.objects.new(name, d)
    o.location = loc
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.collection.objects.link(o)
    return o


def studio_lighting(scene):
    """Large soft key, soft fill, subtle rim, controlled dark background.

    Energies are high because the scene is modelled at centimetre scale: the
    lights are metres away in scene units, so inverse-square costs a lot.
    """
    tgt = CAM_TARGET
    area_light("KEY", (-48.0, -52.0, 46.0), tgt, 70.0, 210000, (1.0, 0.975, 0.945))
    area_light("FILL", (42.0, -40.0, 2.0), tgt, 90.0, 52000, (0.90, 0.935, 1.0))
    area_light("RIM", (16.0, 40.0, 34.0), tgt, 40.0, 95000, (0.98, 0.97, 1.0))
    # A bounce card under the hand: without it the underside of the fingers
    # goes black and the hand stops reading as a solid object.
    area_light("BOUNCE", (-6.0, -26.0, -30.0), tgt, 80.0, 20000, (1.0, 0.94, 0.88))

    world = scene.world or bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs[0].default_value = (0.020, 0.024, 0.030, 1.0)
    bg.inputs[1].default_value = 1.0
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])


def hdri_lighting(scene):
    world = scene.world or bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    if os.path.exists(HDRI):
        env = nt.nodes.new("ShaderNodeTexEnvironment")
        env.image = bpy.data.images.load(HDRI)
        mapping = nt.nodes.new("ShaderNodeMapping")
        coord = nt.nodes.new("ShaderNodeTexCoord")
        mapping.inputs["Rotation"].default_value[2] = math.radians(135.0)
        nt.links.new(coord.outputs["Generated"], mapping.inputs["Vector"])
        nt.links.new(mapping.outputs["Vector"], env.inputs["Vector"])
        nt.links.new(env.outputs["Color"], bg.inputs["Color"])
        bg.inputs[1].default_value = 1.0
    else:
        # No HDRI present: fall back to a physical sky so the comparison can
        # still be made, and say so rather than pretending.
        print("HDRI not found at", HDRI, "- using Nishita sky instead")
        sky = nt.nodes.new("ShaderNodeTexSky")
        sky.sky_type = "NISHITA"
        sky.sun_elevation = math.radians(9.0)
        sky.sun_rotation = math.radians(135.0)
        nt.links.new(sky.outputs["Color"], bg.inputs["Color"])
        bg.inputs[1].default_value = 0.85
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])
    # A single soft key on top of the environment: a clear sky alone leaves the
    # palm, which faces away from the sun, almost unlit.
    area_light("KEY", (-44.0, -48.0, 40.0), CAM_TARGET, 60.0, 110000)


def setup_camera(scene):
    d = bpy.data.cameras.new("HELORIA_CAM")
    d.lens = CAM_LENS
    d.dof.use_dof = True
    d.dof.aperture_fstop = CAM_FSTOP
    cam = bpy.data.objects.new("HELORIA_CAM", d)
    cam.location = CAM_LOCATION
    cam.rotation_euler = (Vector(CAM_TARGET) - Vector(CAM_LOCATION)).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(cam)
    scene.camera = cam
    flower = bpy.data.objects.get("Heloria_Flower")
    if flower:
        # Focus on the flower, not the hand: after the reveal it is the subject.
        d.dof.focus_object = flower
    else:
        d.dof.focus_distance = (Vector(CAM_TARGET) - Vector(CAM_LOCATION)).length
    return cam


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]

    def opt(flag, default):
        return argv[argv.index(flag) + 1] if flag in argv else default

    light = opt("--light", "studio")
    samples = int(opt("--samples", "96"))
    res = opt("--res", "1120x700")
    out = opt("--out", os.path.join(ROOT, "assets", "renders"))
    steps = [float(x) for x in opt("--steps", "0,0.25,0.5,0.75,1.0").split(",")]
    rx, ry = (int(v) for v in res.split("x"))

    bpy.ops.wm.open_mainfile(filepath=MASTER)
    scene = bpy.context.scene
    clear_lights()
    (studio_lighting if light == "studio" else hdri_lighting)(scene)
    setup_camera(scene)

    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 8
    scene.cycles.transmission_bounces = 6
    scene.render.resolution_x = rx
    scene.render.resolution_y = ry
    scene.render.film_transparent = False
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Base Contrast"

    os.makedirs(out, exist_ok=True)
    for p in steps:
        frame = int(round(FRAME_START + p * (FRAME_END - FRAME_START)))
        scene.frame_set(frame)
        scene.render.filepath = os.path.join(out, "%s_p%03d.png" % (light, int(round(p * 100))))
        bpy.ops.render.render(write_still=True)
        print("RENDERED", light, "bloomProgress", p, "frame", frame,
              "->", scene.render.filepath)


if __name__ == "__main__":
    main()
