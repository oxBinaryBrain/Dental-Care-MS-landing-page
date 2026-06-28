import { useLayoutEffect } from 'react'

// Safely lock body scroll when a modal/overlay is open.
// Uses both overflow:hidden AND position:fixed to avoid iOS Safari bounce bugs.
export function useLockBodyScroll(locked: boolean) {
  useLayoutEffect(() => {
    if (!locked) return
    const html = document.documentElement
    const body = document.body
    const scrollY = window.scrollY

    html.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'

    return () => {
      html.style.overflow = ''
      body.style.position = ''
      body.style.top = ''
      body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}
