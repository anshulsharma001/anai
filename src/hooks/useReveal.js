import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'

/*
 * Declarative scroll animation for everything inside `scope`:
 *   data-split           heading lines rise out of masks as it enters (re-splits on resize)
 *   data-reveal="up"     fades and rises into place as it enters the viewport
 *   data-reveal="image"  wipes open from the bottom edge
 *   data-parallax="6"    image drifts ±n% while its frame crosses the viewport
 *   data-drift="-60"     element moves n px over the same range (layered collages)
 *   data-expand          section panel grows from an inset card to full width
 * Nothing is hidden or moved when reduced motion is preferred.
 */
export function useReveal(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope)

        q('[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.25,
                stagger: 0.09,
                ease: 'power4.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          })
        })

        const rising = q('[data-reveal="up"]')
        if (rising.length) {
          gsap.set(rising, { opacity: 0, y: 36 })
          ScrollTrigger.batch(rising, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.09,
                overwrite: true,
                clearProps: 'transform',
              }),
          })
        }

        q('[data-reveal="image"]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.6,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 86%', once: true },
            },
          )
        })

        q('[data-parallax]').forEach((el) => {
          const amount = Number(el.dataset.parallax) || 6
          gsap.fromTo(
            el,
            { yPercent: -amount, scale: 1 + (amount * 2.4) / 100 },
            {
              yPercent: amount,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })

        q('[data-drift]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 0 },
            {
              y: Number(el.dataset.drift) || -60,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })

        q('[data-expand]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0% 3.5% 0% 3.5% round 28px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 0px)',
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: true },
            },
          )
        })
      })
    },
    { scope },
  )
}
