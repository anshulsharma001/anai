import { Fragment, useRef } from 'react'
import { Wheat } from 'lucide-react'
import Marquee from '../components/Marquee'
import ResponsiveImage from '../components/ResponsiveImage'
import { hamperAddOns } from '../data/brand'
import { categories, packGuide, products } from '../data/products'
import { useActiveSection } from '../hooks/useActiveSection'
import { useReveal } from '../hooks/useReveal'
import { useSite } from '../hooks/useSite'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'

// Every figure is a count from the catalogue itself.
const figures = [
  { value: products.length, pad: 2, label: 'Products across the range' },
  { value: categories.length, pad: 2, label: 'Collections, from trays to hampers' },
  { value: hamperAddOns.length, pad: 2, label: 'Optional hamper add-ons' },
  { value: 1.2, decimals: 1, suffix: ' kg', prefix: '≈', label: 'Our largest hamper, the Royal 3-Tier' },
]

// Packs shown beside each reason: [image key, left %, top %, width %, tilt in degrees], back to front.
const visuals = [
  // A range for every occasion: a jar, a tray and a gift box together
  [
    ['products/coconut-jar', 30, 6, 58, 0],
    ['products/chocochip-tray', 6, 28, 34, -8],
    ['products/kaju-pista-box', 22, 58, 62, 4],
  ],
  // Packaging that fits the purpose: jar, sealed tray and printed box
  [
    ['products/ajwain-jar', 10, 6, 30, -4],
    ['products/jeera-tray', 42, 16, 31, 7],
    ['products/triple-treat-box', 24, 56, 58, -3],
  ],
  // Gift-ready presentation: the three printed gift boxes
  [
    ['products/dryfruits-box', 22, 8, 62, -6],
    ['products/butter-kaju-box', 8, 34, 62, 4],
    ['products/kaju-pista-box', 28, 56, 62, -2],
  ],
  // For homes, shelves and offices: family jars and everyday trays
  [
    ['products/coconut-jar', 15, 4, 70, 0],
    ['products/coconut-tray', 6, 50, 30, -6],
    ['products/classic-crunch-tray', 40, 64, 52, 4],
  ],
  // Gifting, your way: the three hampers
  [
    ['hampers/royal-3-tier', 37, 6, 26, 0],
    ['hampers/double-delight', 8, 32, 28, -5],
    ['hampers/classic-jar', 62, 38, 31, 5],
  ],
]

const reasons = [
  {
    title: 'A range for every occasion',
    text: 'From 200 g tea-time trays to 1 kg family jars and premium gift boxes — one range covers daily snacking and celebrations alike.',
  },
  {
    title: 'Packaging that fits the purpose',
    text: 'Sealed PET trays, reusable airtight jars, printed gift boxes with shrink wrap and tulle-wrapped hampers. The everyday trays are hygienically sealed.',
  },
  {
    title: 'Gift-ready presentation',
    text: 'Hexagon-frame and bird-artwork boxes in brown, cream and green, designed to be handed over just as they are.',
  },
  {
    title: 'For homes, shelves and offices',
    text: 'Family jars for households and functions, trays for retail shelves and tea-time, and gift boxes for corporate orders.',
  },
  {
    title: 'Gifting, your way',
    text: 'Hamper contents, sizes, tulle colour and ribbon can be tailored to your budget, with optional add-ons from greeting cards to mithai boxes.',
  },
]

const reasonIds = visuals.map((_, index) => `why-reason-${index + 1}`)

const marqueeWords = ['Trays', 'Jars', 'Gift Boxes', 'Hampers', 'Bulk Orders']

function format({ pad, decimals = 0, prefix = '', suffix = '' }, current) {
  const number = decimals ? current.toFixed(decimals) : String(Math.round(current)).padStart(pad ?? 1, '0')
  return `${prefix}${number}${suffix}`
}

