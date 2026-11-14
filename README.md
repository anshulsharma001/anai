# Anai Foods & Agro — brand & enquiry website

A single-page brand portfolio and B2B enquiry site for Anai Foods & Agro Pvt. Ltd. All product content, pack
sizes, highlights, ingredients and contact details come from `Anai_Catalogue_Premium.pdf`. All imagery is
generated with Higgsfield (product renderings use the catalogue photos as references); only the logo comes from
the catalogue — see [ASSET_MANIFEST.md](ASSET_MANIFEST.md). Prices, stock levels
and checkout are deliberately absent: the catalogue lists prices and availability as "on request".

## Stack

- React 19 + Vite (JavaScript/JSX)
- Tailwind CSS v4 (`@tailwindcss/vite`); design tokens are in `src/styles/index.css`
- GSAP 3 with ScrollTrigger and SplitText via `@gsap/react`; Lenis for smooth scrolling
- Lucide React icons
- Self-hosted fonts: Fraunces (display, variable weight and optical size) and Jost (text), via Fontsource

## Motion design

- **Preloader:** wordmark reveal with a counter that waits for the hero images (first visit per session only).
- **Hero:** a pinned scene (screens at least 1280 × 800; shorter or narrower screens get a stacked hero so text never
  overlaps). Letters rise into place; the cookies rise towards the camera on scroll, with the headline kept in front
  of them so it stays readable. Gift boxes and floating cookies and nuts drift with the pointer at different depths,
  clear of the copy. The copy block lists the range at a glance (16 products, 5 collections, 200 g – 1 kg packs,
  flexible bulk pricing) with Explore, WhatsApp and Download Catalogue buttons.
- **Collection:** a pinned horizontal journey (≥ 1024 px) through five full-screen scenes, each in its own
  colourway. Trays and boxes are arranged like a styled table; jars and hampers stand on a shelf. Packs are dealt in as each scene arrives. Hovering a pack or its list row lifts it, shows a
  caption and dims the rest. A floating nav marks the current scene. On phones and tablets (< 1024 px) the collections become tabs (All, Trays,
  Jars, Gift Boxes, Swirls, Hampers) that stick below the header; one collection shows at a time ("All" lists every
  product as a card, grouped by collection), its packs first, and they deal in each time a tab opens. Single collections share one space, so
  switching between them never moves the page. Scene
  art direction (colours, placements, tilts) lives in `src/data/collectionScenes.js`.
- **Chai interlude:** the chai-pour film plays on a muted loop by itself (paused only while off screen) as its
  frame opens to full bleed.
- **Gifting:** a split opening, with copy beside a Diwali scene of the three gift hampers in an arched frame and a
  gift box drifting over its edge; then occasions and cascading add-on chips. Gift boxes and hampers are shown
  once, in the collection, not repeated here.
