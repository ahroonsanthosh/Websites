#!/usr/bin/env python3
"""Grade and resize source photography into responsive WebP/JPG srcsets.
Run once from repo root: python3 scripts/process_images.py
"""
import os
from PIL import Image, ImageEnhance, ImageOps

SRC_DIR = "source-photos"
OUT_DIR = "images"
os.makedirs(OUT_DIR, exist_ok=True)

# unified warm grade applied to every photo so mixed shots read as commissioned
def grade(im: Image.Image) -> Image.Image:
    im = ImageOps.exif_transpose(im)
    im = im.convert("RGB")
    im = ImageEnhance.Color(im).enhance(1.08)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Brightness(im).enhance(1.02)
    # gentle warm tint via channel mix
    r, g, b = im.split()
    r = r.point(lambda i: min(255, int(i * 1.03)))
    b = b.point(lambda i: int(i * 0.98))
    im = Image.merge("RGB", (r, g, b))
    return im

# each entry: source file -> output basename, list of target widths (must not
# exceed the source's native width — these photos are phone photos, not stock,
# so upscaling is never an option; widths below are deliberately capped per
# source image at [~50%, ~75%, native]).
JOBS = {
    "l13.webp": ("hero-mug", [385, 575, 765], None),
    "l16.webp": ("green-mug", [385, 575, 765], None),
    "l1.webp":  ("interior-lounge", [290, 430, 574], None),
    "l4.webp":  ("interior-masks", [385, 575, 765], None),
    "l9.webp":  ("interior-nook", [290, 430, 574], None),
    "l12.webp": ("interior-threshold", [385, 575, 766], None),
    "l3.webp":  ("greenhouse", [290, 430, 574], None),
    "l5.webp":  ("counter", [385, 575, 765], None),
    "l6.webp":  ("lough-deck", [385, 575, 765], None),
    "l8.webp":  ("lough-mocktail", [385, 575, 765], None),
    "l7.webp":  ("cheesecake", [385, 575, 765], None),
    "l14.webp": ("cake-slate", [500, 900, 1360], None),
    "l2.webp":  ("pumpkin-latte", [385, 575, 765], None),
    "l10.webp": ("menu-board", [290, 430, 574], None),
    "l15.webp": ("counter-wide", [500, 900, 1360], None),
}

def save_variants(im, basename, widths):
    w0, h0 = im.size
    for w in widths:
        w = min(w, w0)
        h = round(h0 * w / w0)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(f"{OUT_DIR}/{basename}-{w}.webp", "WEBP", quality=80, method=6)
        r.save(f"{OUT_DIR}/{basename}-{w}.jpg", "JPEG", quality=82, optimize=True)

for src, (basename, widths, crop) in JOBS.items():
    im = Image.open(os.path.join(SRC_DIR, src))
    im = grade(im)
    save_variants(im, basename, widths)
    print(f"{src} -> {basename} {im.size} widths={widths}")

# OG image 1200x630 from counter-wide (l15), center-cropped
og_src = Image.open(os.path.join(SRC_DIR, "l15.webp"))
og_src = grade(og_src)
w, h = og_src.size
target_ratio = 1200 / 630
cur_ratio = w / h
if cur_ratio > target_ratio:
    new_w = int(h * target_ratio)
    left = (w - new_w) // 2
    og_src = og_src.crop((left, 0, left + new_w, h))
else:
    new_h = int(w / target_ratio)
    top = (h - new_h) // 3  # bias toward upper-middle content
    og_src = og_src.crop((0, top, w, top + new_h))
og_src = og_src.resize((1200, 630), Image.LANCZOS)
og_src.save(f"{OUT_DIR}/og-image.jpg", "JPEG", quality=85, optimize=True)
print("OG image saved.")
