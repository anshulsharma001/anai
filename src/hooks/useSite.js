import { useContext } from 'react'
import { SiteContext } from '../context/siteContext'

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) throw new Error('useSite must be used inside <SiteProvider>')
  return context
}
