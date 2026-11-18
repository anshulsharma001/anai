import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, Mail, Menu, Phone, X } from 'lucide-react'
import Button from './Button'
import Logo from './Logo'
import { catalogue, company, emailHref, navLinks } from '../data/brand'
import { useActiveSection } from '../hooks/useActiveSection'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useHideOnScroll } from '../hooks/useHideOnScroll'
import { useScrolled } from '../hooks/useScrolled'
import { useScrollLock } from '../hooks/useScrollLock'
import { whatsappEnquiryLink } from '../lib/enquiry'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { scrollToId } from '../lib/scroll'

const sectionIds = navLinks.map((link) => link.id)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(32)
  const hidden = useHideOnScroll()
  const active = useActiveSection(sectionIds)
  const headerRef = useRef(null)
  const panelRef = useRef(null)
  const toggleRef = useRef(null)
  const barRef = useRef(null)

  const closeMenu = useCallback(() => {
    setOpen(false)
    toggleRef.current?.focus()
  }, [])

  useScrollLock(open)
  useFocusTrap(headerRef, open, closeMenu)

  // Publish how much of the screen the header covers, so sticky bars (the collection tabs) can sit just below it.
  useEffect(() => {
    const bar = barRef.current
    const root = document.documentElement
    const update = () => root.style.setProperty('--header-offset', hidden && !open ? '0px' : `${bar.offsetHeight}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(bar)
    return () => observer.disconnect()
  }, [hidden, open])

  useEffect(() => {
    const panel = panelRef.current
    const items = panel.querySelectorAll('[data-menu-item]')

    if (prefersReducedMotion()) {
      panel.hidden = !open
      if (open) items[0]?.focus()
      return
    }

    if (open) {
      panel.hidden = false
      items[0]?.focus({ preventScroll: true })
      const timeline = gsap
        .timeline()
        .fromTo(
          panel,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.out' },
        )
        .fromTo(items, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.05 }, 0.12)
      return () => timeline.kill()
    }

    if (!panel.hidden) {
      const tween = gsap.to(panel, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          panel.hidden = true
        },
      })
      return () => tween.kill()
    }
  }, [open])

  // Close the mobile menu if the viewport grows into the desktop layout.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 80rem)')
    const onChange = (event) => event.matches && setOpen(false)
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  const goTo = (event, id) => {
    event.preventDefault()
    setOpen(false)
    requestAnimationFrame(() => scrollToId(id))
  }

  const solid = scrolled && !open
  // Until the page scrolls, the bar sits over the dark hero stage (or the open menu), so it uses cream.
  const light = !solid

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      {/* Only the bar slides away: a transform on <header> would trap the fixed menu panel inside it. */}
      <div
        ref={barRef}
        className={`relative z-10 transition-[translate,background-color,border-color,box-shadow] duration-500 focus-within:translate-y-0 ${
          hidden && !open ? '-translate-y-full' : ''
        } ${
          solid
            ? 'border-b border-brown/10 bg-cream/95 shadow-[0_10px_30px_-24px_rgb(42_23_10/0.5)]'
            : 'border-b border-transparent'
        }`}
      >
        <div className="bg-gold text-brown-deep">
          <div className="container-site flex min-h-9 items-center justify-center gap-x-3 py-1.5 text-center text-[0.74rem] font-medium leading-tight tracking-[0.02em] sm:gap-x-5 sm:text-[0.8rem]">
            <span>Bulk &amp; corporate orders welcome</span>
            <span aria-hidden="true" className="text-brown-deep/50">
              |
            </span>
            <a href={company.phoneHref} className="hidden hover:underline sm:inline">
              Call or WhatsApp&nbsp; <span className="font-semibold">{company.phoneDisplay}</span>
            </a>
            <span aria-hidden="true" className="hidden text-brown-deep/50 sm:inline">
              |
            </span>
            <span className="inline-flex items-center gap-2">
              100% Vegetarian
              <span aria-hidden="true" className="veg-mark" />
            </span>
          </div>
        </div>
        <nav
          aria-label="Primary"
          className={`container-site flex items-center justify-between gap-6 transition-[padding] duration-500 ${
            solid ? 'py-3' : 'py-5 lg:py-6'
          }`}
        >
          <a
            href="#home"
            onClick={(event) => goTo(event, 'home')}
            className="flex-none"
            aria-label={`${company.name} — home`}
          >
            <Logo
              variant={light ? 'cream' : 'brown'}
              alt=""
              className={`h-auto transition-[width] duration-500 ${solid ? 'w-24' : 'w-28 lg:w-32'}`}
            />
          </a>

          <ul className="hidden items-center gap-6 xl:flex 2xl:gap-8">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => goTo(event, link.id)}
                  aria-current={active === link.id ? 'location' : undefined}
                  className={`link-grow pb-1 text-[0.7rem] font-medium uppercase tracking-[0.14em] whitespace-nowrap transition-colors ${
                    light
                      ? active === link.id
                        ? 'text-cream'
                        : 'text-sand hover:text-cream'
                      : active === link.id
                        ? 'text-brown'
                        : 'text-brown-soft hover:text-brown'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {/* Over the dark hero the outline button takes the cream treatment. */}
            <span className={light ? 'on-dark contents' : 'contents'}>
              <Button
                href={catalogue.href}
                download={catalogue.fileName}
                variant="outline"
                size="sm"
                icon={Download}
                className="hidden 2xl:inline-flex"
              >
                Catalogue
              </Button>
            </span>
            <Button
              {...whatsappEnquiryLink()}
              whatsapp
              size="sm"

              className="hidden sm:inline-flex"
            >
              Enquire Now
            </Button>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`grid size-11 place-items-center rounded-full border transition-colors xl:hidden ${
                light ? 'border-cream/40 text-cream' : 'border-brown/25 text-brown'
              }`}
            >
              {open ? (
                <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
              ) : (
                <Menu aria-hidden="true" className="size-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>
      </div>

      <nav
        ref={panelRef}
        id="mobile-menu"
        hidden
        data-lenis-prevent
        aria-label="Mobile"
        className="on-dark grain fixed inset-0 z-0 overflow-y-auto overscroll-contain bg-brown-deep xl:hidden"
      >
        {/* Fits one screen on phones held upright: link size and spacing follow the screen height, and the menu
            starts just under the header bar (its height is published as --header-offset). It only scrolls on very
            short screens, such as a phone turned sideways. */}
        <div className="container-site flex min-h-full flex-col pb-[max(1rem,env(safe-area-inset-bottom))] pt-[calc(var(--header-offset,7.75rem)+0.5rem)]">
          <ul className="flex flex-col">
            {navLinks.map((link, index) => (
              <li key={link.id} className="overflow-hidden border-b border-cream/10">
                <a
                  data-menu-item
                  href={`#${link.id}`}
                  onClick={(event) => goTo(event, link.id)}
                  aria-current={active === link.id ? 'location' : undefined}
                  className="flex items-baseline gap-4 py-[clamp(0.35rem,1.2vh,0.8rem)] font-display text-[clamp(1.05rem,2.8vh,1.6rem)] leading-tight text-cream"
                >
                  <span className="w-5 flex-none font-sans text-[0.62rem] tracking-[0.2em] text-amber-soft">
                    0{index + 1}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div data-menu-item className="mt-auto flex flex-col gap-2.5 pt-5">
            <Button {...whatsappEnquiryLink()} whatsapp size="sm" onClick={() => setOpen(false)} className="w-full">
              Enquire Now
            </Button>
            <Button
              href={catalogue.href}
              download={catalogue.fileName}
              variant="outline"
              size="sm"
              icon={Download}
              className="w-full"
            >
              Download Catalogue (PDF)
            </Button>
            <div className="mt-1.5 flex flex-col gap-1.5 text-[0.8rem] text-sand [@media(max-height:35rem)]:hidden">
              <a href={company.phoneHref} className="inline-flex items-center gap-3">
                <Phone aria-hidden="true" className="size-4 text-amber-soft" strokeWidth={1.5} />
                {company.phoneDisplay}
              </a>
              <a href={emailHref} className="inline-flex items-center gap-3 break-all">
                <Mail aria-hidden="true" className="size-4 flex-none text-amber-soft" strokeWidth={1.5} />
                {company.email}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
