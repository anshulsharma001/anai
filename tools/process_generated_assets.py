"""
Optimise the Higgsfield-generated imagery and films for the website.

Every photographic asset on the site comes from Higgsfield; only the logo artwork
(see extract_catalogue_assets.py) comes from the catalogue.

Usage (requires Pillow and ffmpeg on PATH):
    python tools/process_generated_assets.py path/to/higgsfield-downloads

Expects these files in the input folder:
    products/<name>.png  studio packshots (transparent), made from the catalogue photos as references
    hero-stage.png, hero-stage-cutout.png  hero still life and its background-removed twin (same size)
    swirl-cashew.png, swirl-almond.png, butter-round.png, nuts.png  (transparent cut-outs)
    festive-table.png, piping.png  (illustrative scenes)
    still-life.mp4, chai.mp4

Writes WebP renditions to src/assets/images/, videos, posters and the Open Graph card
to public/, and merges dimensions into src/data/imageManifest.json.
"""

import glob
import json
import os
import subprocess
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_OUT = os.path.join(ROOT, "src", "assets", "images")
PUBLIC = os.path.join(ROOT, "public")
MEDIA_OUT = os.path.join(PUBLIC, "media")
MANIFEST = os.path.join(ROOT, "src", "data", "imageManifest.json")

# (input file, asset key, widths, trim transparent edges)
IMAGES = [
    ("hero-stage.png", "lifestyle/cookie-stage", [480, 800, 1200, 1600], False),
    ("hero-stage-cutout.png", "lifestyle/cookie-stage-cutout", [480, 800, 1200, 1600], False),
    ("swirl-cashew.png", "generated/swirl-cashew", [320, 640], True),
    ("swirl-almond.png", "generated/swirl-almond", [320, 640], True),
    ("butter-round.png", "generated/butter-round", [320, 640], True),
    ("festive-table.png", "generated/festive-table", [800, 1200, 1920], False),
    ("piping.png", "generated/piping", [480, 800, 1200], False),
]

# Studio packshots: input name -> asset key used by src/data/products.js
PRODUCTS = {
    "chocochip-tray": "products/chocochip-tray",
    "coconut-tray": "products/coconut-tray",
    "kaju-tray": "products/kaju-tray",
    "jeera-tray": "products/jeera-tray",
    "coconut-jar": "products/coconut-jar",
    "ajwain-jar": "products/ajwain-jar",
    "dryfruits-box": "products/dryfruits-box",
    "butter-kaju-box": "products/butter-kaju-box",
    "kaju-pista-box": "products/kaju-pista-box",
    "triple-treat-box": "products/triple-treat-box",
    "kaju-swirl-tray": "products/kaju-swirl-tray",
    "badam-swirl-tray": "products/badam-swirl-tray",
    "classic-crunch-tray": "products/classic-crunch-tray",
    "royal-3-tier": "hampers/royal-3-tier",
    "double-delight": "hampers/double-delight",
    "classic-jar": "hampers/classic-jar",
}

# Catalogue-derived imagery that the Higgsfield set replaces.
RETIRED = [
    "cutouts/ajwain-jar",
    "cutouts/coconut-jar",
    "cutouts/classic-jar",
    "cutouts/double-delight",
    "cutouts/royal-3-tier",
    "lifestyle/cookie-still-life",
    "lifestyle/chai-and-gift",
]

# nuts.png is a 4 x 2 grid of separate elements
NUT_NAMES = ["cashew-a", "almond-a", "pistachio-a", "crumbs-a", "cashew-b", "almond-b", "pistachio-b", "crumbs-b"]


def remove_renditions(key):
    for path in glob.glob(os.path.join(IMG_OUT, f"{key}-*.webp")):
        os.remove(path)


def save(img, key, widths, manifest):
    out_dir = os.path.join(IMG_OUT, os.path.dirname(key))
    os.makedirs(out_dir, exist_ok=True)
    remove_renditions(key)  # stale widths would otherwise leak into the srcset
    name = os.path.basename(key)
    used = []
    for w in widths:
        w = min(w, img.width)
        h = round(img.height * w / img.width)
        img.resize((w, h), Image.LANCZOS).save(os.path.join(out_dir, f"{name}-{w}.webp"), "WEBP", quality=82, method=6)
        used.append(w)
    manifest[key] = {"width": img.width, "height": img.height, "widths": sorted(set(used)), "generated": True}


