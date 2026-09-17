/**
 * WebEffects — one fixed, GPU-friendly canvas behind the whole page.
 *
 * Drifting dust particles (white + red) that link themselves with
 * faint web lines when close together, with a gentle attraction to
 * the cursor. Runs a single requestAnimationFrame loop, caps DPR at
 * 2, and switches itself off entirely on touch devices and for
 * reduced-motion users.
 */
import { useEffect, useRef } from 'react'
import { isTouchDevice, prefersReducedMotion } from '../lib/gsap'

const PARTICLE_COUNT_DESKTOP = 64
const LINK_DIST = 110
const CURSOR_ATTRACT_DIST = 190

export default function WebEffects() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = window.innerWidth
    let h = window.innerHeight
    let rafId = null
    let running = true

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const particles = Array.from({ length: PARTICLE_COUNT_DESKTOP }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: 0.8 + Math.random() * 1.7,
      red: Math.random() < 0.35,
      tw: Math.random() * Math.PI * 2, // twinkle phase
      twSpeed: 0.008 + Math.random() * 0.02,
    }))

    const mouse = { x: w / 2, y: h / 2, active: false }
    const onMouse = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    const onLeave = () => {
      mouse.active = false
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    // Pause the loop when the tab is hidden — saves battery/CPU
    const onVisibility = () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = null
      } else if (running && !rafId) {
        rafId = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    let lastSpawn = 0
    const spawnBurst = (ts) => {
      // occasional red spark near cursor for the "web-slinging" feel
      if (!mouse.active || ts - lastSpawn < 280) return
      lastSpawn = ts
      const p = particles[Math.floor(Math.random() * particles.length)]
      p.x = mouse.x + (Math.random() - 0.5) * 40
      p.y = mouse.y + (Math.random() - 0.5) * 40
      p.red = true
      p.r = 1.4 + Math.random() * 1.2
    }

    const loop = (ts) => {
      ctx.clearRect(0, 0, w, h)

      // update
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.tw += p.twSpeed

        // gentle cursor attraction
        if (mouse.active) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.hypot(dx, dy)
          if (dist < CURSOR_ATTRACT_DIST && dist > 1) {
            const f = ((CURSOR_ATTRACT_DIST - dist) / CURSOR_ATTRACT_DIST) * 0.012
            p.vx += (dx / dist) * f
            p.vy += (dy / dist) * f
          }
        }

        // friction keeps drift calm
        p.vx *= 0.995
        p.vy *= 0.995
        // keep a minimum drift so particles never fully stall
        if (Math.abs(p.vx) < 0.02) p.vx += (Math.random() - 0.5) * 0.01
        if (Math.abs(p.vy) < 0.02) p.vy += (Math.random() - 0.5) * 0.01

        // wrap around edges
        if (p.x < -10) p.x = w + 10
        else if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        else if (p.y > h + 10) p.y = -10
      }

      // web links
      ctx.lineWidth = 0.6
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (Math.abs(dx) > LINK_DIST || Math.abs(dy) > LINK_DIST) continue
          const dist = Math.hypot(dx, dy)
          if (dist > LINK_DIST) continue
          const nearCursor =
            mouse.active &&
            Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) < 220
          const alpha = (1 - dist / LINK_DIST) * (nearCursor ? 0.34 : 0.13)
          ctx.strokeStyle = nearCursor
            ? `rgba(230,36,41,${alpha.toFixed(3)})`
            : `rgba(255,255,255,${alpha.toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      // draw particles
      for (const p of particles) {
        const twinkle = 0.55 + 0.45 * Math.sin(p.tw)
        const alpha = (p.red ? 0.85 : 0.5) * twinkle
        ctx.fillStyle = p.red
          ? `rgba(230,36,41,${alpha.toFixed(3)})`
          : `rgba(255,255,255,${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      spawnBurst(ts)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      running = false
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  if (typeof window !== 'undefined' && (isTouchDevice() || prefersReducedMotion())) {
    return null
  }

  return <canvas ref={canvasRef} id="web-canvas" aria-hidden="true" />
}
