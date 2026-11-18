// Business details as printed in Anai_Catalogue_Premium.pdf (cover and page 17).

export const company = {
  name: 'Anai Foods & Agro Pvt. Ltd.',
  shortName: 'Anai',
  tagline: 'Especially for you',
  phoneDisplay: '+91-9759697027',
  phoneHref: 'tel:+919759697027',
  whatsappNumber: '919759697027',
  email: 'contact@anaifoodsandagro.com',
  address: {
    // Registered office, as given by the client (12 Nov 2026); it replaces the catalogue's Aonla, Bareilly address.
    lines: ['302, E-7, Friends Complex, Jawahar Park', 'Laxmi Nagar, East Delhi', 'Delhi - 110092'],
    full: '302, E-7, Friends Complex, Jawahar Park, Laxmi Nagar, East Delhi, Delhi - 110092',
  },
  // FSSAI licence number as printed under the FSSAI logo on the Coconut Cookies tray label (catalogue page 4).
  // Not shown on the site: the client asked for it to be removed (12 Nov 2026).
  fssaiLicence: '23326008002758',
}

// The catalogue PDF is served from public/.
export const catalogue = {
  href: '/Anai-Catalogue.pdf',
  fileName: 'Anai-Foods-Catalogue.pdf',
  size: '4.9 MB',
}

export const emailHref = `mailto:${company.email}`

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${company.name}, ${company.address.full}`,
)}`

export function whatsappHref(text = 'Hello Anai, I would like to know more about your cookies and gifting options.') {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(text)}`
}

// Same order as the current site (anaifoodsandagro.com), with the Healthy Range (added 17 Nov 2026) after Collection.
export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Collection' },
  { id: 'healthy', label: 'Healthy Range' },
  { id: 'gifting', label: 'Gift Hampers' },
  { id: 'why', label: 'Why Anai' },
  { id: 'story', label: 'Our Story' },
  { id: 'bulk', label: 'Bulk Orders' },
  { id: 'contact', label: 'Contact' },
]

// Catalogue page 17 — "Bulk & Corporate Orders"
export const bulkBenefits = [
  { title: 'Bulk pricing — flexible', text: 'Special rates for large and repeat orders.' },
  { title: 'Flexible packing', text: 'Choose jars, trays, boxes or tiered hampers.' },
  { title: 'Timely delivery', text: 'Plan bulk orders in advance so they arrive when you need them.' },
]

// Catalogue page 16 — "Optional Add-ons"
export const hamperAddOns = [
  'Festive or occasion decor',
  'Mithai or dry fruit box',
  'Chocolates and namkeen',
  'Handwritten greeting card',
  'Ribbon and gift tag',
  'Choice of tulle colour and ribbon',
]

export const enquiryTypes = ['Retail', 'Distribution', 'Corporate Gifting', 'Wedding or Event', 'Bulk Order', 'Other']

export const disclaimers = {
  images:
    'Images are for representation only. Product images are digital renderings based on Anai packaging; lifestyle scenes, films and decorative cookie imagery are illustrative.',
  prices: 'Prices and availability on request.',
}

// FAQ from the current site (anaifoodsandagro.com). Its bracketed editor notes are left out; the prices answer
// points to WhatsApp (this site has no enquiry list) and the delivery answer invites a WhatsApp message instead of
// the unfinished "[List delivery areas…]" note.
export const faqs = [
  {
    question: 'What are your prices?',
    answer:
      'Prices and availability are shared on request, because they depend on pack size, quantity and packing. Message us on WhatsApp or call +91-9759697027 and we will send a quote.',
  },
  {
    question: 'Are all products vegetarian and eggless?',
    answer:
      'Every product in the range is vegetarian and carries the green veg mark. The Triple Treat Gift Pack is also handmade and eggless.',
  },
  {
    question: 'What is the shelf life?',
    answer:
      'Tray and jar cookies are best before 4 months from the date of packing. The batch number and packing date are printed on every label.',
  },
  {
    question: 'How are products packed?',
    answer:
      'Everyday cookies come in sealed clear PET trays. Family packs are reusable airtight PET jars with a cap. Premium cookies are in printed gift boxes with shrink wrap, and hampers are wrapped in tulle with a ribbon and gift tag.',
  },
  {
    question: 'Do you take bulk or corporate orders?',
    answer:
      'Yes. We offer special rates for large and repeat orders, flexible packing in jars, trays, boxes or tiered hampers, and hamper contents tailored to your budget. Please plan bulk orders in advance.',
  },
  {
    question: 'Where do you deliver?',
    answer:
      'We dispatch from Aonla, Bareilly, Uttar Pradesh. Share your delivery location on WhatsApp and we will confirm the options and timing.',
  },
]
