/**
 * useMagnetic — reusable magnetic hover effect.
 *
 * Attach the returned ref to any element; it will subtly lean toward
 * the cursor while hovered and spring back with an elastic ease on
 * leave. Pull strength can be tuned per element via data-strength.
 * Disabled on touch devices and for reduced-motion users.
 *
 * Usage:  const ref = useMagnetic()
 *         <button ref={ref} data-strength="0.4">…</button>
 */
import { useRef, useEffect } from 'react'
import { gsap, isTouchDevice, prefersReducedMotion } from '../lib/gsap'

export default function useMagnetic({ strength = 0.35 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isTouchDevice() || prefersReducedMotion()) return undefined

    const pull = parseFloat(el.dataset.strength) || strength
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      xTo(dx * pull)
      yTo(dy * pull)
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [strength])

  return ref
}
