import { useRef } from 'react'
import { Phone } from 'lucide-react'
import EnquiryForm from '../components/EnquiryForm'
import Marquee from '../components/Marquee'
import { bulkBenefits, company, whatsappHref } from '../data/brand'
import { useReveal } from '../hooks/useReveal'
import WhatsAppIcon from '../components/WhatsAppIcon'

export default function BulkOrders() {
  const scope = useRef(null)
  useReveal(scope)

  return (
    <section id="bulk" ref={scope} aria-labelledby="bulk-title" className="relative bg-cream-deep">
      <div data-expand className="on-dark grain relative bg-brown-deep">
        <Marquee
          speed={24}
          className="border-b border-cream/10 pb-4 pt-10 text-cream md:pb-5 md:pt-14"
          itemClassName="gap-6 pr-6 font-display text-[clamp(1.6rem,3vw,2.6rem)] italic leading-none md:gap-9 md:pr-9"
        >
          <span className="whitespace-nowrap">Good things are better shared</span>
          <span className="text-amber-soft">✦</span>
        </Marquee>
        <div className="container-site section-y grid gap-y-16 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p data-reveal="up" className="eyebrow eyebrow-rule text-amber-soft">
                Bulk &amp; Corporate Orders
              </p>
              <h2 id="bulk-title" data-reveal="up" className="display-section mt-6 text-cream">
                Good things are <em className="text-amber-soft">better shared.</em>
              </h2>
              <p data-reveal="up" className="body-copy mt-7 max-w-md text-sand">
                Planning a retail order, festive hamper, wedding gift, or corporate celebration? Explore Anai&apos;s
                cookie collections and flexible packaging options for bulk enquiries.
              </p>

              <ol className="mt-12 border-t border-cream/15">
                {bulkBenefits.map((benefit, index) => (
                  <li
                    key={benefit.title}
                    data-reveal="up"
                    className="grid grid-cols-[3rem_1fr] border-b border-cream/15 py-6"
                  >
                    <span className="font-display text-2xl italic text-amber-soft">0{index + 1}</span>
                    <div>
                      <h3 className="font-display text-[1.5rem] leading-tight text-cream">{benefit.title}</h3>
                      <p className="mt-1 text-[0.98rem] text-sand">{benefit.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div data-reveal="up" className="mt-10">
                <p className="text-[0.66rem] font-medium uppercase tracking-[0.22em] text-sand">Prefer to talk?</p>
                <div className="mt-4 flex flex-col gap-3 text-cream sm:flex-row sm:gap-8">
                  <a href={company.phoneHref} className="inline-flex items-center gap-3">
                    <Phone aria-hidden="true" className="size-4 text-amber-soft" strokeWidth={1.5} />
                    <span className="link-underline">{company.phoneDisplay}</span>
                  </a>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3"
                  >
                    <WhatsAppIcon badge className="size-5" />
                    <span className="link-underline">WhatsApp us</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            id="enquire"
            data-reveal="up"
            className="on-light bg-cream px-5 py-10 text-brown sm:px-10 md:px-12 md:py-12 lg:col-span-7 lg:self-start"
          >
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  )
}
