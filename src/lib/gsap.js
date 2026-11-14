import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
// Phones resize the viewport as the address bar shows and hides; re-measuring on that makes the page jump.
ScrollTrigger.config({ ignoreMobileResize: true })
gsap.defaults({ ease: 'power3.out', duration: 0.9 })

// Animations are only registered inside this media query, so reduced-motion
// visitors get the final, static layout with no transforms applied.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
