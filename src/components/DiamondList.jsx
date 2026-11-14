export default function DiamondList({ items, className = '', itemClassName = '' }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item} className={`flex gap-3.5 ${itemClassName}`}>
          <span aria-hidden="true" className="diamond" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
