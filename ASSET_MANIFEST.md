# Asset manifest

All photography and film on the site was created with Higgsfield. The only asset taken from
`Anai_Catalogue_Premium.pdf` is the logo artwork, which is kept exactly as drawn (recoloured, never redrawn).

| Source | Script |
| --- | --- |
| Logo and favicons (catalogue) | `tools/extract_catalogue_assets.py path/to/Anai_Catalogue_Premium.pdf` |
| All imagery and films (Higgsfield downloads) | `tools/process_generated_assets.py path/to/higgsfield-downloads` |

Renditions are WebP files in `src/assets/images/<folder>/<name>-<width>.webp`. Intrinsic sizes live in
`src/data/imageManifest.json`, and `src/lib/images.js` turns each key into a `srcset`. If a key is missing,
`ResponsiveImage` renders a branded placeholder instead of a broken image.

## Product packshots

These are studio renderings on transparent backgrounds, made with GPT Image 2.5 (via Higgsfield). Each used the
matching catalogue photograph as a reference, so the packaging design, colours, logo placement and product names
follow the real pack. Prompts excluded price stickers and date stamps. Every render was reviewed for spelling and
invented details. The Ajwain jar was regenerated because the first version printed an invented address; its
information strip is now blank.

| Asset key | Product | Reference (catalogue page) |
| --- | --- | --- |
| `products/chocochip-tray` | Chocochip Cookies, 250 g tray | 3 |
| `products/coconut-tray` | Coconut Cookies, 250 g tray | 4 |
| `products/kaju-tray` | Kaju Cookies, 250 g tray | 5 |
| `products/jeera-tray` | Jeera Cookies, 200 g tray | 6 |
| `products/coconut-jar` | Coconut Cookies Jar, 1 kg | 7 |
| `products/ajwain-jar` | Ajwain Cookies Jar, 1 kg | 8 |
| `products/dryfruits-box` | Dryfruits Cookies gift box | 9 |
| `products/butter-kaju-box` | Butter Kaju Cookies gift box | 10 |
| `products/kaju-pista-box` | Kaju Pista Cookies gift box | 11 |
| `products/triple-treat-box` | Triple Treat Gift Pack | 12 |
| `products/kaju-swirl-tray` | Kaju Swirl Cookies | 13 |
| `products/badam-swirl-tray` | Badam Swirl Cookies | 14 |
| `products/classic-crunch-tray` | Classic Crunch Cookies | 15 |
| `hampers/royal-3-tier` | Royal 3-Tier hamper | 16 |
| `hampers/double-delight` | Double Delight hamper | 16 |
| `hampers/classic-jar` | Classic Jar hamper | 16 |

Small print on the tray labels (ingredients, nutrition table, FSSAI number) was reproduced from the reference
photos. It is barely legible at web sizes, but check it against the printed labels before relying on it.

## Scenes, decorative cut-outs and films (illustrative)

| Asset | Where it appears | How it was made |
| --- | --- | --- |
| `lifestyle/cookie-stage` | Hero still life | GPT Image 2.5, text prompt |
| `lifestyle/cookie-stage-cutout` | Hero foreground (cookies in front of the headline) | Higgsfield background removal of `cookie-stage`; same 2336 × 1744 size, so it aligns pixel for pixel |
| `generated/swirl-cashew`, `swirl-almond`, `butter-round` | Hero floats, manifesto pill, Why Anai, swirl scene | GPT Image 2.5, transparent background |
| `generated/cashew-a/b`, `almond-a/b`, `pistachio-a/b`, `crumbs-a/b` | Hero and collection props | GPT Image 2.5 sheet, split into pieces |
| `generated/diwali-hampers` | Gifting, in the arched frame | GPT Image 2.6 (Higgsfield), using the three hamper renders as references; reviewed for spelling (tags read "anai") and invented text |
| `generated/festive-table` | Not shown any more (replaced by the Diwali hampers) | GPT Image 2.5 |
| `generated/piping` | Our Story | GPT Image 2.5 |
| `public/media/still-life-loop.mp4` (+ poster) | Not shown any more (the Contact panel is now plain) | Kling 3.0 from the hero still life; played forward then reversed so the loop is seamless |
| `public/media/chai-pour.mp4` (+ poster) | Chai interlude (muted autoplay loop) | Seedance 2.5, re-encoded H.264 with dense keyframes for smooth seeking |
| `public/og-image.jpg` | Social preview card | Hero still life and the cream logo |

## Healthy Range photos

Supplied by the client on 17 Nov 2026 (`anai_healthy_cookies_photos`, two 1024 × 1024 PNGs per cookie) and
processed with `tools/process_healthy_range.py path/to/anai_healthy_cookies_photos`. Each `*_hero.png` (the pouch on
a table) becomes `healthy/<id>-pack` and the other shot becomes `healthy/<id>-scene`, at 360, 640 and 960 px. All 26
pouch labels were checked: names, "anai Foods & Agro Pvt. Ltd." and "Healthy Range" are spelt correctly, with no
invented fine print. `healthy/millet-scene` also fills the end tile of the grid on tablets and desktops.

## Brand files (from the catalogue)

| File | Notes |
| --- | --- |
| `src/assets/images/brand/logo-{brown,cream,amber}.webp` | Original wordmark alpha mask recoloured to `#4A2A12`, `#FFF4DC` and `#C98A2B`; 640 px wide |
| `public/favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `icon-192.png` | The current site's brand icon (gold disc with the "a" and wheat sprig, `anai-site/assets/img/icon.png`), cut out as a circle; the Apple icon sits on cream |

## Replacing an image

Add WebP files named `<key>-<width>.webp`, and set the key's `width` and `height` in
`src/data/imageManifest.json` (or drop the new PNG into the Higgsfield folder and re-run the processing script,
which clears stale widths). Products reference their image by key in `src/data/products.js`; collection placements
live in `src/data/collectionScenes.js`.
