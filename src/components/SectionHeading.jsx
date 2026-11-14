export default function SectionHeading({ id, eyebrow, title, intro, tone = 'light', className = '' }) {
  const dark = tone === 'dark'
  return (
    <div className={className}>
      {eyebrow ? (
        <p data-reveal="up" className={`eyebrow eyebrow-rule ${dark ? 'text-amber-soft' : 'text-amber-ink'}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} data-reveal="up" className="display-section mt-6">
        {title}
      </h2>
      {intro ? (
        <p data-reveal="up" className={`lede mt-6 max-w-2xl ${dark ? 'text-sand' : 'text-brown-soft'}`}>
          {intro}
        </p>
      ) : null}
    </div>
  )
}
