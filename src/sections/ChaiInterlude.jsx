import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'

const VIDEO = '/media/chai-pour.mp4'
const POSTER = '/media/chai-poster.webp'

export default function ChaiInterlude() {
  const scope = useRef(null)
  const videoRef = useRef(null)

  useGSAP(
    () => {
      const video = videoRef.current
      const mm = gsap.matchMedia()

      // The film plays by itself on a loop whenever the section is on screen (paused off screen to save battery).
      mm.add(MOTION_OK, () => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) video.play().catch(() => {})
            else video.pause()
          },
          { rootMargin: '200px 0px' },
        )
        observer.observe(video)

        // The frame opens to full bleed as the section scrolls in; the words rise once.
        gsap.fromTo(
          '[data-chai-frame]',
          { clipPath: 'inset(10% 14% 10% 14% round 32px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: scope.current, start: 'top 90%', end: 'top 10%', scrub: true },
          },
        )
        gsap.from('[data-chai-line]', {
          yPercent: 110,
          opacity: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: scope.current, start: 'top 35%', once: true },
        })
        gsap.from('[data-chai-copy]', {
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.9,
          scrollTrigger: { trigger: scope.current, start: 'top 30%', once: true },
        })
        return () => observer.disconnect()
      })
    },
    { scope },
  )

  return (
    <section ref={scope} aria-labelledby="chai-title" className="on-dark relative h-svh overflow-hidden bg-cream">
      <div data-chai-frame className="absolute inset-0 overflow-hidden bg-roast">
        <video
          ref={videoRef}
          data-chai-video
          aria-hidden="true"
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          className="size-full object-cover"
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-roast/90 via-roast/25 to-roast/10" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-[11vh] text-center">
        <p data-chai-copy className="eyebrow text-amber-soft">
          Tea-time, every time
        </p>
        <h2 id="chai-title" className="display-section mt-6 text-cream">
          <span className="line-mask">
            <span data-chai-line>Made for chai.</span>
          </span>
          <span className="line-mask">
            <em data-chai-line className="text-amber-soft">
              Made for sharing.
            </em>
          </span>
        </h2>
        <p data-chai-copy className="body-copy mt-7 max-w-xl text-sand">
          From Jeera cookies made for chai to Classic Crunch that pairs with tea and coffee — there is an Anai tray for
          every tea-time.
        </p>
        <span data-chai-copy className="mt-6 text-[0.6rem] uppercase tracking-[0.24em] text-sand/80">
          Illustrative film
        </span>
      </div>
    </section>
  )
}
