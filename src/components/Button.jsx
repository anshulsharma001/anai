import { ArrowRight } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'

/**
 * Renders a link when `href` is given, otherwise a button. Pass icon={null} to drop the arrow.
 * `whatsapp` leads with the WhatsApp logo instead.
 */
export default function Button({
  href,
  variant = 'primary',
  size,
  icon: Icon = ArrowRight,
  whatsapp = false,
  className = '',
  children,
  ...props
}) {
  const classes = ['btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className].filter(Boolean).join(' ')
  const content = whatsapp ? (
    <>
      <WhatsAppIcon badge className="size-5 flex-none" />
      <span>{children}</span>
    </>
  ) : (
    <>
      <span>{children}</span>
      {Icon ? <Icon aria-hidden="true" strokeWidth={1.5} className="btn-icon size-4 flex-none" /> : null}
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}