export default function WhyAnai() {
  const scope = useRef(null)
  const { selectCategory } = useSite()
  const activeId = useActiveSection(reasonIds)
  const active = Math.max(0, reasonIds.indexOf(activeId))
  useReveal(scope)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        scope.current.querySelectorAll('[data-figure]').forEach((el, index) => {
          const figure = figures[index]
          const counter = { value: 0 }
          el.textContent = format(figure, 0)
          gsap.to(counter, {
            value: figure.value,
            duration: 2,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onUpdate: () => {
              el.textContent = format(figure, counter.value)
            },
          })
        })
        gsap.utils.toArray('[data-reason-line]', scope.current).forEach((line) => {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.4,
              ease: 'expo.out',
              scrollTrigger: { trigger: line, start: 'top 88%', once: true },
            },
          )
        })
      })
    },
    { scope },
  )

  return (
    <section id="why" ref={scope} aria-labelledby="why-title" className="relative overflow-x-clip bg-cream-deep">
      <Marquee
        speed={22}
        className="border-y border-brown/15 py-3 text-brown md:py-4"
        itemClassName="gap-5 pr-5 md:gap-7 md:pr-7"
      >
        {marqueeWords.map((word) => (
          <Fragment key={word}>
            <span className="whitespace-nowrap font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold italic leading-none text-brown">
              {word}
            </span>
            <Wheat className="size-5 flex-none text-amber md:size-6" strokeWidth={1.25} />
          </Fragment>
        ))}
      </Marquee>

      <div className="container-site section-y">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <div className="lg:col-span-7">
            <p data-reveal="up" className="eyebrow eyebrow-rule text-olive-ink">
              Why Anai
            </p>
            <h2 id="why-title" data-split className="display-section mt-6 text-brown">
              One range. <em className="text-olive-ink">Every</em> occasion.
            </h2>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 border-t border-brown/15 lg:grid-cols-4">
          {figures.map((figure) => (
            <div
              key={figure.label}
              data-reveal="up"
              className="flex flex-col border-b border-brown/15 py-8 pr-4 odd:border-r odd:pr-6 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
            >
              <dt className="order-2 mt-3 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-brown-soft">
                {figure.label}
              </dt>
              <dd
                data-figure
                className="font-display text-[clamp(2.6rem,4.6vw,4.5rem)] font-semibold leading-none text-brown lining-nums tabular-nums"
              >
                {format(figure, figure.value)}
              </dd>
            </div>
          ))}
        </dl>

        <div data-why-body className="relative mt-16 grid gap-y-12 md:mt-20 lg:grid-cols-12 lg:gap-x-10">
          {/* Sticky panel: its packs change with the reason in the middle of the screen. */}
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="sticky top-[max(6rem,calc(50vh-17rem))]">
              <div aria-hidden="true" className="relative aspect-square">
                <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgb(201_138_43/0.3),transparent)]" />
                {visuals.map((layers, index) => {
                  const shown = index === active
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-500 ${shown ? 'opacity-100' : 'opacity-0'}`}
                    >
                      {layers.map(([key, left, top, width, tilt], layer) => (
                        <div
                          key={key}
                          className="absolute"
                          style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, zIndex: layer }}
                        >
                          <div
                            className={`motion-safe:transition-[translate,scale] motion-safe:duration-700 motion-safe:ease-[var(--ease-soft)] ${
                              shown ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'
                            }`}
                            style={{ rotate: `${tilt}deg`, transitionDelay: shown ? `${layer * 90}ms` : '0ms' }}
                          >
                            <ResponsiveImage
                              imageKey={key}
                              alt=""
                              sizes="22vw"
                              className="h-auto w-full drop-shadow-[0_28px_32px_rgb(74_42_18/0.35)]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="font-display text-lg italic text-olive-ink">
                  0{active + 1} <span className="text-brown-soft">/ 0{reasons.length}</span>
                </span>
                <span className="relative h-px flex-1 bg-brown/15">
                  <span
                    className="absolute inset-y-0 left-0 bg-olive-ink transition-[width] duration-500"
                    style={{ width: `${((active + 1) / reasons.length) * 100}%` }}
                  />
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-brown-soft">Digital renderings</span>
              </div>
            </div>
          </div>

          <ol className="lg:col-span-7">
            {reasons.map((reason, index) => {
              // The row's own opacity belongs to the reveal animation, so the dimming goes on its contents.
              const dim = `transition-opacity duration-500 ${index === active ? '' : 'lg:opacity-40'}`
              return (
                <li
                  key={reason.title}
                  id={reasonIds[index]}
                  data-reveal="up"
                  className="group relative grid grid-cols-[3.5rem_1fr] gap-x-4 py-7 md:grid-cols-[4.5rem_1fr] md:py-8 lg:min-h-[34vh] lg:content-center"
                >
                  <span
                    aria-hidden="true"
                    data-reason-line
                    className="absolute inset-x-0 top-0 h-px origin-left bg-brown/25"
                  />
                  <span
                    aria-hidden="true"
                    className={`font-display text-4xl italic leading-none text-olive-ink md:text-5xl ${dim}`}
                  >
                    0{index + 1}
                  </span>
                  <div className={dim}>
                    <h3 className="font-display text-[1.6rem] leading-tight text-brown transition-transform duration-700 ease-[var(--ease-soft)] group-hover:translate-x-2 md:text-[2rem]">
                      {reason.title}
                    </h3>
                    <p className="body-copy mt-3 max-w-lg text-brown-soft">{reason.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Pack guide, as on the current site: which format suits which buyer. */}
        <div
          data-reveal="up"
          className="mt-16 border border-brown/15 bg-cream px-5 py-8 sm:px-8 md:mt-20 md:px-10 md:py-10"
        >
          <p className="eyebrow text-olive-ink">Quick guide</p>
          <h3 className="display-title mt-3 text-brown">Which pack suits you</h3>

          <table className="mt-7 hidden w-full border-collapse text-left sm:table">
            <thead>
              <tr className="border-b border-brown/25 text-[0.66rem] uppercase tracking-[0.2em] text-brown-soft">
                <th scope="col" className="py-3 pr-6 font-medium">
                  Format
                </th>
                <th scope="col" className="py-3 pr-6 font-medium">
                  Pack sizes
                </th>
                <th scope="col" className="py-3 font-medium">
                  Best for
                </th>
              </tr>
            </thead>
            <tbody>
              {packGuide.map((row) => (
                <tr key={row.format} className="border-b border-brown/15 last:border-b-0">
                  <th scope="row" className="py-4 pr-6 align-top">
                    <button
                      type="button"
                      onClick={() => selectCategory(row.categoryId, { scroll: true })}
                      className="link-underline text-left font-display text-[1.3rem] font-semibold leading-tight text-brown"
                    >
                      {row.format}
                    </button>
                  </th>
                  <td className="py-4 pr-6 align-top text-[0.98rem] whitespace-nowrap text-brown">{row.sizes}</td>
                  <td className="py-4 align-top text-[0.98rem] text-brown-soft">{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phones: the same rows as stacked cards. */}
          <ul className="mt-6 flex flex-col divide-y divide-brown/15 border-y border-brown/15 sm:hidden">
            {packGuide.map((row) => (
              <li key={row.format} className="py-4">
                <button
                  type="button"
                  onClick={() => selectCategory(row.categoryId, { scroll: true })}
                  className="text-left font-display text-[1.25rem] font-semibold leading-tight text-brown"
                >
                  {row.format}
                </button>
                <p className="mt-1 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-amber-ink">
                  {row.sizes}
                </p>
                <p className="mt-1 text-[0.92rem] text-brown-soft">
                  <span className="font-medium text-brown">Best for:</span> {row.bestFor}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
