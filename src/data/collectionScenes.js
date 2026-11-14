// Art direction for the collection gallery: one scene per collection.
// Positions are percentages of a 1.3:1 collage frame; `width` is a share of the frame's width.
// Every pack is a transparent studio shot; `shelf` scenes stand them on a line, the rest are laid out like a styled table.

export const scenes = {
  'everyday-trays': {
    short: 'Trays',
    theme: {
      panel: 'bg-parchment text-brown',
      muted: 'text-brown-soft',
      accent: 'text-amber-ink',
      rule: 'border-brown/20',
      glow: 'rgb(255 244 220 / 0.9)',
      dark: false,
      cta: 'dark',
    },
    items: [
      { id: 'chocochip-cookies', left: 1, top: 6, width: 25, rotate: -8, depth: 1.2 },
      { id: 'coconut-cookies', left: 25, top: 24, width: 25, rotate: 5, depth: 0.8 },
      { id: 'kaju-cookies', left: 50, top: 4, width: 25, rotate: -4, depth: 1.1 },
      { id: 'jeera-cookies', left: 75, top: 20, width: 23, rotate: 8, depth: 0.7 },
    ],
    props: [
      { key: 'generated/crumbs-a', left: 9, top: 72, width: 8, rotate: 0, depth: 2 },
      { key: 'generated/cashew-a', left: 44, top: 78, width: 6, rotate: 30, depth: 2.6 },
      { key: 'generated/almond-b', left: 64, top: 72, width: 5, rotate: -20, depth: 2.2 },
      { key: 'generated/pistachio-a', left: 88, top: 80, width: 4.5, rotate: 15, depth: 3 },
    ],
  },
  'family-jars': {
    short: 'Jars',
    theme: {
      panel: 'bg-olive-deep text-cream',
      muted: 'text-cream/80',
      accent: 'text-amber-soft',
      rule: 'border-cream/20',
      glow: 'rgb(226 180 103 / 0.22)',
      dark: true,
      cta: 'primary',
    },
    shelf: true,
    items: [
      { id: 'coconut-cookies-jar', left: 2, bottom: 12, width: 56, rotate: -2, depth: 0.8 },
      { id: 'ajwain-cookies-jar', left: 64, bottom: 12, width: 30, rotate: 3, depth: 1.3 },
    ],
    props: [
      { key: 'generated/pistachio-b', left: 58, top: 8, width: 4.5, rotate: 20, depth: 2.4 },
      { key: 'generated/cashew-b', left: 92, top: 18, width: 5, rotate: -25, depth: 2.8 },
    ],
  },
  'premium-gift-boxes': {
    short: 'Gift Boxes',
    theme: {
      panel: 'bg-roast text-cream',
      muted: 'text-sand',
      accent: 'text-amber-soft',
      rule: 'border-cream/15',
      glow: 'rgb(201 138 43 / 0.28)',
      dark: true,
      cta: 'primary',
    },
    items: [
      { id: 'dryfruits-cookies', left: 0, top: 2, width: 52, rotate: -6, depth: 1.1 },
      { id: 'butter-kaju-cookies', left: 46, top: 6, width: 50, rotate: 5, depth: 0.7 },
      { id: 'kaju-pista-cookies', left: 4, top: 50, width: 50, rotate: 3, depth: 0.9 },
      { id: 'triple-treat-gift-pack', left: 48, top: 52, width: 48, rotate: -5, depth: 1.3 },
    ],
    props: [
      { key: 'generated/almond-a', left: 46, top: 40, width: 4.5, rotate: 25, depth: 2.6 },
      { key: 'generated/crumbs-b', left: 91, top: 88, width: 7, rotate: 0, depth: 2.2 },
    ],
  },
  'premium-swirl-cookies': {
    short: 'Swirls',
    theme: {
      panel: 'bg-amber text-brown-deep',
      muted: 'text-brown-deep/80',
      accent: 'text-brown-deep',
      rule: 'border-brown-deep/20',
      glow: 'rgb(255 244 220 / 0.35)',
      dark: false,
      cta: 'dark',
    },
    items: [
      { id: 'kaju-swirl-cookies', left: 0, top: 4, width: 56, rotate: -4, depth: 1 },
      { id: 'badam-swirl-cookies', left: 42, top: 28, width: 56, rotate: 5, depth: 0.7 },
      { id: 'classic-crunch-cookies', left: 6, top: 56, width: 52, rotate: -3, depth: 1.2 },
    ],
    props: [
      { key: 'generated/swirl-almond', left: 78, top: 66, width: 18, rotate: 12, depth: 2.6 },
      { key: 'generated/swirl-cashew', left: 80, top: -2, width: 13, rotate: -18, depth: 2.2 },
    ],
  },
  'gift-hampers': {
    short: 'Hampers',
    theme: {
      panel: 'bg-brown text-cream',
      muted: 'text-sand',
      accent: 'text-amber-soft',
      rule: 'border-cream/15',
      glow: 'rgb(226 180 103 / 0.26)',
      dark: true,
      cta: 'primary',
    },
    shelf: true,
    items: [
      { id: 'double-delight', left: 2, bottom: 12, width: 30, rotate: -3, depth: 1.1 },
      { id: 'royal-3-tier', left: 33, bottom: 12, width: 28, rotate: 0, depth: 0.7 },
      { id: 'classic-jar-hamper', left: 62, bottom: 12, width: 34, rotate: 3, depth: 1.2 },
    ],
    props: [{ key: 'generated/crumbs-a', left: 4, top: 6, width: 6, rotate: 40, depth: 2.4 }],
  },
}
