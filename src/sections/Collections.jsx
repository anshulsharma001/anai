import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import AllProducts from '../components/AllProducts'
import CollectionScene from '../components/CollectionScene'
import { scenes } from '../data/collectionScenes'
import { categories, products, productsInCategory } from '../data/products'
import { useReveal } from '../hooks/useReveal'
import { useSite } from '../hooks/useSite'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/gsap'
import { CHAPTER_EVENT, scrollToId, scrollToY } from '../lib/scroll'
import { getLenis } from '../lib/smooth'

const PINNED = `${MOTION_OK} and (min-width: 64rem)`
// Below this width the collections show one at a time under a row of tabs.
const TABBED = '(max-width: 63.99rem)'
// The "All" tab: every product as a card, grouped by collection.
const ALL = 'all'

export default function Collections() {
  const scope = useRef(null)
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const galleryRef = useRef(null)
  const [active, setActive] = useState(null)
  const { activeCategory, selectCategory } = useSite()
  const tabsRef = useRef(null)
  const panelsRef = useRef(null)
  const showAll = activeCategory === ALL
  const wasAll = useRef(showAll)
  const restY = useRef(null)
  useReveal(scope)

  // Track position (0..max) → page scroll offset, so scenes and focused items can be brought into view.
  const offsetFor = (x) => {
    const gallery = galleryRef.current
    if (!gallery) return null
    const { trigger, distance } = gallery
    const clamped = Math.max(0, Math.min(distance, x))
    return trigger.start + (clamped / distance) * (trigger.end - trigger.start)
  }

  const goToChapter = (id) => {
    selectCategory(id)
    const scene = document.getElementById(`chapter-${id}`)
    if (!scene) return
    const target = offsetFor(scene.offsetLeft)
    if (target !== null) scrollToY(target + 2)
    // Tabbed layout: open that tab, then bring the tabs to the top with the collection below them.
    else if (window.matchMedia(TABBED).matches) requestAnimationFrame(() => scrollToId('collection-tabs'))
    else scrollToId(`chapter-${id}`)
  }

  const showTab = (id) => {
    // Work out where the page should rest after the switch, before anything changes. If the tabs are stuck to the
    // top, the new collection should start right under them; otherwise the page stays exactly where it is.
    const bar = tabsRef.current
    const stuck = bar.getBoundingClientRect().top <= parseFloat(getComputedStyle(bar).top) + 1
    let rest = window.scrollY
    if (stuck) {
      const target = panelsRef.current.getBoundingClientRect().top + window.scrollY - bar.offsetHeight
      // Jumping back up brings the site header out again (it shows on upward scrolls), so leave room for it too.
      const header = target < window.scrollY ? (document.querySelector('header > div')?.offsetHeight ?? 0) : 0
      rest = target - header
    }
    restY.current = rest
    selectCategory(id)
    // Entering or leaving "All" changes the page height; the effect below re-measures and then puts the page here.
    if ((id === ALL) === showAll && stuck) requestAnimationFrame(() => scrollToY(rest, { immediate: true }))
  }

  // Tabbed layout: keep the chosen tab in view in its row. Single collections share one space, so switching between
  // them never changes the page height. Only entering or leaving "All" does: then the scroll positions below are
  // re-measured, and the visitor's place is put back explicitly (a bare refresh could leave phones at the top).
  useEffect(() => {
    if (!window.matchMedia(TABBED).matches) return
    const row = tabsRef.current?.querySelector('[data-tab-row]')
    const tab = row?.querySelector('[aria-pressed="true"]')
    if (tab) row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
    if (wasAll.current === showAll) return
    wasAll.current = showAll
    const y = restY.current ?? window.scrollY
    const frame = requestAnimationFrame(() => {
      getLenis()?.resize()
      ScrollTrigger.refresh()
      scrollToY(y, { immediate: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [activeCategory, showAll])

  // Tabbed layout: the packs of the visible collection deal in (CSS) the first time it is well in view;
  // after that, every newly opened tab replays it (the animation is keyed to the shown scene).
  useEffect(() => {
    const section = scope.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        section.dataset.deal = ''
        observer.disconnect()
      },
      { threshold: 0.3 },
    )
    section.querySelectorAll('[data-scene-collage]').forEach((collage) => observer.observe(collage))
    return () => observer.disconnect()
  }, [])

  // Images travel into view by transform, which native lazy-loading never notices, so load them all
  // once the visitor is within a screen of the section.
  useEffect(() => {
    const section = scope.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        section.querySelectorAll('img[loading="lazy"]').forEach((img) => {
          img.loading = 'eager'
        })
        observer.disconnect()
      },
      { rootMargin: '100% 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onChapter = (event) => goToChapter(event.detail)
    window.addEventListener(CHAPTER_EVENT, onChapter)
    return () => window.removeEventListener(CHAPTER_EVENT, onChapter)
  })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(PINNED, () => {
        const track = trackRef.current
        const distance = () => track.scrollWidth - window.innerWidth
        const sceneEls = gsap.utils.toArray('[data-scene]', track)
        let current = null

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const x = self.progress * distance() + window.innerWidth * 0.5
              const id = sceneEls.filter((scene) => scene.offsetLeft <= x).pop()?.dataset.scene ?? null
              if (id !== current) {
                current = id
                setActive(id)
              }
              galleryRef.current = { trigger: self, distance: distance() }
            },
            onRefresh: (self) => {
              galleryRef.current = { trigger: self, distance: distance() }
            },
          },
        })

        sceneEls.forEach((scene) => {
          const along = (start, end) => ({ trigger: scene, containerAnimation: tween, start, end, scrub: true })
          // Packs are dealt onto the table as the scene slides in.
          gsap.from(scene.querySelectorAll('[data-object]'), {
            xPercent: (i) => 90 + i * 35,
            yPercent: (i) => (i % 2 ? -18 : 18),
            rotation: (i) => (i % 2 ? 24 : -24),
            opacity: 0,
            ease: 'none',
            stagger: 0.06,
            scrollTrigger: along('left 95%', 'left 22%'),
          })
          gsap.from(scene.querySelectorAll('[data-scene-text] > *'), {
            x: 160,
            opacity: 0,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: along('left 85%', 'left 30%'),
          })
          scene.querySelectorAll('[data-prop]').forEach((prop) => {
            const depth = Number(prop.dataset.depth) || 2
            gsap.fromTo(
              prop,
              { xPercent: 120 * depth, rotation: -30 * depth },
              {
                xPercent: -120 * depth,
                rotation: 30 * depth,
                ease: 'none',
                scrollTrigger: along('left right', 'right left'),
              },
            )
          })
          gsap.fromTo(
            scene.querySelector('[data-scene-numeral]'),
            { xPercent: 35 },
            { xPercent: -35, ease: 'none', scrollTrigger: along('left right', 'right left') },
          )
        })

        return () => {
          galleryRef.current = null
        }
      })
    },
    { scope },
  )

  // Keyboard users tabbing through the pinned gallery: bring whatever gains focus into view.
  const onFocus = (event) => {
    if (!galleryRef.current) return
    const target = event.target.closest('[data-object], button, a')
    if (!target) return
    const { left, right } = target.getBoundingClientRect()
    if (left >= 0 && right <= window.innerWidth) return
    const travelled = -gsap.getProperty(trackRef.current, 'x')
    const offset = offsetFor(travelled + left - window.innerWidth * 0.15)
    if (offset !== null) scrollToY(offset, { immediate: true })
  }

  return (
    <section
      id="products"
      ref={scope}
      aria-labelledby="products-title"
      className="relative bg-cream-deep [overflow-anchor:none]"
    >
      <div ref={pinRef} className="relative lg:motion-safe:h-svh lg:motion-safe:overflow-clip">
        <div
          ref={trackRef}
          onFocus={onFocus}
          className="flex flex-col lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:flex-row"
        >
          <div className="relative flex-none px-[clamp(1.25rem,5vw,4.5rem)] pb-10 pt-24 md:pt-32 lg:pb-20 lg:motion-safe:flex lg:motion-safe:h-full lg:motion-safe:w-[66vw] lg:motion-safe:flex-col lg:motion-safe:justify-center lg:motion-safe:pb-[11vh] lg:motion-safe:pt-[6.5rem]">
            <p data-reveal="up" className="eyebrow eyebrow-rule text-amber-ink">
              The Collection
            </p>
            <h2
              id="products-title"
              data-split
              className="mt-6 max-w-[54rem] font-display text-[clamp(2.6rem,5vw,5.5rem)] font-semibold leading-[1] tracking-[-0.015em] text-brown"
            >
              Five collections, <em className="text-amber-ink">sixteen</em> ways to share.
            </h2>
            <ol className="mt-12 max-w-[46rem] border-t border-brown/15 max-lg:hidden">
              {categories.map((category) => (
                <li key={category.id} data-reveal="up">
                  <button
                    type="button"
                    onClick={() => goToChapter(category.id)}
                    className="group grid w-full grid-cols-[2.75rem_1fr_auto] items-baseline gap-4 border-b border-brown/15 py-4 text-left"
                  >
                    <span className="font-display text-lg italic text-amber-ink">{category.number}</span>
                    <span className="font-display text-[clamp(1.4rem,1.9vw,2rem)] leading-none text-brown transition-transform duration-500 group-hover:translate-x-2">
                      {category.name}
                    </span>
                    <span className="flex items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-brown-soft">
                      {productsInCategory(category.id).length} products
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 -translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                        strokeWidth={1.5}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-10 hidden items-center gap-3 text-[0.66rem] font-medium uppercase tracking-[0.24em] text-brown-soft lg:motion-safe:flex">
              Keep scrolling to travel through the range
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </p>
          </div>

          <div
            id="collection-tabs"
            ref={tabsRef}
            className="sticky top-[var(--header-offset,0px)] z-20 border-y border-brown/10 bg-cream-deep/95 transition-[top] duration-500 shadow-[0_10px_24px_-20px_rgb(42_23_10/0.6)] lg:hidden"
          >
            <div
              role="group"
              aria-label="Choose a collection"
              data-tab-row
              className="scrollbar-none flex gap-2 overflow-x-auto px-[clamp(1.25rem,5vw,4.5rem)] py-3"
            >
              {[
                { id: ALL, short: 'All', count: products.length, controls: 'collection-all' },
                ...categories.map((category) => ({
                  id: category.id,
                  short: scenes[category.id].short,
                  count: productsInCategory(category.id).length,
                  controls: `chapter-${category.id}`,
                })),
              ].map((tab) => {
                const current = tab.id === activeCategory
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => showTab(tab.id)}
                    aria-pressed={current}
                    aria-controls={tab.controls}
                    className={`flex flex-none items-center gap-2 rounded-full px-4 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                      current ? 'bg-brown text-cream' : 'bg-cream text-brown ring-1 ring-brown/15'
                    }`}
                  >
                    {tab.short}
                    <span
                      className={`font-display text-sm normal-case tracking-normal ${current ? 'text-amber-soft' : 'text-brown-soft'}`}
                    >
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Everything under the tabs. On desktop both wrappers dissolve, leaving the scenes in the gallery track. */}
          <div ref={panelsRef} className="lg:contents">
            {showAll ? <AllProducts id="collection-all" /> : null}
            <div className={`lg:contents ${showAll ? 'max-lg:hidden' : 'max-lg:grid'}`}>
              {categories.map((category) => (
                <CollectionScene
                  key={category.id}
                  category={category}
                  scene={scenes[category.id]}
                  total={categories.length}
                  tabHidden={!showAll && category.id !== activeCategory}
                />
              ))}
            </div>
          </div>
        </div>

        <nav
          aria-label="Collections"
          className="pointer-events-none absolute inset-x-0 bottom-[3.5vh] z-30 hidden justify-center lg:motion-safe:flex"
        >
          <ul className="pointer-events-auto flex items-center gap-1 rounded-full bg-cream/95 p-1.5 shadow-[0_18px_40px_-18px_rgb(42_23_10/0.55)] ring-1 ring-brown/10">
            {categories.map((category) => {
              const current = category.id === active
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => goToChapter(category.id)}
                    aria-current={current ? 'true' : undefined}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] transition-colors duration-500 ${
                      current ? 'bg-brown text-cream' : 'text-brown hover:bg-brown/10'
                    }`}
                  >
                    <span className="font-display text-sm normal-case italic tracking-normal opacity-70">
                      {category.number}
                    </span>
                    {scenes[category.id].short}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </section>
  )
}
