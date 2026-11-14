import manifest from '../data/imageManifest.json'

// Every WebP rendition produced by tools/extract_catalogue_assets.py, keyed by URL.
const files = import.meta.glob('../assets/images/**/*.webp', { eager: true, query: '?url', import: 'default' })

const RENDITION = /assets\/images\/(.+)-(\d+)\.webp$/

const renditions = {}
for (const [path, url] of Object.entries(files)) {
  const match = path.match(RENDITION)
  if (!match) continue
  const [, key, width] = match
  ;(renditions[key] ??= []).push({ width: Number(width), url })
}
for (const list of Object.values(renditions)) list.sort((a, b) => a.width - b.width)

/**
 * Resolve an image key (e.g. "products/kaju-pista-box") to src/srcSet and intrinsic size.
 * Returns null when the asset is missing so callers can render a fallback.
 */
export function getImage(key) {
  const list = renditions[key]
  const meta = manifest[key]
  if (!list?.length || !meta) return null
  return {
    src: list[Math.min(1, list.length - 1)].url,
    srcSet: list.map(({ url, width }) => `${url} ${width}w`).join(', '),
    width: meta.width,
    height: meta.height,
  }
}
