import { useRef } from 'react'
import { ArrowUpRight, Download, Mail, MapPin, Phone } from 'lucide-react'
import Button from '../components/Button'
import SectionHeading from '../components/SectionHeading'
import { catalogue, company, emailHref, mapsHref, whatsappHref } from '../data/brand'
import { useReveal } from '../hooks/useReveal'
import { whatsappEnquiryLink } from '../lib/enquiry'
import WhatsAppIcon from '../components/WhatsAppIcon'

const channels = [
  { icon: Phone, label: 'Call us', value: company.phoneDisplay, href: company.phoneHref },
  { icon: Mail, label: 'Email', value: company.email, href: emailHref },
  { icon: null, label: 'WhatsApp', value: 'Message us on WhatsApp', href: whatsappHref(), external: true },
]

export default function Contact() {
  const scope = useRef(null)
  useReveal(scope)

  return (
    <section id="contact" ref={scope} aria-labelledby="contact-title" className="section-y relative bg-cream">
      <div className="container-site grid gap-y-16 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-6">
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title={
              <>
                Let&apos;s make something <em className="text-amber-ink">to share.</em>
              </>
            }
            intro="Call, write or message us about orders, gifting and bulk enquiries."
          />

          <ul className="mt-10 border-t border-brown/15">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label} data-reveal="up" className="border-b border-brown/15">
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group grid grid-cols-[2.75rem_1fr_auto] items-center gap-x-4 py-5"
                >
                  {Icon ? (
                    <span className="grid size-11 place-items-center rounded-full border border-brown/20 text-amber-ink transition-colors duration-500 group-hover:border-brown group-hover:bg-brown group-hover:text-cream">
                      <Icon aria-hidden="true" className="size-[1.1rem]" strokeWidth={1.5} />
                    </span>
                  ) : (
                    <WhatsAppIcon badge className="size-11" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-[0.66rem] font-medium uppercase tracking-[0.22em] text-brown-soft">
                      {label}
                    </span>
                    <span className="mt-1 block break-words font-display text-[1.2rem] leading-tight text-brown sm:text-[1.4rem] xl:text-[1.5rem]">
                      {value}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-brown-soft transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                  />
                  {external ? <span className="sr-only">(opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
            <li data-reveal="up" className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-brown/15 py-6">
              <span className="grid size-11 place-items-center rounded-full border border-brown/20 text-amber-ink">
                <MapPin aria-hidden="true" className="size-[1.1rem]" strokeWidth={1.5} />
              </span>
              <div>
                <span className="block text-[0.66rem] font-medium uppercase tracking-[0.22em] text-brown-soft">
                  Address
                </span>
                <address className="mt-1 font-display text-2xl not-italic leading-snug text-brown md:text-[1.75rem]">
                  {company.name}
                  <br />
                  {company.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-brown"
                >
                  <span className="link-underline">Find us on Google Maps</span>
                  <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* A plain panel that lines up with the contact list (same top and height); no film, no sticky scroll. */}
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="on-dark grain relative flex h-full flex-col justify-center overflow-hidden bg-brown-deep p-8 sm:p-10">
            <p data-reveal="up" className="eyebrow text-amber-soft">
              Bulk &amp; corporate orders
            </p>
            <h3 data-reveal="up" className="display-title mt-5 text-cream">
              Planning something <em className="text-amber-soft">for many?</em>
            </h3>
            <p data-reveal="up" className="mt-5 max-w-sm text-[1.02rem] leading-relaxed text-sand">
              Trays, jars, gift boxes or tiered hampers — tell us what you need, with special rates for large and repeat
              orders.
            </p>
            <div data-reveal="up" className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button whatsapp {...whatsappEnquiryLink({ bulk: true })}>
                Start a Bulk Enquiry
              </Button>
              <Button variant="outline" icon={Download} href={catalogue.href} download={catalogue.fileName}>
                Download Catalogue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
