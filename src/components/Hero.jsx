/**
 * Hero — full-screen cinematic opener.
 * GSAP entrance: masked word reveals on the name, stroke-text role,
 * tagline, then CTAs and scroll cue. The spider sigil tilts in 3D
 * toward the cursor and the copy drifts on the opposite axis for
 * layered parallax.
 */
import { useEffect, useRef } from 'react'
import { ArrowRight, Download, ArrowDown } from 'lucide-react'
import { site } from '../data/site.js'
import { gsap, splitWords, isTouchDevice, prefersReducedMotion } from '../lib/gsap'
import { lenisScrollTo } from '../lib/scroll'
import useGSAP from '../hooks/useGSAP'
import useMagnetic from '../hooks/useMagnetic'

// Reusable magnetic refs for the two CTAs
function MagneticButton({ as: Tag = 'button', className, children, ...rest }) {
  const ref = useMagnetic()
  return (
    <Tag ref={ref} className={className} data-cursor {...rest}>
      {children}
    </Tag>
  )
}

export default function Hero({ started = true }) {
  const rootRef = useRef(null)
  const sigilRef = useRef(null)
  const copyRef = useRef(null)

  // ---------- Cinematic entrance ----------
  useGSAP(
    ({ gsap: g, scope }) => {
      if (!started) return
      if (prefersReducedMotion()) {
        g.set(scope.querySelectorAll('[data-hero-anim]'), { opacity: 1, y: 0 })
        return
      }

      const tl = g.timeline({ defaults: { ease: 'power3.out' } })

      // Name: words rise out of overflow-hidden masks
      const nameEl = scope.querySelector('.hero-name')
      if (nameEl) {
        const words = splitWords(nameEl)
        tl.fromTo(
          words,
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'power4.out' },
          0.15
        )
      }

      // Role: stroke text flickers in like a badge lighting up
      tl.fromTo(
        '.hero-role',
        { opacity: 0, x: -26 },
        { opacity: 1, x: 0, duration: 0.7 },
        0.55
      )
        // Tagline drifts up
        .fromTo(
          '.hero-tagline',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.75
        )
        // CTAs pop with a slight overshoot
        .fromTo(
          '.hero-actions > *',
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.6)' },
          0.95
        )
        // Sigil scales in with glow bloom
        .fromTo(
          '.spider-sigil',
          { opacity: 0, scale: 0.82, rotationY: -18 },
          { opacity: 1, scale: 1, rotationY: 0, duration: 1.2, ease: 'power4.out' },
          0.45
        )
        // Corner meta + scroll cue last
        .fromTo(
          ['.hero-meta', '.hero-scroll'],
          { opacity: 0 },
          { opacity: 1, duration: 0.8, stagger: 0.08 },
          1.35
        )
    },
    { scope: rootRef, dependencies: [started] }
  )

  // ---------- Mouse parallax (rAF-smoothed, desktop only) ----------
  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return undefined
    const root = rootRef.current
    if (!root) return undefined

    const state = { tx: 0, ty: 0, cx: 0, cy: 0 }
    let rafId

    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      state.tx = nx
      state.ty = ny
    }

    const loop = () => {
      state.cx += (state.tx - state.cx) * 0.06
      state.cy += (state.ty - state.cy) * 0.06

      // Sigil tilts in 3D toward the cursor
      gsap.set(sigilRef.current, {
        rotationY: state.cx * 14,
        rotationX: -state.cy * 10,
        x: state.cx * 18,
        y: state.cy * 12,
      })
      // Copy drifts the opposite way — depth
      gsap.set(copyRef.current, { x: state.cx * -12, y: state.cy * -8 })
      // Eyebrow + meta counter-drift slightly
      gsap.set('.hero-eyebrow', { x: state.cx * 8 })

      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // ---------- Hero content exits on scroll (cinematic depth) ----------
  useGSAP(
    ({ gsap: g }) => {
      g.to('.hero-inner', {
        opacity: 0.25,
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: rootRef }
  )

  return (
    <section id="home" className="hero" ref={rootRef}>
      {/* frame meta */}
      <div className="hero-meta tl" data-hero-anim>
        PORTFOLIO — 2026
      </div>
      <div className="hero-meta tr" data-hero-anim>
        [ {site.shortName} ] // FULL STACK
      </div>

      <div className="container hero-inner">
        {/* ---------------- copy ---------------- */}
        <div className="hero-copy" ref={copyRef}>
          <p className="hero-eyebrow" data-hero-anim>
            <span className="dot" />
            {site.role} — Open to opportunities
          </p>

          <h1 className="hero-name display" data-hero-anim>
            {site.name}
          </h1>

          <div className="hero-role" data-hero-anim>
            <span className="hero-role-text">{site.role.toUpperCase()}</span>
            <span className="hero-role-line" aria-hidden="true" />
          </div>

          <p className="hero-tagline" data-hero-anim>
            {site.tagline}
          </p>

          <div className="hero-actions" data-hero-anim>
            <MagneticButton
              className="btn btn-primary"
              onClick={() => lenisScrollTo('#projects')}
            >
              Explore Projects
              <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton
              as="a"
              href={site.resumeUrl}
              download
              className="btn btn-ghost"
            >
              <Download size={16} />
              Download Resume
            </MagneticButton>
          </div>
        </div>

        {/* ---------------- spider sigil ---------------- */}
        <div className="hero-visual" aria-hidden="true">
          <div className="spider-sigil" ref={sigilRef}>
            <div className="sigil-glow" />
            <div className="sigil-ring" />
            <div className="sigil-ring sigil-ring-2" />
            <div className="sigil-orbit" />

            <div className="sigil-core">
              {/* original minimal spider mark */}
              <svg
                className="sigil-spider"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <ellipse cx="12" cy="10" rx="2.4" ry="3.6" />
                <path d="M12 13.6v5" />
                <path d="M10.5 18.5 9 21M13.5 18.5 15 21" />
                <path d="M9.8 8.5C7.5 7.2 5.8 5 5 2.5M14.2 8.5c2.3-1.3 4-3.5 4.8-6" />
                <path d="M9.6 10.5C6.8 10 4.4 8.4 2.8 6M14.4 10.5c2.8-.5 5.2-2.1 6.8-4.5" />
                <path d="M9.8 12.5C7.4 13.4 5.5 15.2 4.2 17.8M14.2 12.5c2.4.9 4.3 2.7 5.6 5.3" />
              </svg>
            </div>

            {/* radial web threads */}
            <div className="sigil-threads">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="sigil-thread"
                  style={{ transform: `rotate(${i * 45}deg)` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <button
        type="button"
        className="hero-scroll"
        data-hero-anim
        onClick={() => lenisScrollTo('#about')}
        aria-label="Scroll to about section"
      >
        <span className="hero-scroll-label">
          Scroll to explore
          <ArrowDown size={12} />
        </span>
        <span className="hero-scroll-line" />
      </button>
    </section>
  )
}
