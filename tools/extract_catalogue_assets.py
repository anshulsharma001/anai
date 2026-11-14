"""
Extract the Anai logo artwork from Anai_Catalogue_Premium.pdf.

Usage (requires PyMuPDF + Pillow):
    python tools/extract_catalogue_assets.py path/to/Anai_Catalogue_Premium.pdf

The logo is the only asset taken from the catalogue: its alpha mask is recoloured to
the brand palette (WebP in src/assets/images/brand/) and its first letter becomes the
favicon set in public/. All photography comes from Higgsfield — see
process_generated_assets.py. Merges the logo size into src/data/imageManifest.json.
"""

import io
import json
import os
import sys

import fitz
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_OUT = os.path.join(ROOT, "src", "assets", "images")
PUBLIC = os.path.join(ROOT, "public")
MANIFEST = os.path.join(ROOT, "src", "data", "imageManifest.json")

# Brand palette (from the brand identity sheet)
AMBER = (0xC9, 0x8A, 0x2B)
BROWN = (0x4A, 0x2A, 0x12)
CREAM = (0xFF, 0xF4, 0xDC)

LOGO_XREF = 8
LOGO_WIDTH = 640


def tint_logo(mask, rgb):
    layer = Image.new("RGBA", mask.size, rgb + (0,))
    layer.putalpha(mask)
    return layer


def main(pdf_path):
    doc = fitz.open(pdf_path)
    smask = doc.extract_image(LOGO_XREF)["smask"]
    mask = Image.open(io.BytesIO(fitz.Pixmap(doc, smask).tobytes("png"))).convert("L")
    mask = mask.crop(mask.getbbox())

    # Logo: keep the original artwork, recolour its alpha mask to the palette
    brand_dir = os.path.join(IMG_OUT, "brand")
    os.makedirs(brand_dir, exist_ok=True)
    for label, rgb in (("cream", CREAM), ("brown", BROWN), ("amber", AMBER)):
        logo = tint_logo(mask, rgb)
        logo = logo.resize((LOGO_WIDTH, round(logo.height * LOGO_WIDTH / logo.width)), Image.LANCZOS)
        logo.save(os.path.join(brand_dir, f"logo-{label}.webp"), "WEBP", quality=90, method=6)

    # Favicon: the opening "a" of the wordmark, cream on toasted brown
    glyph = mask.crop((0, 100, 300, 345))
    glyph = glyph.crop(glyph.getbbox())
    size = 512
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(icon).ellipse((0, 0, size - 1, size - 1), fill=BROWN + (255,))
    g_w = int(size * 0.62)
    g_h = round(glyph.height * g_w / glyph.width)
    glyph = glyph.resize((g_w, g_h), Image.LANCZOS)
    icon.alpha_composite(tint_logo(glyph, CREAM), ((size - g_w) // 2, (size - g_h) // 2 + 6))
    os.makedirs(PUBLIC, exist_ok=True)
    icon.resize((180, 180), Image.LANCZOS).save(os.path.join(PUBLIC, "apple-touch-icon.png"))
    icon.resize((192, 192), Image.LANCZOS).save(os.path.join(PUBLIC, "icon-192.png"))
    icon.resize((64, 64), Image.LANCZOS).save(os.path.join(PUBLIC, "favicon.png"))
    icon.save(os.path.join(PUBLIC, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])

    manifest = {}
    if os.path.exists(MANIFEST):
        with open(MANIFEST) as f:
            manifest = json.load(f)
    manifest["brand/logo"] = {"width": LOGO_WIDTH, "height": round(mask.height * LOGO_WIDTH / mask.width)}
    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)
    print("logo and favicons written")


if __name__ == "__main__":
    main(sys.argv[1])
