/**
 * CustomCursor — desktop-only two-part cursor.
 * Small red dot tracks instantly; a larger ring trails behind with
 * smoothing. Expands + tints red over interactive elements via
 * delegated mouseover/mouseout (works for dynamically added nodes).
 */
import { useEffect, useRef } from 'react'
import { gsap, isTouchDevice, prefersReducedMotion } from '../lib/gsap'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, [data-cursor]'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return undefined
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return undefined

    document.documentElement.classList.add('cursor-fine')

    // Position immediately at center so the first frame isn't at 0,0
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 3 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    let visible = true

    const onMove = (e) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { opacity: 1, duration: 0.25 })
      }
    }

    const onOver = (e) => {
      if (e.target.closest?.(INTERACTIVE)) {
        ring.classList.add('is-hover')
      }
    }
    const onOut = (e) => {
      if (e.target.closest?.(INTERACTIVE)) {
        ring.classList.remove('is-hover')
      }
    }
    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.2 })
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.35, ease: 'back.out(2)' })

    const onLeaveWindow = () => {
      visible = false
      gsap.to([dot, ring], { opacity: 0, duration: 0.25 })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)

    return () => {
      document.documentElement.classList.remove('cursor-fine')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
    }
  }, [])

  // Never rendered on touch / reduced motion
  if (typeof window !== 'undefined' && (isTouchDevice() || prefersReducedMotion())) {
    return null
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
