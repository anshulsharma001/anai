import { useCallback, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import Button from './Button'
import DiamondList from './DiamondList'
import ResponsiveImage from './ResponsiveImage'
import { hamperAddOns } from '../data/brand'
import { categoriesById, productsById, productsInCategory } from '../data/products'
import { useScrollLock } from '../hooks/useScrollLock'
import { useSite } from '../hooks/useSite'
import { whatsappEnquiryLink } from '../lib/enquiry'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'

function SectionLabel({ children }) {
  return (
    <h3 className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-amber-ink">{children}</h3>
  )
}

export default function ProductDetails() {
  const { productId, openProduct, closeProduct } = useSite()
  const dialogRef = useRef(null)
  const contentRef = useRef(null)
  const scrollRef = useRef(null)
  const returnFocus = useRef(null)
  const product = productId ? productsById[productId] : null
  const isOpen = Boolean(product)
  useScrollLock(isOpen)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || dialog.open) return
    returnFocus.current = document.activeElement
    dialog.showModal()
    if (!prefersReducedMotion()) {
      gsap.fromTo(dialog, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.65, ease: 'expo.out' })
    }
  }, [isOpen])

  // Moving between products inside the open dialog: reset scroll and fade the new content in.
  useGSAP(
    () => {
      if (!product || !contentRef.current) return
      contentRef.current.scrollTop = 0
      scrollRef.current.scrollTop = 0
      if (!prefersReducedMotion()) {
        gsap.fromTo('[data-detail]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04 })
      }
    },
    { dependencies: [productId], scope: dialogRef },
  )

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current
    const finish = () => {
      if (dialog.open) dialog.close()
      closeProduct()
      returnFocus.current?.focus?.({ preventScroll: true })
    }
    if (prefersReducedMotion()) {
      finish()
      return
    }
    gsap.to(dialog, { opacity: 0, y: 24, duration: 0.3, ease: 'power2.in', onComplete: finish })
  }, [closeProduct])

  const category = product ? categoriesById[product.categoryId] : null
  const siblings = product ? productsInCategory(product.categoryId) : []
  const index = siblings.findIndex((item) => item.id === productId)
  const previous = siblings.length > 1 ? siblings[(index - 1 + siblings.length) % siblings.length] : null
  const next = siblings.length > 1 ? siblings[(index + 1) % siblings.length] : null
  const contained = category?.layout.fit === 'contain'

  // Everything fits in one view: the dialog takes its content's height, with details and highlights side by side.
  return (
    <dialog
      ref={dialogRef}
      data-lenis-prevent
      aria-labelledby="product-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onClose={closeProduct}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose()
      }}
      className="m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-none overflow-y-auto border-0 bg-cream p-0 text-brown md:max-h-[calc(100dvh-3rem)] md:w-[min(64rem,calc(100%-4rem))]"
    >
      {product ? (
        <>
          <button
            type="button"
            onClick={() => requestClose()}
            aria-label="Close product details"
            className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-cream text-brown shadow-[0_8px_24px_-12px_rgb(42_23_10/0.6)] transition-colors hover:bg-brown hover:text-cream"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
          <div ref={scrollRef} className="md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div
              className={`relative h-[20svh] min-h-32 md:h-auto md:min-h-[26rem] ${contained ? product.tone : 'bg-brown-deep'}`}
            >
              <ResponsiveImage
                key={product.id}
                data-detail
                imageKey={product.image}
                alt={product.imageAlt}
                sizes="(min-width: 768px) 26rem, 100vw"
                className={
                  contained
                    ? 'product-shadow absolute inset-[8%] size-[84%] object-contain'
                    : 'absolute inset-0 size-full object-cover'
                }
              />
              {product.badge ? (
                <span className="absolute left-3 top-3 rounded-full bg-amber px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-brown-deep">
                  {product.badge}
                </span>
              ) : null}
            </div>

            <div ref={contentRef} className="px-4 pb-4 pt-4 sm:px-7 sm:pb-5 sm:pt-5 md:px-8 md:py-7">
              <p data-detail className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-amber-ink">
                {category.name} · {product.label}
              </p>
              <h2
                id="product-dialog-title"
                data-detail
                className="mt-1.5 pr-10 font-display text-[1.6rem] font-semibold leading-tight text-brown md:text-[2rem]"
              >
                {product.name}
              </h2>
              <p data-detail className="mt-1 text-[0.92rem] leading-snug text-brown-soft">
                {product.tagline}
              </p>
              <p data-detail className="mt-2 text-[0.86rem] leading-snug text-brown">
                <span className="font-semibold">Best for:</span> {product.bestFor}
              </p>

              <div data-detail className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-brown/15 pt-3">
                <section>
                  <SectionLabel>{product.hamper ? 'Hamper' : 'Pack details'}</SectionLabel>
                  <dl className="mt-1.5 flex flex-col gap-1.5">
                    {product.details
                      .filter((detail) => detail.label !== 'Best for')
                      .map((detail) => (
                        <div key={detail.label}>
                          <dt className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-brown-soft">
                            {detail.label}
                          </dt>
                          <dd className="text-[0.82rem] leading-snug text-brown">{detail.value}</dd>
                        </div>
                      ))}
                  </dl>
                </section>
                <section>
                  <SectionLabel>{product.hamper ? 'Optional add-ons' : 'Highlights'}</SectionLabel>
                  <DiamondList
                    items={product.hamper ? hamperAddOns : (product.highlights ?? [])}
                    className="mt-1.5 flex flex-col gap-1 text-[0.82rem] leading-snug text-brown"
                  />
                </section>
              </div>

              {product.ingredients ? (
                <p data-detail className="mt-3 bg-cream-deep px-3 py-2 text-[0.74rem] leading-snug text-brown-soft">
                  <span className="font-semibold text-brown">Ingredients:</span> {product.ingredients}
                </p>
              ) : null}

              {product.note ? (
                <p data-detail className="mt-2 text-[0.74rem] italic leading-snug text-brown-soft">
                  {product.note}
                </p>
              ) : null}

              <div
                data-detail
                className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-brown/15 pt-4"
              >
                <Button
                  whatsapp
                  size="sm"
                  {...whatsappEnquiryLink({ products: [product.id], gifting: Boolean(product.hamper) })}
                >
                  Enquire on WhatsApp
                </Button>
                {previous && next ? (
                  <nav aria-label={`More in ${category.name}`} className="flex items-center gap-4 text-[0.8rem]">
                    <button
                      type="button"
                      onClick={() => openProduct(previous.id)}
                      className="group inline-flex items-center gap-1.5 text-brown-soft hover:text-brown"
                    >
                      <ArrowLeft
                        aria-hidden="true"
                        className="size-4 flex-none transition-transform group-hover:-translate-x-0.5"
                        strokeWidth={1.5}
                      />
                      <span className="sr-only">Previous: {previous.name}</span>
                      <span aria-hidden="true">Prev</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openProduct(next.id)}
                      className="group inline-flex items-center gap-1.5 text-brown-soft hover:text-brown"
                    >
                      <span className="sr-only">Next: {next.name}</span>
                      <span aria-hidden="true">Next</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 flex-none transition-transform group-hover:translate-x-0.5"
                        strokeWidth={1.5}
                      />
                    </button>
                  </nav>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </dialog>
  )
}
