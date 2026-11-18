import { Fragment, useRef } from 'react'
import { ArrowDown, Download, Wheat } from 'lucide-react'
import Button from '../components/Button'
import Marquee from '../components/Marquee'
import ResponsiveImage from '../components/ResponsiveImage'
import { catalogue } from '../data/brand'
import { categories, products, productsById, productsInCategory } from '../data/products'
import { useSite } from '../hooks/useSite'
import { whatsappEnquiryLink } from '../lib/enquiry'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'
import { introDone } from '../lib/intro'

const STAGE = '(min-width: 81.25rem) and (min-height: 43.75rem)'

const headline = [
  { words: ['Thoughtfully', 'baked.'], className: 'text-cream' },
  { words: ['Beautifully', 'shared.'], className: 'italic text-amber-soft' },
]

// Gift boxes staged either side of the cookies. `spread` is how far each drifts outward on scroll.
const props = [
  {
    product: productsById['kaju-pista-cookies'],
    tilt: '-rotate-[7deg]',
    depth: 26,
    spread: { x: -220, rotate: -18 },
    position:
      'left-[-5%] top-[-7%] w-[38%] sm:left-[2%] sm:top-[4%] sm:w-[32%] stage:left-[-2vw] stage:top-[31vh] stage:w-[15vw]',
  },
  {
    product: productsById['butter-kaju-cookies'],
    tilt: 'rotate-[6deg]',
    depth: 18,
    spread: { x: 220, rotate: 18 },
    position:
      'right-[-5%] top-[-11%] w-[36%] sm:right-[2%] sm:top-[0%] sm:w-[30%] stage:right-[-2vw] stage:top-[30vh] stage:w-[17vw]',
  },
]

// Decorative cookies and nuts (generated cut-outs) floating at different depths on the large-screen stage.
const floats = [
  {
    key: 'generated/swirl-almond',
    place: 'left-[76%] top-[55%] w-[9vw]',
    depth: 58,
    travel: -240,
    spin: 40,
    layer: 'z-[26]',
  },
  {
    key: 'generated/butter-round',
    place: 'left-[33%] top-[82%] w-[10vw] blur-[3px] stage-short:left-[47%] stage-short:top-[80%] stage-short:w-[8vw]',
    depth: 80,
    travel: -420,
    spin: -30,
    layer: 'z-[36]',
  },
  {
    key: 'generated/cashew-a',
    place: 'left-[64%] top-[78%] w-[3vw]',
    depth: 34,
    travel: -160,
    spin: 70,
    layer: 'z-[34]',
  },
  {
    key: 'generated/almond-a',
    place: 'left-[88%] top-[16%] w-[2.6vw]',
    depth: 22,
    travel: -120,
    spin: -60,
    layer: 'z-[15]',
  },
  {
    key: 'generated/pistachio-a',
    place: 'left-[7%] top-[17%] w-[2.4vw] blur-[1.5px]',
    depth: 16,
    travel: -90,
    spin: 50,
    layer: 'z-[15]',
  },
  {
    key: 'generated/crumbs-a',
    place: 'left-[71%] top-[86%] w-[4vw]',
    depth: 44,
    travel: -200,
    spin: 20,
    layer: 'z-[34]',
  },
]

const ribbonWords = [
  'Chocochip',
  'Coconut',
  'Kaju',
  'Jeera',
  'Ajwain',
  'Dryfruits',
  'Butter Kaju',
  'Kaju Pista',
  'Triple Treat',
  'Kaju Swirl',
  'Badam Swirl',
  'Classic Crunch',
]

// The photo and its cut-out share this exact geometry, so the cut-out lands pixel-for-pixel on the photo.
function CookieLayer({ imageKey, alt, className = '' }) {
  return (
    <div
      data-hero-cookies
      className={`pointer-events-none absolute bottom-0 left-1/2 aspect-[2336/1744] h-full origin-bottom -translate-x-1/2 stage:left-[55%] stage:h-[60%] ${className}`}
    >
      <ResponsiveImage
        data-hero-img
        data-depth="10"
        imageKey={imageKey}
        alt={alt}
        sizes="(min-width: 1280px) 52vw, 100vw"
        priority
        className="hero-stage-mask size-full object-cover"
      />
    </div>
  )
}

