import { useEffect } from 'react'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import ProductDetails from './components/ProductDetails'
import ScrollProgress from './components/ScrollProgress'
import SiteProvider from './context/SiteProvider'
import { WHATSAPP_NOTE_ID } from './lib/enquiry'
import { ScrollTrigger } from './lib/gsap'
import { introDone } from './lib/intro'
import { scrollToId } from './lib/scroll'
import { startSmoothScroll } from './lib/smooth'
import BulkOrders from './sections/BulkOrders'
import ChaiInterlude from './sections/ChaiInterlude'
import Collections from './sections/Collections'
import Contact from './sections/Contact'
import Faq from './sections/Faq'
import Gifting from './sections/Gifting'
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import WhyAnai from './sections/WhyAnai'

export default function App() {
  useEffect(() => {
    const stopSmoothScroll = startSmoothScroll()

    // Route every in-page link through the smooth scroller; focus targets that accept it (e.g. the skip link).
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const link = event.target.closest?.('a[href^="#"]')
      const id = link?.getAttribute('href').slice(1)
      const target = id && document.getElementById(id)
      if (!target) return
      event.preventDefault()
      scrollToId(id)
      if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true })
    }
    document.addEventListener('click', onClick)

    // Recalculate scroll positions once images and fonts settle, then honour any deep link after the intro.
    const settle = () => ScrollTrigger.refresh()
    if (document.readyState === 'complete') settle()
    else window.addEventListener('load', settle, { once: true })
    document.fonts?.ready.then(settle)
    introDone.then(() => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (id && id !== 'home') scrollToId(id)
    })

    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('load', settle)
      stopSmoothScroll()
    }
  }, [])

  return (
    <SiteProvider>
      <a
        href="#main"
        className="sr-only z-[110] bg-brown px-5 py-3 text-sm text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Collections />
        <ChaiInterlude />
        <Gifting />
        <WhyAnai />
        <Manifesto />
        <BulkOrders />
        <Contact />
        <Faq />
      </main>
      <Footer />
      <ProductDetails />
      <FloatingWhatsApp />
      <p id={WHATSAPP_NOTE_ID} hidden>
        Opens WhatsApp in a new tab
      </p>
    </SiteProvider>
  )
}
