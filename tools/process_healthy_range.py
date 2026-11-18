"""
Optimise the Healthy Range photographs for the website.

Usage (requires Pillow):
    python tools/process_healthy_range.py path/to/anai_healthy_cookies_photos

The folder holds two 1024 x 1024 photos per cookie, named anai_<NN>_<slug>_cookies_<shot>.png:
the "hero" shot (the pouch on a table) becomes healthy/<slug>-pack, and the other shot (a lifestyle
scene) becomes healthy/<slug>-scene. Writes WebP renditions to src/assets/images/healthy/ and merges
their dimensions into src/data/imageManifest.json.
"""

import glob
import json
import os
import re
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_OUT = os.path.join(ROOT, "src", "assets", "images")
MANIFEST = os.path.join(ROOT, "src", "data", "imageManifest.json")

WIDTHS = [360, 640, 960]
NAME = re.compile(r"^anai_\d+_(?P<slug>.+)_cookies_(?P<shot>[a-z]+)\.png$")


def save(img, key, manifest):
    out_dir = os.path.join(IMG_OUT, os.path.dirname(key))
    os.makedirs(out_dir, exist_ok=True)
    for path in glob.glob(os.path.join(IMG_OUT, f"{key}-*.webp")):
        os.remove(path)  # stale widths would otherwise leak into the srcset
    name = os.path.basename(key)
    used = []
    for w in WIDTHS:
        w = min(w, img.width)
        h = round(img.height * w / img.width)
        img.resize((w, h), Image.LANCZOS).save(os.path.join(out_dir, f"{name}-{w}.webp"), "WEBP", quality=80, method=6)
        used.append(w)
    manifest[key] = {"width": img.width, "height": img.height, "widths": sorted(set(used)), "generated": True}


def main(src):
    with open(MANIFEST) as f:
        manifest = json.load(f)

    done = []
    for path in sorted(glob.glob(os.path.join(src, "anai_*.png"))):
        match = NAME.match(os.path.basename(path))
        if not match:
            print(f"skipped {os.path.basename(path)}")
            continue
        slug = match["slug"].replace("_", "-")
        kind = "pack" if match["shot"] == "hero" else "scene"
        key = f"healthy/{slug}-{kind}"
        save(Image.open(path).convert("RGB"), key, manifest)
        done.append(key)

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)
        f.write("\n")
    print(f"wrote {len(done)} images: {', '.join(done)}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
