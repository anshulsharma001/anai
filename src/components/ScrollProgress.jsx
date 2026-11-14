import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'

export default function ScrollProgress() {
  const bar = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
        },
      )
    })
  })

  return (
    <div ref={bar} aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-amber" />
  )
}
