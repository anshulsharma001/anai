import { useRef } from 'react'
import Button from '../components/Button'
import ResponsiveImage from '../components/ResponsiveImage'
import { useReveal } from '../hooks/useReveal'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../lib/gsap'

// Statement from the catalogue's own positioning.
const statement =
  'Freshly baked cookies for every budget — from everyday trays and family jars to luxury gift boxes and hampers. Crisp, buttery, irresistibly good — and made to be shared.'

const pillars = [
  { title: 'Everyday enjoyment', text: 'Tray packs of Chocochip, Coconut, Kaju and Jeera cookies for tea-time.' },
  {
    title: 'Family-size jars',
    text: 'Reusable 1 kg jars of Coconut and Ajwain cookies — big value for homes and counters.',
  },
  { title: 'Premium gift boxes', text: 'Dryfruits, Butter Kaju, Kaju Pista and the Triple Treat assorted pack.' },
  { title: 'Festive & corporate gifting', text: 'Tulle-wrapped hampers and flexible packing for bulk orders.' },
]

export default function Manifesto() {
  const scope = useRef(null)
  const statementRef = useRef(null)
  useReveal(scope)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const el = statementRef.current
        // The statement lights up word by word as it scrolls through.
        SplitText.create(el, {
          type: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.15 },
              {
                opacity: 1,
                stagger: 0.1,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.6 },
              },
            ),
        })
      })
    },
    { scope },
  )

  // Laid out like the current site's story: a photo beside the company name and a short story; fits one screen.
  return (
    <section
      id="story"
      ref={scope}
      aria-labelledby="story-title"
      className="relative bg-cream py-[clamp(3.5rem,7vw,5.5rem)]"
    >
      <div className="container-site grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-14">
        <figure className="relative lg:col-span-5">
          <div
            data-reveal="image"
            className="relative mx-auto aspect-[4/3] max-w-xl overflow-hidden bg-brown-deep lg:aspect-auto lg:h-[min(72svh,38rem)] lg:max-w-none"
          >
            <ResponsiveImage
              data-parallax="6"
              imageKey="generated/piping"
              alt="Buttery dough being piped into ridged swirls on a dark baking tray, each finished swirl topped with a cashew"
              sizes="(min-width: 1024px) 36vw, 100vw"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <figcaption className="mx-auto mt-3 flex max-w-xl justify-between gap-4 font-display text-base italic text-brown-soft lg:max-w-none">
            <span>Piped, bakery-style swirls.</span>
            <span className="not-italic text-[0.62rem] uppercase tracking-[0.22em]">Illustrative</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-7">
          <p data-reveal="up" className="eyebrow eyebrow-rule text-amber-ink">
            Our Story
          </p>
          <h2
            id="story-title"
            data-reveal="up"
            className="mt-4 font-display text-[clamp(2.1rem,3.4vw,3.25rem)] font-semibold leading-[1.06] text-brown"
          >
            Anai Foods &amp; Agro <em className="text-amber-ink">Pvt. Ltd.</em>
          </h2>
          <p
            ref={statementRef}
            className="mt-5 max-w-2xl font-display text-[clamp(1.25rem,1.7vw,1.6rem)] leading-snug text-brown"
          >
            {statement}
          </p>
          <p data-reveal="up" className="body-copy mt-4 max-w-2xl text-brown-soft">
            Anai brings together cookies for the cup of chai, the family get-together, the festive table and the
            thank-you gift — in sealed tea-time trays, reusable family jars, printed gift boxes and tulle-wrapped
            hampers.
          </p>

          <dl className="mt-6 grid border-t border-brown/15 sm:grid-cols-2 sm:gap-x-8">
            {pillars.map((pillar, index) => (
              <div
                key={pillar.title}
                data-reveal="up"
                className="group grid grid-cols-[2.25rem_1fr] border-b border-brown/15 py-3"
              >
                <span className="font-display text-lg italic text-amber-ink">0{index + 1}</span>
                <div>
                  <dt className="font-display text-[1.2rem] font-semibold leading-tight text-brown transition-transform duration-500 group-hover:translate-x-1.5">
                    {pillar.title}
                  </dt>
                  <dd className="mt-0.5 text-[0.88rem] leading-relaxed text-brown-soft">{pillar.text}</dd>
                </div>
              </div>
            ))}
          </dl>
          <div data-reveal="up" className="mt-6">
            <Button href="#products" variant="outline">
              Explore the range
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
