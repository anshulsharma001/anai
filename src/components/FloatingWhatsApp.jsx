import { whatsappEnquiryLink } from '../lib/enquiry'
import WhatsAppIcon from './WhatsAppIcon'

/** Always-visible WhatsApp shortcut in the bottom-right corner. */
export default function FloatingWhatsApp() {
  return (
    <a
      {...whatsappEnquiryLink()}
      aria-label="Chat with Anai on WhatsApp"
      className="wa-float group fixed bottom-4 right-4 z-40 flex items-center gap-3 md:bottom-6 md:right-6"
    >
      <span className="pointer-events-none hidden rounded-full bg-cream px-4 py-2 text-sm font-medium text-brown shadow-[0_10px_30px_-12px_rgb(42_23_10/0.5)] ring-1 ring-brown/10 transition-opacity duration-300 md:block md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        Chat on WhatsApp
      </span>
      <span className="wa-float-button relative grid size-14 place-items-center rounded-full bg-wa text-white shadow-[0_12px_28px_-8px_rgb(20_70_40/0.6)] transition-transform duration-300 group-hover:scale-105">
        <WhatsAppIcon className="size-7" />
      </span>
    </a>
  )
}
