import { useRef } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/Button'
import SectionHeading from '../components/SectionHeading'
import { faqs } from '../data/brand'
import { useReveal } from '../hooks/useReveal'
import { whatsappEnquiryLink } from '../lib/enquiry'

/** "Questions, answered" — the FAQ from the current site, as an accordion of native <details>. */
export default function Faq() {
  const scope = useRef(null)
  useReveal(scope)

  return (
    <section id="faq" ref={scope} aria-labelledby="faq-title" className="section-y relative bg-cream-deep">
      <div className="container-site grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <SectionHeading
            id="faq-title"
            eyebrow="Good to know"
            title={
              <>
                Questions, <em className="text-amber-ink">answered</em>
              </>
            }
          />
          <p data-reveal="up" className="body-copy mt-5 max-w-sm text-brown-soft">
            Can&apos;t find what you are looking for? Ask us directly.
          </p>
          <div data-reveal="up" className="mt-7">
            <Button whatsapp {...whatsappEnquiryLink()}>
              Ask on WhatsApp
            </Button>
          </div>
        </div>

        <div className="border-t border-brown/15 lg:col-span-7 lg:col-start-6">
          {faqs.map((faq) => (
            <details key={faq.question} data-reveal="up" className="faq-item group border-b border-brown/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                <span className="font-display text-[1.3rem] font-semibold leading-snug text-brown md:text-[1.45rem]">
                  {faq.question}
                </span>
                <span className="grid size-9 flex-none place-items-center rounded-full border border-brown/20 text-brown transition-[rotate,background-color,color] duration-300 group-open:rotate-45 group-open:bg-brown group-open:text-cream">
                  <Plus aria-hidden="true" className="size-4" strokeWidth={1.75} />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 pr-12 text-[0.98rem] leading-relaxed text-brown-soft">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
