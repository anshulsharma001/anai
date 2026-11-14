import { ArrowUp, Download } from 'lucide-react'
import Button from './Button'
import Logo from './Logo'
import { catalogue, company, disclaimers, emailHref, navLinks, whatsappHref } from '../data/brand'
import { categories } from '../data/products'
import { useSite } from '../hooks/useSite'
import { whatsappEnquiryLink } from '../lib/enquiry'

const YEAR = new Date().getFullYear()

function ColumnTitle({ children }) {
  return (
    <h2 className="font-sans text-[0.66rem] font-medium uppercase tracking-[0.24em] text-amber-soft">{children}</h2>
  )
}

export default function Footer() {
  const { selectCategory } = useSite()

  return (
    <footer className="on-dark grain relative overflow-hidden bg-brown">
      <div className="container-site pb-10 pt-16 md:pt-20">
        <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <Logo variant="cream" className="h-auto w-44 md:w-52" />
            <p className="mt-8 max-w-sm text-[0.98rem] leading-relaxed text-sand">
              Crisp, buttery cookies in everyday trays, family jars, premium gift boxes and gift hampers — for homes,
              shelves and celebrations.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <Button whatsapp {...whatsappEnquiryLink({ bulk: true })}>
                Enquire for Bulk Orders
              </Button>
              <Button variant="outline" icon={Download} href={catalogue.href} download={catalogue.fileName}>
                Download Catalogue
              </Button>
            </div>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-6">
            <ColumnTitle>Explore</ColumnTitle>
            <ul className="mt-6 flex flex-col gap-3">
              {[...navLinks, { id: 'faq', label: 'FAQ' }].map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="link-grow text-cream/90 hover:text-cream">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <ColumnTitle>Collections</ColumnTitle>
            <ul className="mt-6 flex flex-col gap-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => selectCategory(category.id, { scroll: true })}
                    className="link-grow text-left text-cream/90 hover:text-cream"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <ColumnTitle>Get in touch</ColumnTitle>
            <ul className="mt-6 flex flex-col gap-3 text-cream/90">
              <li>
                <a href={company.phoneHref} className="link-grow hover:text-cream">
                  {company.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={emailHref} className="link-grow break-all hover:text-cream">
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-grow hover:text-cream"
                >
                  WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
            <address className="mt-6 text-[0.95rem] not-italic leading-relaxed text-sand">
              {company.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-cream/15 pt-8 text-sm text-sand lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-2">
            <p>
              © {YEAR} {company.name} All rights reserved. Made in India
            </p>
            <p className="text-[0.82rem] leading-relaxed text-sand/85">
              {disclaimers.images} Pack sizes for some products are indicative and can be customised on request.{' '}
              {disclaimers.prices}
            </p>
          </div>
          <a
            href="#home"
            className="inline-flex flex-none items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-cream"
          >
            <span className="link-underline">Back to top</span>
            <ArrowUp aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  )
}
