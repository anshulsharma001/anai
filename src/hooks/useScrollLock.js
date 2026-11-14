import { useEffect } from 'react'
import { getLenis } from '../lib/smooth'

let locks = 0

/** Prevent page scrolling while an overlay (menu, dialog, preloader) is open. */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    locks += 1
    document.documentElement.classList.add('is-locked')
    getLenis()?.stop()
    return () => {
      locks -= 1
      if (locks === 0) {
        document.documentElement.classList.remove('is-locked')
        getLenis()?.start()
      }
    }
  }, [active])
}
