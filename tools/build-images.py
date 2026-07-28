#!/usr/bin/env python3
"""Derivative generator for Blondie.

Reads the ten original photographs in assets/img/ and writes AVIF + WebP
derivatives at fixed crop ratios and widths into assets/img/out/.

Crop logic is uniform across the site: every photograph is cropped to one of
three ratios (4:5 portrait, 1:1 square, 16:9 wide) around a declared focal
point, so nothing on the page is an accidental aspect ratio.

Run:  python3 tools/build-images.py
"""
import json
import os
from PIL import Image, ImageEnhance

SRC = "assets/img"
OUT = "assets/img/out"

# name: (focal_x, focal_y) as 0..1 of the source frame.
FOCAL = {
    "bl1":  (0.42, 0.40),   # shopfront + hanging badge sign
    "bl2":  (0.50, 0.52),   # brunch plate
    "bl3":  (0.50, 0.50),   # soup + toastie
    "bl4":  (0.50, 0.50),   # chicken salad
    "bl5":  (0.50, 0.45),   # coffee, table setting
    "bl6":  (0.46, 0.42),   # room, pendant lamps
    "bl7":  (0.50, 0.50),   # red velvet
    "bl8":  (0.50, 0.50),   # cappuccino, latte art
    "bl9":  (0.50, 0.52),   # table spread with flowers
    "bl10": (0.50, 0.48),   # window seat
}

RATIOS = {"4x5": 4 / 5, "1x1": 1.0, "16x9": 16 / 9}

# which ratios each photo is actually used at
PLAN = {
    "bl1":  ["4x5"],
    "bl2":  ["4x5", "1x1"],
    "bl3":  ["4x5", "1x1"],
    "bl4":  ["4x5", "1x1"],
    "bl5":  ["4x5"],
    "bl6":  ["16x9", "4x5"],
    "bl7":  ["4x5", "1x1"],
    "bl8":  ["1x1", "4x5"],
    "bl9":  ["4x5", "16x9"],
    "bl10": ["4x5"],
}

WIDTHS = [420, 640, 900, 1280, 1600]


def crop_to(im, ratio, fx, fy):
    w, h = im.size
    cur = w / h
    if cur > ratio:            # too wide -> trim sides
        nw, nh = int(round(h * ratio)), h
    else:                      # too tall -> trim top/bottom
        nw, nh = w, int(round(w / ratio))
    left = min(max(int(fx * w - nw / 2), 0), w - nw)
    top = min(max(int(fy * h - nh / 2), 0), h - nh)
    return im.crop((left, top, left + nw, top + nh))


def graded(im):
    """One unified grade across the whole set: the source photos are shot under
    mixed overcast daylight and warm tungsten pendants, so we lift warmth
    slightly and pull a touch of contrast to make them read as one shoot."""
    im = ImageEnhance.Color(im).enhance(1.06)
    im = ImageEnhance.Contrast(im).enhance(1.04)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.015)))
    b = b.point(lambda v: int(v * 0.985))
    return Image.merge("RGB", (r, g, b))


def widths_for(base_w):
    """Every step the source can actually fill, plus its own native width so a
    small original still has a top rung and never 404s a requested size."""
    ws = [w for w in WIDTHS if w <= base_w * 1.02]
    if not ws or ws[-1] < base_w * 0.98:
        ws.append(base_w)
    return sorted(set(ws))


def main():
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for name, ratios in PLAN.items():
        src = Image.open(f"{SRC}/{name}.webp").convert("RGB")
        src = graded(src)
        fx, fy = FOCAL[name]
        for rk in ratios:
            base = crop_to(src, RATIOS[rk], fx, fy)
            sizes = []
            for w in widths_for(base.size[0]):
                h = int(round(w / RATIOS[rk]))
                im = base.resize((w, h), Image.LANCZOS)
                stem = f"{OUT}/{name}-{rk}-{w}"
                im.save(f"{stem}.avif", quality=58, speed=4)
                im.save(f"{stem}.webp", quality=76, method=6)
                sizes.append([w, h])
            manifest[f"{name}-{rk}"] = sizes
    with open(f"{OUT}/manifest.json", "w") as fh:
        json.dump(manifest, fh, indent=1, sort_keys=True)
    for k, v in sorted(manifest.items()):
        print(k, [s[0] for s in v])


if __name__ == "__main__":
    main()
