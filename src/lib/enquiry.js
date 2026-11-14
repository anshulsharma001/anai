import { company, whatsappHref } from '../data/brand'
import { categoriesById, productsById, productsInCategory } from '../data/products'

/*
 * Every enquiry on the site is handed to WhatsApp (wa.me) with a pre-written
 * message. Nothing is sent until the visitor presses send in WhatsApp.
 */

export const WHATSAPP_NOTE_ID = 'whatsapp-note'

export const emptyEnquiry = {
  name: '',
  phone: '',
  enquiryType: '',
  quantity: '',
  message: '',
}

const PHONE_PATTERN = /^\+?[\d\s()-]+$/

export function validateEnquiry(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.'

  const digits = values.phone.replace(/\D/g, '')
  if (!values.phone.trim()) errors.phone = 'Please enter a phone number we can reach you on.'
  else if (!PHONE_PATTERN.test(values.phone.trim()) || digits.length < 10 || digits.length > 15)
    errors.phone = 'Please enter a valid phone number with at least 10 digits.'

  if (!values.enquiryType) errors.enquiryType = 'Please choose the type of enquiry.'
  if (values.message.length > 1000) errors.message = 'Please keep your message under 1,000 characters.'
  return errors
}

function productLines(ids) {
  return ids
    .map((id) => productsById[id])
    .filter(Boolean)
    .map((product) => `${product.name} (${categoriesById[product.categoryId].name}, ${product.packSummary})`)
}

/** Message for the enquiry form. */
export function enquiryText(values) {
  const rows = [
    ['Name', values.name],
    ['Phone', values.phone],
    ['Enquiry type', values.enquiryType],
    ['Quantity or budget', values.quantity],
  ]
  const lines = [`Hello ${company.shortName} team,`, '', 'I would like to make an enquiry through your website.', '']
  for (const [label, value] of rows) if (value?.trim()) lines.push(`${label}: ${value.trim()}`)
  if (values.message.trim()) lines.push('', 'Message:', values.message.trim())
  lines.push('', 'Thank you.')
  return lines.join('\n')
}

export function enquiryWhatsApp(values) {
  return whatsappHref(enquiryText(values))
}

/** Message for one-tap enquiries from product, collection, gifting and bulk buttons. */
export function quickEnquiryText({ products = [], categoryId, gifting = false, bulk = false } = {}) {
  const category = categoryId ? categoriesById[categoryId] : null
  const items = productLines(products)
  const lines = [`Hello ${company.shortName} team,`, '']

  if (category) {
    const names = productsInCategory(category.id).map((product) => product.name)
    lines.push(`I would like to enquire about your ${category.name} (${names.join(', ')}).`)
  } else if (items.length === 1) lines.push(`I would like to enquire about ${items[0]}.`)
  else if (items.length) lines.push('I would like to enquire about:', ...items.map((item) => `• ${item}`))
  else if (gifting) lines.push('I would like to enquire about gift boxes and gift hampers.')
  else if (bulk) lines.push('I would like to enquire about a bulk or corporate order.')
  else lines.push('I would like to enquire about your cookies and gifting options.')

  if (gifting) lines.push('Please also share the hamper options and optional add-ons.')
  lines.push('', 'Please share pricing and availability. Thank you.')
  return lines.join('\n')
}

/** Props for any "Enquire" link: opens WhatsApp in a new tab with a pre-written message. */
export function whatsappEnquiryLink(preset) {
  return {
    href: whatsappHref(quickEnquiryText(preset)),
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-describedby': WHATSAPP_NOTE_ID,
  }
}
