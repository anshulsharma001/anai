import { useState } from 'react'
import Button from './Button'
import ResponsiveImage from './ResponsiveImage'
import { productsById } from '../data/products'
import { useSite } from '../hooks/useSite'
import { whatsappEnquiryLink } from '../lib/enquiry'

const place = ({ left, top, bottom, width }) => ({
  left: `${left}%`,
  top: top === undefined ? undefined : `${top}%`,
  bottom: bottom === undefined ? undefined : `${bottom}%`,
  width: `${width}%`,
})

/** One collection, staged as a styled table (flat-lay prints) or a shelf (cut-outs) beside its product list. */
/** `tabHidden` hides the scene on phones and tablets, where one collection shows at a time under the tabs
 * (it keeps its space, so the page height never changes between tabs). */
export default function CollectionScene({ category, scene, total, tabHidden = false }) {
  const { openProduct } = useSite()
  const [active, setActive] = useState(null)
  const { theme } = scene
  const items = scene.items.map((item) => ({ ...item, product: productsById[item.id] }))

  const focusProps = (id) => ({
    onPointerEnter: () => setActive(id),
    onPointerLeave: () => setActive(null),
    onFocus: () => setActive(id),
    onBlur: () => setActive(null),
  })

  return (
    <div
      id={`chapter-${category.id}`}
      data-scene={category.id}
      aria-labelledby={`scene-${category.id}`}
      role="group"
      data-shown={tabHidden ? undefined : ''}
      className={`${theme.dark ? 'on-dark' : 'on-light'} ${theme.panel} relative isolate flex-none scroll-mt-0 overflow-hidden lg:motion-safe:h-full lg:motion-safe:w-screen max-lg:[grid-area:1/1] ${tabHidden ? 'max-lg:pointer-events-none max-lg:invisible' : ''}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 size-[70rem] rounded-full lg:motion-safe:right-[-12vw] lg:motion-safe:top-1/2 lg:motion-safe:-translate-y-1/2 max-lg:left-1/2 max-lg:top-0 max-lg:-translate-x-1/2"
        style={{ background: `radial-gradient(closest-side, ${theme.glow}, transparent)` }}
      />
      <span
        data-scene-numeral
        aria-hidden="true"
        className="outline-numeral pointer-events-none absolute -bottom-[0.18em] right-[2vw] -z-10 select-none text-[clamp(10rem,30vw,30rem)] leading-none opacity-[0.16]"
      >
        {category.number}
      </span>

      <div className="container-site grid gap-8 py-10 md:py-14 lg:grid-cols-12 lg:gap-12 lg:py-28 lg:items-center lg:gap-x-10 lg:motion-safe:flex lg:motion-safe:h-full lg:motion-safe:max-w-none lg:motion-safe:gap-[4vw] lg:motion-safe:px-[5vw] lg:motion-safe:pb-[11vh] lg:motion-safe:pt-[6.5rem]">
        <div data-scene-text className="lg:col-span-5 lg:motion-safe:w-[30vw] lg:motion-safe:flex-none">
          <p className={`eyebrow ${theme.accent}`}>
            Collection {category.number} <span className="opacity-60">/ 0{total}</span>
          </p>
          <h3
            id={`scene-${category.id}`}
            className="mt-4 font-display text-[clamp(2.4rem,4.2vw,4.5rem)] font-semibold leading-[1] tracking-[-0.015em]"
          >
            {category.name}
          </h3>
          <p
            className={`mt-4 max-w-md font-display text-[clamp(1.05rem,1.25vw,1.25rem)] italic leading-snug ${theme.muted}`}
          >
            {category.description}
          </p>

          <ol className={`mt-6 border-t ${theme.rule}`}>
            {items.map(({ id, product }, itemIndex) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => openProduct(id)}
                  {...focusProps(id)}
                  className={`group grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-3 border-b py-2.5 text-left transition-opacity duration-500 ${theme.rule} ${
                    active && active !== id ? 'lg:opacity-45' : ''
                  }`}
                >
                  <span className={`font-display text-sm italic ${theme.accent}`}>0{itemIndex + 1}</span>
                  <span className="min-w-0 transition-transform duration-500 group-hover:translate-x-1.5">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-display text-[1.25rem] leading-tight">{product.name}</span>
                      {product.badge ? (
                        <span className="rounded-full bg-amber px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-brown-deep">
                          {product.badge}
                        </span>
                      ) : null}
                    </span>
                    <span className={`mt-0.5 block text-[0.78rem] leading-snug ${theme.muted}`}>
                      Best for: {product.bestFor}
                    </span>
                  </span>
                  <span className={`text-[0.62rem] font-medium uppercase tracking-[0.18em] ${theme.muted}`}>
                    {product.packSummary}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          {category.note ? <p className={`mt-3 text-[0.82rem] italic ${theme.muted}`}>{category.note}</p> : null}

          <Button
            variant={theme.cta}
            size="sm"
            className="mt-6"
            whatsapp

            {...whatsappEnquiryLink({ categoryId: category.id, gifting: category.id === 'gift-hampers' })}
          >
            Enquire about {category.name}
          </Button>
        </div>

        <div
          data-scene-collage
          className="relative aspect-[1.3] w-full max-lg:order-first lg:col-span-7 lg:motion-safe:w-[min(58vw,calc((100svh-15rem)*1.3))] lg:motion-safe:flex-none"
        >
          {scene.shelf ? (
            <div aria-hidden="true" className={`absolute inset-x-[-4%] bottom-[11%] border-t ${theme.rule}`} />
          ) : null}

          {scene.props.map(({ key, depth, rotate, ...position }, propIndex) => (
            <div
              key={key}
              aria-hidden="true"
              data-prop
              data-depth={depth}
              className="pointer-events-none absolute"
              style={{ ...place(position), rotate: `${rotate}deg`, '--i': items.length + propIndex }}
            >
              <ResponsiveImage
                imageKey={key}
                alt=""
                sizes="10vw"
                className="h-auto w-full drop-shadow-[0_16px_18px_rgb(0_0_0/0.35)]"
              />
            </div>
          ))}

          {items.map(({ id, product, depth, rotate, ...position }, itemIndex) => {
            const isActive = active === id
            return (
              // GSAP animates this button; hover styling lives on the inner span so CSS transitions never fight it.
              <button
                key={id}
                type="button"
                data-object
                data-depth={depth}
                onClick={() => openProduct(id)}
                {...focusProps(id)}
                aria-label={`View ${product.name} details`}

                className="absolute block"
                style={{
                  ...place(position),
                  zIndex: isActive ? 30 : 10 + itemIndex,
                  '--tilt': `${rotate}deg`,
                  '--i': itemIndex,
                }}
              >
                <span
                  className={`relative block origin-bottom rotate-[var(--tilt)] transition-[rotate,translate,scale,opacity] duration-700 ease-[var(--ease-soft)] ${
                    isActive ? '-translate-y-3 scale-[1.05] rotate-0' : ''
                  } ${active && !isActive ? 'lg:opacity-40' : ''}`}
                >
                  {scene.shelf ? (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-[2%] left-1/2 h-[5%] w-[84%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-md"
                    />
                  ) : null}
                  <ResponsiveImage
                    imageKey={product.image}
                    alt={product.imageAlt}
                    sizes="(min-width: 1024px) 34vw, 60vw"
                    className="relative h-auto w-full drop-shadow-[0_26px_30px_rgb(0_0_0/0.42)]"
                  />
                  {product.badge ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[6%] top-[4%] whitespace-nowrap rounded-full bg-amber px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-brown-deep shadow-[0_8px_20px_-8px_rgb(0_0_0/0.6)] sm:text-[0.62rem]"
                    >
                      {product.badge}
                    </span>
                  ) : null}
                </span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-1/2 top-full z-40 mt-4 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-cream px-3.5 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-brown shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)] transition-[opacity,translate] duration-500 lg:block ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                  }`}
                >
                  {product.name} · {product.packSummary} · Best for {product.bestFor.toLowerCase()}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
