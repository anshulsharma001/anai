import { useRef } from 'react'
import Button from '../components/Button'
import ResponsiveImage from '../components/ResponsiveImage'
import { hamperAddOns } from '../data/brand'
import { useReveal } from '../hooks/useReveal'
import { whatsappEnquiryLink } from '../lib/enquiry'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'

const occasions = [
  {
    title: 'Premium gift boxes',
    text: 'Dryfruits, Butter Kaju and Kaju Pista in printed gift boxes from 250 g to 1 kg, wrapped for freshness.',
  },
  {
    title: 'Festive hampers',
    text: 'Tiered, tulle-wrapped jar hampers that arrive ready to gift — from a single jar to a three-tier stack.',
  },
  {
    title: 'Corporate gifting',
    text: 'Gift boxes suited to corporate orders, with bulk pricing for large and repeat orders.',
  },
  {
    title: 'Weddings & occasions',
    text: 'The Triple Treat assorted pack of cookies, laddoo and namkeen, made for festivals and weddings.',
  },
]

export default function Gifting() {
  const scope = useRef(null)
  useReveal(scope)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-addon]', {
          opacity: 0,
          y: 30,
          rotation: () => gsap.utils.random(-8, 8),
          stagger: 0.07,
          duration: 0.9,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: '[data-addons]', start: 'top 80%', once: true },
        })
      })
    },
    { scope },
  )

  return (
    <section id="gifting" ref={scope} aria-labelledby="gifting-title" className="relative overflow-x-clip bg-cream">
      {/* Split opening: copy on the left, the festive scene in an arched frame with gift packs on the right. */}
      <div className="container-site grid items-center gap-y-14 pt-[clamp(4rem,8vw,7rem)] lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-6">
          <p data-reveal="up" className="eyebrow eyebrow-rule text-amber-ink">
            Gifting
          </p>
          <h2 id="gifting-title" data-split className="display-section mt-6 max-w-xl text-brown">
            Gifts that say <em className="text-amber-ink">especially for you.</em>
          </h2>
          <p data-reveal="up" className="body-copy mt-6 max-w-lg text-brown-soft">
            From festive hampers to wedding favours and corporate celebrations, Anai&apos;s gift boxes and jar hampers
            are ready to give. Contents, sizes and wrapping can be tailored to your budget.
          </p>
          <div data-reveal="up" className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button whatsapp {...whatsappEnquiryLink({ gifting: true })}>
              Create a Gift Enquiry
            </Button>
            <Button variant="outline" href="#products">
              See gift boxes &amp; hampers
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:col-start-8 lg:max-w-none">
          <div aria-hidden="true" className="absolute -inset-3 rounded-t-full border border-amber/40 sm:-inset-4" />
          <figure data-reveal="image" className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-roast">
            <ResponsiveImage
              data-parallax="6"
              imageKey="generated/diwali-hampers"
              alt="Anai gift hampers for Diwali: a three-tier and a two-tier jar hamper in orange tulle and a single jar in mint tulle, with lit diyas, marigolds and rangoli"
              sizes="(min-width: 1024px) 38vw, 90vw"
              className="absolute inset-0 size-full object-cover object-[50%_40%]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-roast/50 via-transparent" />
            <figcaption className="absolute bottom-4 right-6 text-right text-[0.6rem] uppercase tracking-[0.24em] text-sand/85">
              Illustrative scene
            </figcaption>
          </figure>
          <div aria-hidden="true" className="absolute -bottom-6 -left-8 w-[52%] -rotate-6 sm:-left-14">
            <div data-drift="-50">
              <ResponsiveImage
                imageKey="products/dryfruits-box"
                alt=""
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="h-auto w-full drop-shadow-[0_26px_30px_rgb(42_23_10/0.45)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-site pb-[clamp(4rem,8vw,7rem)] pt-20 md:pt-24">
        <ul className="grid gap-x-10 border-t border-brown/15 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((occasion, index) => (
            <li key={occasion.title} data-reveal="up" className="border-b border-brown/15 py-7 lg:border-b-0 lg:pb-0">
              <span className="font-display text-lg italic text-olive-ink">0{index + 1}</span>
              <h3 className="mt-2 font-display text-[1.45rem] leading-tight text-brown">{occasion.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-brown-soft">{occasion.text}</p>
            </li>
          ))}
        </ul>

        <div
          data-reveal="up"
          className="on-dark relative mt-14 overflow-hidden bg-brown-deep px-6 py-10 sm:px-10 md:mt-20 md:px-12 md:py-12"
        >
          <div className="relative grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-5">
              <p className="eyebrow text-amber-soft">Make it extra special</p>
              <h3 className="display-title mt-5 text-cream">Optional add-ons</h3>
              <p className="mt-5 font-display text-lg italic text-sand">
                Hamper sizes are indicative; contents and sizes can be tailored to your budget.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul data-addons className="flex flex-wrap gap-3">
                {hamperAddOns.map((addOn) => (
                  <li
                    key={addOn}
                    data-addon
                    className="rounded-full border border-cream/25 px-5 py-3 text-[0.98rem] text-cream transition-colors duration-500 hover:border-amber-soft hover:bg-amber-soft hover:text-brown-deep"
                  >
                    {addOn}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button whatsapp {...whatsappEnquiryLink({ gifting: true })}>
                  Create a Gift Enquiry
                </Button>
                <Button variant="outline" href="#bulk">
                  Bulk &amp; corporate orders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
