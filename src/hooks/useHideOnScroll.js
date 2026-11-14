import { useEffect, useState } from 'react'

/** True while the visitor is scrolling down past `offset`; false as soon as they scroll back up. */
export function useHideOnScroll(offset = 240) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      if (Math.abs(y - last) < 8) return
      setHidden(y > last && y > offset)
      last = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [offset])

  return hidden
}
