import { useRef, useState } from 'react'
import { Copy, PencilLine } from 'lucide-react'
import { company, enquiryTypes } from '../data/brand'
import { emptyEnquiry, enquiryText, enquiryWhatsApp, validateEnquiry, WHATSAPP_NOTE_ID } from '../lib/enquiry'
import WhatsAppIcon from './WhatsAppIcon'

const FIELD_ORDER = ['name', 'phone', 'enquiryType', 'message']
const FIELD_LABELS = {
  name: 'Name',
  phone: 'Phone number',
  enquiryType: 'Enquiry type',
  message: 'Message',
}

export default function EnquiryForm() {
  const [values, setValues] = useState(emptyEnquiry)
  const [touched, setTouched] = useState({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState('editing')
  const [copyState, setCopyState] = useState(null)
  const summaryRef = useRef(null)
  const handoffRef = useRef(null)

  const errors = validateEnquiry(values)
  const errorList = FIELD_ORDER.filter((field) => errors[field])
  const visibleError = (field) => (attempted || touched[field] ? errors[field] : undefined)

  const set = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))
  const markTouched = (field) => () => setTouched((current) => ({ ...current, [field]: true }))

  const fieldProps = (field) => {
    const error = visibleError(field)
    return {
      id: `enquiry-${field}`,
      name: field,
      value: values[field],
      onChange: set(field),
      onBlur: markTouched(field),
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `enquiry-${field}-error` : undefined,
      className: 'field-input',
    }
  }

  // Opening WhatsApp inside the submit handler keeps it tied to the visitor's click,
  // so browsers treat it as user-initiated rather than a pop-up.
  const onSubmit = (event) => {
    event.preventDefault()
    setAttempted(true)
    if (errorList.length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    window.open(enquiryWhatsApp(values), '_blank', 'noopener,noreferrer')
    setCopyState(null)
    setStatus('handoff')
    requestAnimationFrame(() => handoffRef.current?.focus())
  }

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(enquiryText(values))
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  const startOver = () => {
    setValues(emptyEnquiry)
    setTouched({})
    setAttempted(false)
    setCopyState(null)
    setStatus('editing')
  }

  if (status === 'handoff') {
    return (
      <div ref={handoffRef} tabIndex={-1} aria-labelledby="handoff-title" className="outline-none">
        <p className="eyebrow text-amber-ink">Almost done</p>
        <h3 id="handoff-title" className="display-title mt-4 text-brown">
          Finish sending on WhatsApp
        </h3>
        <p className="body-copy mt-5 text-brown-soft">
          WhatsApp should now be open in a new tab with your enquiry addressed to{' '}
          <span className="whitespace-nowrap">{company.phoneDisplay}</span>. It is only sent when you press send in
          WhatsApp. If it did not open, use the button below.
        </p>

        <div className="mt-8 border border-brown/15 bg-cream-deep/60">
          <p className="border-b border-brown/15 px-5 py-3 text-[0.66rem] font-medium uppercase tracking-[0.22em] text-brown-soft">
            Your enquiry
          </p>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words px-5 py-4 font-sans text-[0.92rem] leading-relaxed text-brown">
            {enquiryText(values)}
          </pre>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={enquiryWhatsApp(values)}
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby={WHATSAPP_NOTE_ID}
            className="btn btn-primary"
          >
            <WhatsAppIcon badge className="size-5" />
            <span>Open WhatsApp</span>
          </a>
        </div>
        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
          <button
            type="button"
            onClick={copyText}
            className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-brown"
          >
            <Copy aria-hidden="true" className="size-4" strokeWidth={1.5} />
            <span className="link-underline">Copy enquiry text</span>
          </button>
          <button
            type="button"
            onClick={() => setStatus('editing')}
            className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-brown"
          >
            <PencilLine aria-hidden="true" className="size-4" strokeWidth={1.5} />
            <span className="link-underline">Edit enquiry</span>
          </button>
          <button
            type="button"
            onClick={startOver}
            className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-brown-soft"
          >
            <span className="link-underline">Start over</span>
          </button>
        </div>

        <p role="status" className="mt-6 min-h-6 text-[0.95rem] leading-relaxed text-olive-ink">
          {copyState === 'copied'
            ? `Enquiry copied. Paste it into a WhatsApp message to ${company.phoneDisplay}.`
            : copyState === 'failed'
              ? 'We could not copy automatically — please select the enquiry text above and copy it.'
              : ''}
        </p>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="enquiry-title">
      <p className="eyebrow text-amber-ink">Quick enquiry · On WhatsApp</p>
      <h3 id="enquiry-title" className="display-title mt-4 text-brown">
        Tell us what you need
      </h3>
      <p className="mt-3 text-sm text-brown-soft">
        We will open WhatsApp with your enquiry ready to send. Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      {attempted && errorList.length ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="enquiry-error-title"
          className="mt-6 border-l-2 border-[#a1361b] bg-[#a1361b]/8 px-4 py-4 outline-none"
        >
          <p id="enquiry-error-title" className="font-medium text-[#8a2e16]">
            Please check {errorList.length === 1 ? 'this field' : `these ${errorList.length} fields`}:
          </p>
          <ul className="mt-2 list-disc pl-5 text-[0.95rem] text-[#8a2e16]">
            {errorList.map((field) => (
              <li key={field}>
                <a href={`#enquiry-${field}`} className="underline underline-offset-2">
                  {FIELD_LABELS[field]}: {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <label htmlFor="enquiry-name" className="field-label">
            Name <span aria-hidden="true">*</span>
          </label>
          <input {...fieldProps('name')} type="text" autoComplete="name" required placeholder="Your name" />
          {visibleError('name') ? (
            <p id="enquiry-name-error" className="field-error">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="enquiry-phone" className="field-label">
            Phone / WhatsApp <span aria-hidden="true">*</span>
          </label>
          <input
            {...fieldProps('phone')}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            placeholder="+91 98765 43210"
          />
          {visibleError('phone') ? (
            <p id="enquiry-phone-error" className="field-error">
              {errors.phone}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="enquiry-enquiryType" className="field-label">
            Enquiry type <span aria-hidden="true">*</span>
          </label>
          <select {...fieldProps('enquiryType')} required className="field-input field-select">
            <option value="">Choose one</option>
            {enquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {visibleError('enquiryType') ? (
            <p id="enquiry-enquiryType-error" className="field-error">
              {errors.enquiryType}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="enquiry-quantity" className="field-label">
            Quantity or budget
          </label>
          <input {...fieldProps('quantity')} type="text" placeholder="Optional — e.g. 50 jars, 200 gift boxes" />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="enquiry-message" className="field-label">
          Message
        </label>
        <textarea
          {...fieldProps('message')}
          rows={2}
          maxLength={1000}
          placeholder="Optional — products, occasion, delivery city"
          className="field-input resize-y"
        />
        {visibleError('message') ? (
          <p id="enquiry-message-error" className="field-error">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="mt-7 flex flex-col gap-4 border-t border-brown/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-sm leading-relaxed text-brown-soft">
          Nothing is sent until you press send in WhatsApp.
        </p>
        <button type="submit" aria-describedby={WHATSAPP_NOTE_ID} className="btn btn-primary flex-none">
          <WhatsAppIcon badge className="size-5" />
          <span>Continue on WhatsApp</span>
        </button>
      </div>
    </form>
  )
}
