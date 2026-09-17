/**
 * useLenis — React integration for Lenis smooth scrolling.
 *
 * Creates exactly one Lenis instance while mounted, drives it with a
 * requestAnimationFrame loop (destroying it cleanly on unmount to
 * prevent memory leaks), and exposes helpers:
 *
 *   - lenisRef   → the live instance (or null)
 *   - scrollTo() → smooth-scroll to a selector, element, or y-offset
 */
import { useRef, useEffect, useCallback } from 'react'
import Lenis from 'lenis'
import { prefersReducedMotion } from '../lib/gsap'
import { registerLenis } from '../lib/scroll'

export default function useLenis() {
  const lenisRef = useRef(null)
  const rafIdRef = useRef(null)

  useEffect(() => {
    // Respect user motion preferences — native scroll wins
    if (prefersReducedMotion()) return undefined

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    registerLenis(lenis)

    // Explicit rAF loop — no external ticker dependency
    const raf = (time) => {
      lenis.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }
    rafIdRef.current = requestAnimationFrame(raf)

    // Lenis needs to recalculate its bounds on resize
    const onResize = () => lenis.resize()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      lenis.destroy()
      lenisRef.current = null
      registerLenis(null)
    }
  }, [])

  /** Smooth-scroll to a CSS selector, element, or pixel offset */
  const scrollTo = useCallback((target, opts = {}) => {
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(target, { offset: -70, duration: 1.4, ...opts })
    } else {
      // Graceful fallback (reduced motion / unsupported)
      const el = typeof target === 'string' ? document.querySelector(target) : target
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' })
      } else {
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [])

  /** Pause scrolling (e.g. while the mobile menu is open) */
  const stop = useCallback(() => lenisRef.current?.stop(), [])
  const start = useCallback(() => lenisRef.current?.start(), [])

  return { lenisRef, scrollTo, stop, start }
}
