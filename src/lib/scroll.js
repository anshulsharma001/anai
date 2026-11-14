import { prefersReducedMotion } from './gsap'
import { getLenis } from './smooth'

const OFFSETS = { enquire: -96 }

export const CHAPTER_EVENT = 'anai:chapter'

/** Scroll to an in-page section through Lenis when it is running, otherwise natively. */
export function scrollToId(id) {
  const target = document.getElementById(id)
  if (!target) return
  const lenis = getLenis()
  // Scroll to a number rather than the element: Lenis would also subtract the CSS scroll-padding (meant for
  // native anchors), stopping short of the section.
  const y = target.getBoundingClientRect().top + window.scrollY + (OFFSETS[id] ?? 0)
  if (lenis) lenis.scrollTo(y, { duration: 1.6 })
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`)
}

/** Scroll to an absolute page offset (used to reach a chapter inside the pinned gallery). */
export function scrollToY(y, { immediate = false } = {}) {
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(y, { immediate, duration: 1.6 })
  else window.scrollTo({ top: y, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' })
}
