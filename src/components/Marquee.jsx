import { useRef } from 'react'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/gsap'

/**
 * A looping band of content whose speed and direction follow the visitor's scroll. Static for reduced motion.
 * `speed` is seconds per loop; `maxBoost` caps how much faster it runs while the page is being scrolled.
 */
export default function Marquee({ children, speed = 40, maxBoost = 6, className = '', itemClassName = '' }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const track = root.current.querySelector('[data-marquee-track]')
        const loop = gsap.to(track, { xPercent: -50, duration: speed, ease: 'none', repeat: -1 })
        let direction = 1
        const trigger = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            if (self.direction !== direction) direction = self.direction
            const boost = Math.min(Math.abs(self.getVelocity()) / 250, maxBoost)
            gsap.to(loop, { timeScale: direction * (1 + boost), duration: 0.4, overwrite: true })
          },
        })
        return () => trigger.kill()
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden="true" className={`overflow-hidden ${className}`}>
      <div data-marquee-track className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className={`flex flex-none items-center ${itemClassName}`}>
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
