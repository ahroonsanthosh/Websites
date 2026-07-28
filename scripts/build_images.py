#!/usr/bin/env python3
"""Generate responsive WebP + JPEG fallback variants from the source photos.
Run manually with `python3 scripts/build_images.py` after adding/replacing a
source image in assets/images/*-src.webp. Not part of the deploy pipeline."""
import os
from PIL import Image, ImageOps

SRC_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "images")

# name -> (src filename, widths to emit, optional crop box ratio (l,t,r,b) 0-1 for
# a desktop-specific crop and/or a mobile-specific crop, both relative to the
# original source image)
JOBS = {
    "storefront": {
        "src": "storefront-src.webp",
        "widths": [640, 960, 1280, 1920],
        "mobile_crop": (0.368, 0.0, 0.779, 1.0),  # portrait crop centered on the BALANCE sign + doorway
        "mobile_widths": [480, 750, 960],
    },
    "hero": {
        "src": "grazing-board-src.webp",
        # source is a 765px-wide phone photo — widths capped to what's actually
        # native (no fake upscaled srcset entries); the browser/CSS handles any
        # further upscaling to fill wider viewports via object-fit: cover.
        "widths": [480, 640, 765],
        # wide band across the rich cheese/fruit/charcuterie centre of the board,
        # cropping out the cluttered wooden boards + hand at the top of the frame
        "desktop_crop": (0.0, 0.4216, 1.0, 0.8157),
        "mobile_crop": (0.2170, 0.3, 0.7765, 1.0),
        "mobile_widths": [320, 428],
    },
    "avocado-toast": {"src": "avocado-toast-src.webp", "widths": [480, 720, 960]},
    "grazing-board": {"src": "grazing-board-src.webp", "widths": [480, 720, 960]},
    "full-breakfast": {"src": "full-breakfast-src.webp", "widths": [480, 720, 960]},
    "veg-plate": {"src": "veg-plate-src.webp", "widths": [480, 720, 960]},
    "signage": {"src": "signage-src.webp", "widths": [480, 720]},
    "menu": {"src": "menu-src.webp", "widths": [640, 1000, 1360]},
}


def emit(im, name, width, suffix=""):
    w = min(width, im.width)
    h = round(im.height * (w / im.width))
    resized = im.resize((w, h), Image.LANCZOS)
    webp_path = os.path.join(SRC_DIR, f"{name}{suffix}-{width}.webp")
    jpg_path = os.path.join(SRC_DIR, f"{name}{suffix}-{width}.jpg")
    resized.save(webp_path, "WEBP", quality=82, method=6)
    rgb = resized.convert("RGB")
    rgb.save(jpg_path, "JPEG", quality=80, optimize=True, progressive=True)
    print(f"  wrote {webp_path} ({w}x{h})")


def main():
    for name, cfg in JOBS.items():
        src_path = os.path.join(SRC_DIR, cfg["src"])
        im = Image.open(src_path)
        im = ImageOps.exif_transpose(im).convert("RGB")
        print(f"{name}: source {im.width}x{im.height}")
        base = im
        if "desktop_crop" in cfg:
            l, t, r, b = cfg["desktop_crop"]
            base = im.crop((int(l * im.width), int(t * im.height), int(r * im.width), int(b * im.height)))
        for w in cfg["widths"]:
            emit(base, name, w)
        if "mobile_crop" in cfg:
            l, t, r, b = cfg["mobile_crop"]
            box = (int(l * im.width), int(t * im.height), int(r * im.width), int(b * im.height))
            cropped = im.crop(box)
            for w in cfg["mobile_widths"]:
                emit(cropped, name, w, suffix="-mobile")


if __name__ == "__main__":
    main()
