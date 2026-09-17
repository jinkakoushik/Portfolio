/**
 * Preloader — cinematic boot sequence.
 * Spider sigil descends on its thread, a percentage counts up, then
 * the whole screen splits open like a curtain to reveal the site.
 * The count is cosmetic (assets are tiny), so it runs on a snappy
 * 1.4s tween rather than real network progress.
 */
import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

export default function Preloader({ onDone }) {
  const rootRef = useRef(null)
  const spiderRef = useRef(null)
  const countRef = useRef(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const counter = { v: 0 }
    const tl = gsap.timeline()

    if (prefersReducedMotion()) {
      // Skip straight through for reduced-motion users
      onDone?.()
      const t = setTimeout(() => setGone(true), 60)
      return () => clearTimeout(t)
    }

    // Thread lowers the spider
    tl.fromTo(
      spiderRef.current,
      { yPercent: -160, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }
    )
      // Percentage counts up
      .to(
        counter,
        {
          v: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = `${Math.round(counter.v)}%`
            }
          },
        },
        '-=0.4'
      )
      // Brief hold at 100%, spider zips back up
      .to(spiderRef.current, { yPercent: -120, duration: 0.5, ease: 'power2.in' }, '+=0.15')
      // Signal App to start the hero entrance as the curtain begins opening
      .call(() => onDone?.())
      // Curtain split
      .to(
        root.querySelectorAll('.preloader-panel'),
        { scaleY: 0, duration: 0.9, ease: 'power4.inOut', stagger: 0.08 },
        '-=0.05'
      )
      // Fade the inner content, then unmount
      .to(root.querySelector('.preloader-inner'), { opacity: 0, duration: 0.4 }, '<')
      .call(() => setGone(true))

    return () => tl.kill()
  }, [onDone])

  if (gone) return null

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      {/* Split curtain panels */}
      <div className="preloader-panel preloader-panel-top" />
      <div className="preloader-panel preloader-panel-bottom" />

      <div className="preloader-inner">
        {/* thread */}
        <div className="preloader-thread" aria-hidden="true" />
        <svg
          ref={spiderRef}
          className="preloader-spider"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {/* Spider-Man–inspired minimal spider mark (original drawing) */}
          <ellipse cx="12" cy="10" rx="2.4" ry="3.6" />
          <path d="M12 13.6v5" />
          <path d="M10.5 18.5 9 21M13.5 18.5 15 21" />
          <path d="M9.8 8.5C7.5 7.2 5.8 5 5 2.5M14.2 8.5c2.3-1.3 4-3.5 4.8-6" />
          <path d="M9.6 10.5C6.8 10 4.4 8.4 2.8 6M14.4 10.5c2.8-.5 5.2-2.1 6.8-4.5" />
          <path d="M9.8 12.5C7.4 13.4 5.5 15.2 4.2 17.8M14.2 12.5c2.4.9 4.3 2.7 5.6 5.3" />
        </svg>
        <div ref={countRef} className="preloader-count">
          0%
        </div>
        <div className="preloader-text">Entering the web</div>
      </div>
    </div>
  )
}
