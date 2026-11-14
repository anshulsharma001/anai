import { useCallback, useMemo, useState } from 'react'
import { categories } from '../data/products'
import { CHAPTER_EVENT } from '../lib/scroll'
import { SiteContext } from './siteContext'

export default function SiteProvider({ children }) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [productId, setProductId] = useState(null)

  // `scroll` asks the collection gallery to bring that chapter into view.
  const selectCategory = useCallback((id, { scroll = false } = {}) => {
    setActiveCategory(id)
    if (scroll) window.dispatchEvent(new CustomEvent(CHAPTER_EVENT, { detail: id }))
  }, [])

  const openProduct = useCallback((id) => setProductId(id), [])
  const closeProduct = useCallback(() => setProductId(null), [])

  const value = useMemo(
    () => ({ activeCategory, selectCategory, productId, openProduct, closeProduct }),
    [activeCategory, selectCategory, productId, openProduct, closeProduct],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