- **Why Anai:** a small scroll-speed marquee and count-up figures, then a sticky panel beside the five reasons whose
  packs change with the reason being read (gift boxes for "Gift-ready presentation", hampers for "Gifting, your
  way"…), and the "Which pack suits you" table, worded as on the current site (`packGuide` in `products.js`).
- **Our Story** (after Why Anai, as on the current site): a photo beside "Anai Foods & Agro Pvt. Ltd.", the brand
  statement (lighting up word by word) and four short points, sized to fit one screen.
- **FAQ** ("Questions, answered", after Contact as on the current site): the six questions from
  anaifoodsandagro.com in a native `<details>` accordion (`faqs` in `brand.js`; that site's bracketed editor notes are
  left out). Answers slide open where the browser supports it.
- **Collection details:** each product row shows a "Best for" line and, where the catalogue gives one, a badge
  (Best-seller, Best value, Kids' favourite…), also stuck on the pack in the scene.
- **Throughout:** masked line reveals on headings, a scroll-progress line, a navbar that hides on scroll down,
  and a floating WhatsApp button. The browser's own cursor is used.

With reduced motion, the preloader, smooth scrolling, pinning, video playback, the WhatsApp button's pulse and
every GSAP animation are switched off, and the static layout is shown.
## Scripts

```bash
npm install
npm run dev       # local development
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint      # ESLint (includes React Compiler hook rules)
```

## Structure

```
src/
  components/   Navbar, Footer, Preloader, ScrollProgress, Marquee, Button, FloatingWhatsApp, WhatsAppIcon,
                SectionHeading, CollectionScene, ProductDetails (dialog), EnquiryForm, ResponsiveImage, Logo, DiamondList
  sections/     Hero, Manifesto, Collections, ChaiInterlude, Gifting, WhyAnai, BulkOrders, Contact, Faq
  context/      SiteProvider: active collection, open product
  hooks/        useReveal (scroll animation), useActiveSection, useScrolled, useHideOnScroll, useScrollLock,
                useFocusTrap, useSite
  lib/          gsap setup, Lenis smooth scroll, intro signal, image resolver, enquiry builder, scroll helpers
  data/         products.js, collectionScenes.js, brand.js, imageManifest.json (generated)
  assets/images WebP renditions (catalogue extracts and generated imagery)
public/media/   Films and posters
public/         Anai-Catalogue.pdf (the "Download Catalogue" file), favicons, og-image.jpg
tools/          extract_catalogue_assets.py, process_generated_assets.py
```

## Editing content

- **Products and collections:** `src/data/products.js`. Each product records its catalogue page, and only details
  printed there are listed.
- **"Best for" lines and badges:** `bestFor` and `badge` on each product in `src/data/products.js`; they restate
  that catalogue page's highlights.
- **Contact details, navigation, add-ons, enquiry types:** `src/data/brand.js`.
- **Navigation order** follows the current site: Home, Collection, Gift Hampers, Why Anai, Our Story, Bulk Orders,
  Contact (`navLinks` in `brand.js`). Seven links need 1280 px; narrower screens use the menu button.
- **Address:** the Delhi registered office, set in `company.address` (12 Nov 2026).
- **FSSAI:** not shown anywhere on the site (client request, 12 Nov 2026). The number from the Coconut Cookies label
  (23326008002758) is kept in `company.fssaiLicence` in case it is wanted again.
- **Announcement strip** (gold bar above the navbar): the first block inside the header bar in
  `src/components/Navbar.jsx`.
- **Catalogue PDF:** replace `public/Anai-Catalogue.pdf` (and `catalogue.size` in `brand.js` if it changes).
- **Images:** see [ASSET_MANIFEST.md](ASSET_MANIFEST.md).

## Enquiries — all via WhatsApp

Every enquiry on the site goes to WhatsApp (`wa.me/919759697027`) with a message already written. WhatsApp
buttons carry the WhatsApp logo, white in a green disc (`--color-wa`, #1E8449, the client's chosen green); the floating
button uses the same green:

- **Quick enquiries.** The floating WhatsApp button, "Enquire" in product details, "Enquire about <collection>",
  "Create a Gift Enquiry", "Enquire for Bulk Orders" and the header's "Enquire Now" are links. Each one opens
  WhatsApp with a message naming the product, collection, gifting or bulk request.
- **Quick enquiry form** (Bulk Orders section): name, phone/WhatsApp, enquiry type, quantity or budget and an
  optional message. After validation, "Continue on WhatsApp" opens WhatsApp with those details. A follow-up panel offers "Open WhatsApp" again (in case a pop-up blocker stopped it), "Copy enquiry
  text" and "Edit enquiry".

The site never claims an enquiry was sent; it is only sent when the visitor presses send in WhatsApp. Messages
are built in `src/lib/enquiry.js` (`quickEnquiryText`, `enquiryText`, `whatsappEnquiryLink`), and the number
lives in `src/data/brand.js`.

## Environment

Copy `.env.example` to `.env` (or set the value in your host):

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Public URL, without a trailing slash. Makes the Open Graph image URL absolute, which most social platforms require. |

## Accessibility & motion

- Semantic landmarks, one `h1`, and a skip link.
- Visible focus styles on cream and brown backgrounds.
- Keyboard-operable collection tabs (arrow keys, Home, End).
- A native `<dialog>` for product details, laid out so everything shows at once without scrolling (checked for all 16
  products down to a 360 × 740 phone): Escape and backdrop close it, and focus returns to the trigger.
- The mobile menu has a focus trap and closes with Escape.
- Form errors are announced, with a linked error summary.
- With reduced motion, all GSAP animation and smooth scrolling are skipped, and every element renders in its
  final position. Scroll reveals only animate opacity and transforms, so content stays focusable and in the
  accessibility tree throughout.
