import { useRef, useState } from 'react'
import Button from '../components/Button'
import ResponsiveImage from '../components/ResponsiveImage'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { disclaimers } from '../data/brand'
import { healthyRange } from '../data/healthyRange'
import { useReveal } from '../hooks/useReveal'
import { whatsappEnquiryLink } from '../lib/enquiry'

const CARD_SIZES = '(min-width: 90rem) 19rem, (min-width: 64rem) 22vw, (min-width: 40rem) 30vw, 46vw'

/**
 * One cookie: the packshot, swapping to its lifestyle photo on hover (mouse) or on tap/Enter (touch, keyboard).
 * The lifestyle photo is only requested once the visitor asks for it, so phones don't download 13 extra images.
 */
function HealthyCard({ item, index }) {
  const [scene, setScene] = useState(false)
  const [requested, setRequested] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const pointer = useRef(null)
  const showScene = scene && loaded

  const toggle = (next) => {
    setRequested(true)
    setScene(next)
  }

  return (
    <li
      data-reveal="up"
      onPointerEnter={(event) => event.pointerType === 'mouse' && toggle(true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && toggle(false)}
      className="group relative flex flex-col bg-cream-deep shadow-[0_14px_30px_-22px_rgb(42_23_10/0.6)] ring-1 ring-brown/10"
    >
      <div className="relative aspect-square overflow-hidden bg-parchment">
        <ResponsiveImage
          imageKey={item.pack}
          alt={item.packAlt}
          aria-hidden={showScene || undefined}
          sizes={CARD_SIZES}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        {requested ? (
          <ResponsiveImage
            imageKey={item.scene}
            alt={item.sceneAlt}
            aria-hidden={!showScene || undefined}
            sizes={CARD_SIZES}
            loading="eager"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-[var(--ease-soft)] motion-reduce:transition-none ${
              showScene ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}

        <span
          aria-hidden="true"
          className="absolute left-2 top-2 rounded-full bg-cream/90 px-2 py-0.5 font-display text-[0.8rem] italic leading-snug text-olive-ink sm:left-3 sm:top-3"
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Covers the photo: tap or press to see the other shot. Mouse users get it on hover instead. */}
        <button
          type="button"
          aria-pressed={scene}
          aria-label={`Show the lifestyle photo of ${item.name}`}
          onPointerDown={(event) => {
            pointer.current = event.pointerType
          }}
          onClick={() => {
            if (pointer.current !== 'mouse') toggle(!scene)
            pointer.current = null
          }}
          className="absolute inset-0 z-10 flex items-end justify-center pb-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-ink sm:pb-3"
        >
          <span aria-hidden="true" className="flex items-center gap-1 rounded-full bg-brown-deep/40 px-1.5 py-1 backdrop-blur-sm">
            {[false, true].map((dot) => (
              <span
                key={String(dot)}
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-500 ${
                  showScene === dot ? 'w-4 bg-cream' : 'w-1.5 bg-cream/55'
                }`}
              />
            ))}
          </span>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="mb-3 font-display text-[1.08rem] leading-tight text-brown sm:mb-4 sm:text-[1.3rem]">
          {item.name}
        </h3>
        <a
          {...whatsappEnquiryLink({ healthy: item.id })}
          aria-label={`Enquire about ${item.name} on WhatsApp`}
          className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 border border-brown/20 bg-cream px-3 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-brown transition-colors hover:border-brown sm:text-[0.66rem]"
        >
          <WhatsAppIcon badge className="size-4 flex-none" />
          Enquire
        </a>
      </div>
    </li>
  )
}

export default function HealthyRange() {
  const scope = useRef(null)
  useReveal(scope)

  return (
    <section id="healthy" ref={scope} aria-labelledby="healthy-title" className="section-y relative bg-cream">
      <div className="container-site">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <div className="lg:col-span-7">
            <p data-reveal="up" className="eyebrow eyebrow-rule text-olive-ink">
              Healthy Range
            </p>
            <h2 id="healthy-title" data-split className="display-section mt-6 max-w-2xl text-brown">
              Healthy cookies, <em className="text-olive-ink">from grains you know.</em>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p data-reveal="up" className="body-copy max-w-md text-brown-soft">
              Thirteen cookies made with everyday Indian grains and jaggery — ragi, jowar, bajra, oats, atta, sattu,
              besan and more.
            </p>
            <div data-reveal="up" className="mt-6 flex flex-col sm:flex-row">
              <Button whatsapp {...whatsappEnquiryLink({ healthy: true })}>
                Enquire about this range
              </Button>
            </div>
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:mt-14 lg:grid-cols-4 lg:gap-6">
          {healthyRange.map((item, index) => (
            <HealthyCard key={item.id} item={item} index={index} />
          ))}

          {/* Fills the last row: one cell on phones, two on tablets, three on desktop (with a photo from there up). */}
          <li
            data-reveal="up"
            className="on-dark relative flex flex-col justify-between gap-5 overflow-hidden bg-olive-deep p-4 sm:col-span-2 sm:p-8 lg:col-span-3 lg:p-10"
          >
            <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[44%] sm:block">
              <ResponsiveImage
                imageKey="healthy/millet-scene"
                alt=""
                sizes="(min-width: 64rem) 28vw, 36vw"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-olive-deep via-olive-deep/25 to-transparent" />
            </div>
            <div className="relative sm:max-w-[54%]">
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-amber-soft sm:text-[0.68rem]">
                All {healthyRange.length} varieties
              </p>
              <h3 className="mt-3 font-display text-[1.35rem] leading-tight text-cream sm:text-[2rem] lg:text-[2.4rem]">
                Stock the <em>Healthy Range</em>
              </h3>
              <p className="mt-3 text-[0.82rem] leading-snug text-sand sm:text-[0.95rem] sm:leading-relaxed">
                Ask us for pack sizes, prices and availability for your shop, office or home.
              </p>
            </div>
            <a
              {...whatsappEnquiryLink({ healthy: true })}
              className="relative inline-flex min-h-11 flex-none items-center justify-center gap-2 bg-cream px-3 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-brown-deep transition-colors hover:bg-amber-soft sm:min-h-12 sm:self-start sm:px-6 sm:text-[0.72rem]"
            >
              <WhatsAppIcon badge className="size-5 flex-none" />
              Enquire
            </a>
          </li>
        </ul>

        <p data-reveal="up" className="mt-6 text-[0.72rem] leading-relaxed text-brown-soft">
          Photographs are for representation. {disclaimers.prices}
        </p>
      </div>
    </section>
  )
}
