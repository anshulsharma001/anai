import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { useScrollLock } from '../hooks/useScrollLock'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { completeIntro } from '../lib/intro'

const SESSION_KEY = 'anai-intro-seen'

function shouldPlay() {
  if (prefersReducedMotion()) return false
  try {
    return !sessionStorage.getItem(SESSION_KEY)
  } catch {
    return true
  }
}

// Waits for the hero's priority images (capped at 2.4s) so the curtain lifts onto a finished scene.
function heroImagesReady() {
  const images = [...document.querySelectorAll('img[fetchpriority="high"]')]
  const loads = images.map((img) =>
    img.complete ? Promise.resolve() : new Promise((resolve) => img.addEventListener('load', resolve, { once: true })),
  )
  const timeout = new Promise((resolve) => setTimeout(resolve, 2400))
  return Promise.race([Promise.all([...loads, document.fonts?.ready]), timeout])
}

export default function Preloader() {
  const [active, setActive] = useState(shouldPlay)
  const root = useRef(null)
  const counter = useRef(null)
  useScrollLock(active)

  useEffect(() => {
    if (!active) completeIntro()
  }, [active])

  useGSAP(
    () => {
      if (!active) return
      const count = { value: 0 }
      const intro = gsap
        .timeline()
        .from('[data-pre-logo]', { yPercent: 110, duration: 1.1, ease: 'power4.out' })
        .from('[data-pre-line]', { scaleX: 0, duration: 1.2, ease: 'power3.inOut' }, 0.15)
        .from('[data-pre-meta]', { opacity: 0, y: 12, duration: 0.8, stagger: 0.1 }, 0.3)
        .to(
          count,
          {
            value: 100,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(count.value)).padStart(3, '0')
            },
          },
          0.1,
        )

      Promise.all([heroImagesReady(), new Promise((resolve) => intro.eventCallback('onComplete', resolve))]).then(
        () => {
          gsap
            .timeline({
              onComplete: () => {
                try {
                  sessionStorage.setItem(SESSION_KEY, '1')
                } catch {
                  /* storage unavailable: the intro simply plays again next visit */
                }
                setActive(false)
              },
            })
            .to('[data-pre-logo]', { yPercent: -110, duration: 0.7, ease: 'power3.in' })
            .to('[data-pre-meta]', { opacity: 0, duration: 0.4 }, 0)
            .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, 0.35)
            .add(completeIntro, 0.75)
        },
      )
    },
    { scope: root, dependencies: [active] },
  )

  if (!active) return null

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="on-dark fixed inset-0 z-[100] flex flex-col bg-roast text-cream [clip-path:inset(0%_0%_0%_0%)]"
    >
      <div className="flex flex-1 items-center justify-center">
        <div className="overflow-hidden py-2">
          <div data-pre-logo>
            <Logo variant="cream" alt="" className="h-auto w-[min(62vw,22rem)]" />
          </div>
        </div>
      </div>
      <div className="container-site flex items-end justify-between pb-8">
        <p data-pre-meta className="font-display text-2xl italic text-amber-soft md:text-3xl">
          Especially for you
        </p>
        <p data-pre-meta className="font-display text-5xl tabular-nums leading-none md:text-7xl">
          <span ref={counter}>000</span>
        </p>
      </div>
      <div data-pre-line className="h-px origin-left bg-amber/60" />
    </div>
  )
}
