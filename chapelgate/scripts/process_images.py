import os
from PIL import Image

SRC_DIR = "assets"
OUT_DIR = "assets/img"
os.makedirs(OUT_DIR, exist_ok=True)

# name -> (source file, list of target widths)
JOBS = {
    "cg1-hero-interior": ("cg1.webp", [480, 640, 720, 768, 960, 1100, 1360]),
    "cg2-interior-close": ("cg2.webp", [480, 720, 768, 1100]),
    "cg3-balance-shop": ("cg3.webp", [420, 574, 860]),
    "cg4-exterior-sign": ("cg4.webp", [640, 960, 1360]),
    "cg5-street-view": ("cg5.webp", [480, 640, 720, 768, 960, 1100, 1360]),
    "cg6-shortbread": ("cg6.webp", [420, 640, 765]),
    "cg7-plated-cake": ("cg7.webp", [420, 640, 765]),
    "cg8-cappuccino": ("cg8.webp", [420, 480, 640, 720, 765]),
}

for name, (src, widths) in JOBS.items():
    im = Image.open(os.path.join(SRC_DIR, src)).convert("RGB")
    w0, h0 = im.size
    for w in widths:
        if w > w0:
            continue
        h = round(h0 * (w / w0))
        resized = im.resize((w, h), Image.LANCZOS)
        webp_path = os.path.join(OUT_DIR, f"{name}-{w}.webp")
        avif_path = os.path.join(OUT_DIR, f"{name}-{w}.avif")
        resized.save(webp_path, "WEBP", quality=78, method=6)
        resized.save(avif_path, "AVIF", quality=58)
        print(webp_path, os.path.getsize(webp_path)//1024, "KB /", avif_path, os.path.getsize(avif_path)//1024, "KB")

# mobile hero crop from cg1 (tighter, taller aspect for mobile viewport)
im = Image.open(os.path.join(SRC_DIR, "cg1.webp")).convert("RGB")
w0, h0 = im.size
# crop centered horizontally, keep full height band around counter
crop_w = int(h0 * 0.85)
left = (w0 - crop_w)//2
crop = im.crop((left, 0, left+crop_w, h0))
for w in [480, 750]:
    h = round(crop.height * (w/crop.width))
    resized = crop.resize((w, h), Image.LANCZOS)
    resized.save(os.path.join(OUT_DIR, f"cg1-hero-mobile-{w}.webp"), "WEBP", quality=78, method=6)
    resized.save(os.path.join(OUT_DIR, f"cg1-hero-mobile-{w}.avif"), "AVIF", quality=58)
    print("mobile crop", w)

print("done")