def trim(img):
    box = img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    return img.crop(box) if box else img


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def poster(video, out, seek, width):
    """ffmpeg here may lack a WebP encoder, so grab a JPEG frame and convert it with Pillow."""
    tmp = out + ".tmp.jpg"
    ffmpeg(*seek, "-i", video, "-frames:v", "1", "-q:v", "2", "-vf", f"scale={width}:-2", tmp)
    Image.open(tmp).save(out, "WEBP", quality=80, method=6)
    os.remove(tmp)


def open_graph(stage, out):
    """1200 x 630 social card: the hero still life on the right, the cream logo on roast brown."""
    og_w, og_h = 1200, 630
    og = Image.new("RGBA", (og_w, og_h), (27, 17, 10, 255))
    # Crop to the cookie group (left two-thirds of the still life) so it sits clear of the logo.
    band = stage.crop((round(stage.width * 0.06), round(stage.height * 0.2), round(stage.width * 0.74), stage.height))
    band = band.convert("RGBA")
    band = band.resize((round(band.width * og_h / band.height), og_h), Image.LANCZOS)
    fade = Image.new("L", band.size, 255)
    draw = ImageDraw.Draw(fade)
    for x in range(200):
        draw.line([(x, 0), (x, og_h)], fill=int(255 * x / 200))
    band.putalpha(fade)
    og.alpha_composite(band, (og_w - band.width, 0))
    logo = Image.open(os.path.join(IMG_OUT, "brand", "logo-cream.webp")).convert("RGBA")
    logo = logo.resize((360, round(logo.height * 360 / logo.width)), Image.LANCZOS)
    og.alpha_composite(logo, (72, (og_h - logo.height) // 2))
    og.convert("RGB").save(out, quality=86)


def main(src):
    with open(MANIFEST) as f:
        manifest = json.load(f)

    for key in RETIRED:
        remove_renditions(key)
        manifest.pop(key, None)

    for filename, key, widths, should_trim in IMAGES:
        img = Image.open(os.path.join(src, filename))
        img = img.convert("RGBA") if img.mode in ("RGBA", "LA", "P") else img.convert("RGB")
        if should_trim:
            img = trim(img)
        save(img, key, widths, manifest)

    for name, key in PRODUCTS.items():
        img = Image.open(os.path.join(src, "products", f"{name}.png")).convert("RGBA")
        save(trim(img), key, [480, 800, 1200], manifest)

    nuts = Image.open(os.path.join(src, "nuts.png")).convert("RGBA")
    cw, ch = nuts.width / 4, nuts.height / 2
    for i, name in enumerate(NUT_NAMES):
        col, row = i % 4, i // 4
        cell = nuts.crop((round(col * cw), round(row * ch), round((col + 1) * cw), round((row + 1) * ch)))
        save(trim(cell), f"generated/{name}", [240], manifest)

    open_graph(Image.open(os.path.join(src, "hero-stage.png")).convert("RGB"), os.path.join(PUBLIC, "og-image.jpg"))

    os.makedirs(MEDIA_OUT, exist_ok=True)
    h264 = ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-movflags", "+faststart", "-an"]

    # Still life: forward then reverse, so the loop never jumps
    ffmpeg("-i", os.path.join(src, "still-life.mp4"), "-filter_complex",
           "[0:v]scale=1280:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]",
           "-map", "[v]", *h264, "-crf", "27", os.path.join(MEDIA_OUT, "still-life-loop.mp4"))
    poster(os.path.join(src, "still-life.mp4"), os.path.join(MEDIA_OUT, "still-life-poster.webp"), ["-ss", "0.1"], 1280)

    # Chai pour: short keyframe interval so scroll-scrubbing seeks smoothly
    ffmpeg("-i", os.path.join(src, "chai.mp4"), "-vf", "scale=1600:-2", *h264, "-crf", "25",
           "-g", "4", "-keyint_min", "4", "-sc_threshold", "0", "-bf", "0",
           os.path.join(MEDIA_OUT, "chai-pour.mp4"))
    poster(os.path.join(src, "chai.mp4"), os.path.join(MEDIA_OUT, "chai-poster.webp"), ["-sseof", "-0.2"], 1600)

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)
    print("done")


if __name__ == "__main__":
    main(sys.argv[1])
