import ResponsiveImage from './ResponsiveImage'
import WhatsAppIcon from './WhatsAppIcon'
import { categories, productsInCategory } from '../data/products'
import { useSite } from '../hooks/useSite'
import { whatsappEnquiryLink } from '../lib/enquiry'

/** The "All" tab on phones and tablets: every product as a card, grouped by collection. */
export default function AllProducts({ id }) {
  const { openProduct } = useSite()
  let index = 0

  return (
    <div id={id} className="bg-cream-deep px-[clamp(1.25rem,5vw,4.5rem)] pb-14 pt-8 lg:hidden">
      {categories.map((category) => (
        <section key={category.id} aria-labelledby={`all-${category.id}`} className="mt-10 first:mt-0">
          <div className="flex items-baseline justify-between gap-4 border-b border-brown/15 pb-3">
            <h3 id={`all-${category.id}`} className="font-display text-[1.6rem] leading-tight text-brown">
              {category.name}
            </h3>
            <span className="flex-none text-[0.62rem] font-medium uppercase tracking-[0.16em] text-brown-soft">
              {category.packRange}
            </span>
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {productsInCategory(category.id).map((product) => (
              <li
                key={product.id}
                data-all-card
                style={{ '--i': index++ }}
                className="relative flex flex-col overflow-hidden bg-cream shadow-[0_14px_30px_-22px_rgb(42_23_10/0.6)] ring-1 ring-brown/10"
              >
                <div className={`relative aspect-square ${product.tone}`}>
                  <ResponsiveImage
                    imageKey={product.image}
                    alt={product.imageAlt}
                    sizes="(min-width: 640px) 30vw, 46vw"
                    className="product-shadow absolute inset-[10%] size-[80%] object-contain"
                  />
                  {product.badge ? (
                    <span className="absolute left-2 top-2 rounded-full bg-amber px-2 py-1 text-[0.52rem] font-semibold uppercase leading-none tracking-[0.12em] text-brown-deep">
                      {product.badge}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-3">
                  <h4 className="font-display text-[1.15rem] leading-tight text-brown">
                    {/* The whole card opens the details; the WhatsApp button sits above this layer. */}
                    <button
                      type="button"
                      onClick={() => openProduct(product.id)}
                      className="text-left after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-amber-ink"
                    >
                      {product.name}
                    </button>
                  </h4>
                  <p className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-amber-ink">
                    {product.packSummary}
                  </p>
                  <p className="mb-3 mt-1.5 text-[0.76rem] leading-snug text-brown-soft">
                    <span className="font-medium text-brown">Best for:</span> {product.bestFor}
                  </p>
                  <a
                    {...whatsappEnquiryLink({ products: [product.id], gifting: Boolean(product.hamper) })}
                    aria-label={`Enquire about ${product.name} on WhatsApp`}
                    className="relative z-10 mt-auto inline-flex min-h-9 items-center justify-center gap-2 border border-brown/20 bg-cream px-3 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-brown transition-colors hover:border-brown"
                  >
                    <WhatsAppIcon badge className="size-4" />
                    Enquire
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