export default function Hero() {
  const scope = useRef(null)
  const stageRef = useRef(null)
  const { selectCategory, openProduct } = useSite()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: MOTION_OK, finePointer: '(pointer: fine)', stage: STAGE }, ({ conditions }) => {
        if (!conditions.motion) return
        const stage = stageRef.current

        const intro = gsap
          .timeline({ paused: true, defaults: { ease: 'power4.out' } })
          .from('[data-hero-light]', { opacity: 0, duration: 1.8, ease: 'power2.out' }, 0)
          .from('[data-hero-eyebrow]', { opacity: 0, y: 14, duration: 0.9 }, 0.1)
          .from('[data-hero-char]', { yPercent: 115, duration: 1.2, stagger: 0.022 }, 0.15)
          .from('[data-hero-img]', { opacity: 0, scale: 1.15, duration: 2.4, ease: 'expo.out' }, 0.2)
          .from('[data-hero-prop]', { opacity: 0, yPercent: 45, scale: 0.9, duration: 1.4, stagger: 0.14 }, 0.7)
          .from(
            '[data-hero-float]',
            { opacity: 0, scale: 0.4, rotation: -40, duration: 1.6, stagger: 0.06, ease: 'back.out(1.6)' },
            0.8,
          )
          .from('[data-hero-copy]', { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.9)
        introDone.then(() => intro.play())

        if (conditions.stage) {
          // Pinned scene: the cookies rise toward the camera and swallow the headline behind them.
          const scene = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: stage, start: 'top top', end: '+=110%', pin: true, scrub: 1, anticipatePin: 1 },
          })
          scene
            .to('[data-hero-cookies]', { scale: 1.34, yPercent: -17 }, 0)
            .to('[data-hero-title]', { yPercent: -12, scale: 0.94 }, 0)
            .to('[data-hero-copy-block], [data-hero-aside]', { opacity: 0, y: -50, duration: 0.35 }, 0)
          gsap.utils.toArray('[data-hero-spread]', stage).forEach((el) => {
            scene.to(el, { x: Number(el.dataset.spreadX), rotation: Number(el.dataset.spreadRotate), opacity: 0 }, 0)
          })
          gsap.utils.toArray('[data-hero-float-wrap]', stage).forEach((el) => {
            scene.to(el, { y: Number(el.dataset.travel), rotation: Number(el.dataset.spin) }, 0)
          })
        } else {
          const leaving = { trigger: stage, start: 'top top', end: 'bottom top', scrub: true }
          gsap.to('[data-hero-title]', { yPercent: -18, ease: 'none', scrollTrigger: leaving })
          gsap.to('[data-hero-cookies]', { scale: 1.1, ease: 'none', scrollTrigger: leaving })
        }

        if (!conditions.finePointer) return

        // Layers drift with the cursor at different depths, under a soft warm light.
        const glow = stage.querySelector('[data-hero-glow]')
        gsap.set(glow, { xPercent: -50, yPercent: -50, x: stage.offsetWidth / 2, y: stage.offsetHeight * 0.55 })
        const glowX = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3' })
        const glowY = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3' })
        const layers = gsap.utils.toArray('[data-depth]', stage).map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3' }),
          y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3' }),
        }))
        const onMove = (event) => {
          const bounds = stage.getBoundingClientRect()
          const px = event.clientX - bounds.left
          const py = event.clientY - bounds.top
          layers.forEach((layer) => {
            layer.x((px / bounds.width - 0.5) * layer.depth)
            layer.y((py / bounds.height - 0.5) * layer.depth)
          })
          glowX(px)
          glowY(py)
        }
        const onEnter = () => gsap.to(glow, { opacity: 1, duration: 0.8 })
        const onLeave = () => gsap.to(glow, { opacity: 0, duration: 0.8 })
        stage.addEventListener('pointermove', onMove)
        stage.addEventListener('pointerenter', onEnter)
        stage.addEventListener('pointerleave', onLeave)
        return () => {
          stage.removeEventListener('pointermove', onMove)
          stage.removeEventListener('pointerenter', onEnter)
          stage.removeEventListener('pointerleave', onLeave)
        }
      })
    },
    { scope },
  )

  return (
    <section id="home" ref={scope} aria-labelledby="hero-title" className="on-dark grain relative bg-roast text-cream">
      <div
        ref={stageRef}
        className="relative isolate flex min-h-svh flex-col overflow-hidden bg-roast pb-14 stage:pb-0"
      >
        <div aria-hidden="true" data-hero-light className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/2 top-[-18%] h-[70%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(201_138_43/0.2),transparent)]" />
          <div className="absolute bottom-[-10%] left-1/2 h-[70%] w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(226_180_103/0.16),transparent)] stage:left-[55%]" />
        </div>
        <div
          aria-hidden="true"
          data-hero-glow
          className="pointer-events-none absolute left-0 top-0 z-0 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(226_180_103/0.12),transparent)] opacity-0"
        />

        <div className="relative z-[28] px-5 pt-40 text-center md:pt-44 stage:pt-[max(9.5rem,18vh)] stage-short:pt-[8.25rem]">
          <p data-hero-eyebrow className="eyebrow justify-center text-amber-soft">
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-60 sm:w-12" />
            <span>
              Cookies &amp; gifting<span className="hidden sm:inline"> · Anai Foods &amp; Agro</span>
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-60 sm:w-12" />
          </p>
          <h1 id="hero-title" data-hero-title className="display-stage mx-auto mt-7 max-w-[92rem] stage-short:mt-5">
            <span className="sr-only">Thoughtfully baked. Beautifully shared.</span>
            <span aria-hidden="true" className="block">
              {headline.map((line) => (
                <span key={line.words[0]} className="line-mask px-[0.06em]">
                  <span className={line.className}>
                    {line.words.map((word, index) => (
                      <Fragment key={word}>
                        {index > 0 ? ' ' : null}
                        <span className="inline-block whitespace-nowrap">
                          {[...word].map((char, charIndex) => (
                            <span key={charIndex} data-hero-char className="inline-block">
                              {char}
                            </span>
                          ))}
                        </span>
                      </Fragment>
                    ))}
                  </span>
                </span>
              ))}
            </span>
          </h1>
        </div>

        <div
          data-hero-copy-block
          className="relative z-40 mx-auto mt-9 max-w-5xl px-5 text-center stage:absolute stage:bottom-[max(2.5rem,6vh)] stage:left-[clamp(1.25rem,5vw,4.5rem)] stage:mx-0 stage:mt-0 stage:w-[20rem] stage:px-0 stage:text-left stage-short:bottom-[max(1.75rem,4vh)] stage-short:w-[34rem]"
        >
          <p
            data-hero-copy
            className="body-copy mx-auto max-w-2xl text-sand stage:mx-0 stage-short:max-w-md stage-short:text-[0.95rem] stage-short:leading-relaxed"
          >
            Crisp, buttery cookies for every budget — in everyday trays, family jars, premium gift boxes and
            tulle-wrapped hampers.
          </p>
          <p
            data-hero-copy
            className="mt-4 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-amber-soft stage-short:mt-3"
          >
            {[
              `${products.length} products`,
              `${categories.length} collections`,
              '200 g – 1 kg packs',
              'Bulk pricing flexible',
            ].map((fact, index, list) => (
              // The dot rides at the end of the previous fact, so a wrapped line never starts with one.
              <Fragment key={fact}>
                <span className="whitespace-nowrap">
                  {fact}
                  {index < list.length - 1 ? ' ·' : null}
                </span>{' '}
              </Fragment>
            ))}
          </p>
          <div
            data-hero-copy
            className="mx-auto mt-7 flex flex-col items-stretch gap-3 sm:max-w-sm lg:max-w-none lg:flex-row lg:justify-center stage:mx-0 stage:flex-col stage:items-stretch stage-short:mt-5 stage-short:flex-row stage-short:flex-wrap stage-short:justify-start stage-short:gap-2.5 [&>a]:whitespace-nowrap stage-short:[&>a]:min-h-11 stage-short:[&>a]:px-4 stage-short:[&>a]:text-[0.68rem] stage-short:[&>a]:tracking-[0.14em] stage-short:[&>a.btn-outline]:bg-roast/80"
          >
            <Button href="#products">Explore Our Collection</Button>
            <Button variant="outline" whatsapp {...whatsappEnquiryLink({ bulk: true })}>
              Enquire for Bulk Orders
            </Button>
            <Button variant="outline" icon={Download} href={catalogue.href} download={catalogue.fileName}>
              Download Catalogue
            </Button>
          </div>
        </div>

        {/* Stage: photo below the headline, the same cookies cut out above it, boxes and floats around. */}
        <div className="relative mx-auto mt-10 h-[clamp(17rem,74vw,31rem)] w-full max-w-[60rem] stage:absolute stage:inset-0 stage:mt-0 stage:h-auto stage:max-w-none">
          <CookieLayer
            imageKey="lifestyle/cookie-stage"
            alt="A stack of golden butter cookies beside piped swirl cookies topped with a cashew and an almond, on a dark table scattered with nuts"
            className="z-[5]"
          />
          <CookieLayer imageKey="lifestyle/cookie-stage-cutout" alt="" className="z-[25]" />

          {props.map(({ product, tilt, depth, spread, position }) => (
            <div
              key={product.id}
              data-hero-spread
              data-spread-x={spread.x}
              data-spread-rotate={spread.rotate}
              className={`absolute z-30 ${position}`}
            >
              <div data-hero-prop data-depth={depth}>
                <button
                  type="button"
                  onClick={() => openProduct(product.id)}
                  aria-label={`View ${product.name} details`}

                  className={`block w-full transition-[rotate,translate] duration-700 ease-[var(--ease-soft)] hover:-translate-y-2 hover:rotate-0 focus-visible:rotate-0 ${tilt}`}
                >
                  <ResponsiveImage
                    imageKey={product.image}
                    alt={product.imageAlt}
                    sizes="(min-width: 1280px) 17vw, 44vw"
                    priority
                    className="h-auto w-full drop-shadow-[0_30px_34px_rgb(0_0_0/0.7)]"
                  />
                </button>
              </div>
            </div>
          ))}

          {floats.map(({ key, place, depth, travel, spin, layer }) => (
            <div
              key={key}
              aria-hidden="true"
              data-hero-float-wrap
              data-travel={travel}
              data-spin={spin}
              className={`pointer-events-none absolute hidden stage:block ${layer} ${place}`}
            >
              <div data-hero-float data-depth={depth}>
                <ResponsiveImage
                  imageKey={key}
                  alt=""
                  sizes="12vw"
                  priority
                  className="h-auto w-full drop-shadow-[0_24px_30px_rgb(0_0_0/0.55)]"
                />
              </div>
            </div>
          ))}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[2%] right-[6%] z-[35] w-[22%] sm:w-[16%] stage:hidden"
          >
            <div data-hero-float>
              <ResponsiveImage
                imageKey="generated/swirl-almond"
                alt=""
                sizes="22vw"
                className="h-auto w-full drop-shadow-[0_18px_24px_rgb(0_0_0/0.55)]"
              />
            </div>
          </div>
        </div>

        <div
          data-hero-aside
          className="absolute bottom-[max(2.5rem,6vh)] right-[clamp(1.25rem,5vw,4.5rem)] z-40 hidden flex-col items-end gap-6 stage:flex"
        >
          <a
            href="#products"
            data-hero-copy
            className="group inline-flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-sand hover:text-cream"
          >
            <span className="link-grow">Scroll to explore</span>
            <ArrowDown
              aria-hidden="true"
              className="size-4 transition-transform duration-500 group-hover:translate-y-0.5"
              strokeWidth={1.5}
            />
          </a>
        </div>
      </div>

      <div className="container-site relative">
        <ul className="grid border-t border-cream/15 lg:grid-cols-5">
          {categories.map((category) => (
            <li
              key={category.id}
              className="border-b border-cream/15 lg:border-b-0 lg:border-l lg:first:border-l-0 lg:[&:first-child>button]:pl-0"
            >
              <button
                type="button"
                onClick={() => selectCategory(category.id, { scroll: true })}
                className="group flex w-full items-baseline gap-4 py-4 text-left lg:flex-col lg:gap-1.5 lg:px-6 lg:py-7"
              >
                <span className="font-display text-lg italic text-amber-soft">{category.number}</span>
                <span className="flex flex-1 items-baseline justify-between gap-3 lg:flex-col lg:gap-1">
                  <span className="link-grow text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream">
                    {category.name}
                  </span>
                  <span className="text-sm text-sand">
                    {productsInCategory(category.id).length} products · {category.packRange}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Marquee
        speed={100}
        maxBoost={0}
        className="mt-10 bg-brown py-2.5 text-cream md:mt-14 md:py-3"
        itemClassName="gap-5 pr-5 font-display text-xl italic md:gap-7 md:pr-7 md:text-2xl"
      >
        {ribbonWords.map((word) => (
          <Fragment key={word}>
            <span className="whitespace-nowrap">{word}</span>
            <Wheat className="size-4 flex-none text-amber-soft md:size-5" strokeWidth={1.25} />
          </Fragment>
        ))}
      </Marquee>
    </section>
  )
}
