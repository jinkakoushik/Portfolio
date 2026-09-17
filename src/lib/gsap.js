/**
 * ============================================================
 *  GSAP SETUP — single source of truth for the whole app
 * ============================================================
 *  Registers plugins once and exports the configured instance
 *  plus small environment helpers used across components.
 *  Import GSAP from here, never directly from 'gsap'.
 * ============================================================
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Sensible global defaults — individual tweens can always override
gsap.defaults({ ease: 'power3.out', duration: 0.9 })

/** Signature cinematic ease used across entrance animations */
export const EASE = 'power3.out'

/** True when the user prefers reduced motion */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** True on coarse-pointer (touch) devices — used to skip heavy effects */
export const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)

/** Conventional breakpoint for switching to the mobile layout in JS */
export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.innerWidth <= 920

export { gsap, ScrollTrigger }

/**
 * Standard scroll-triggered reveal for a set of elements.
 * Elements should start hidden (e.g. .u-fade-up resting state).
 * Uses ScrollTrigger.batch() so triggers are created in one pass.
 */
export function revealOnScroll(targets, opts = {}) {
  if (!targets || (targets.length !== undefined && targets.length === 0)) return null
  return ScrollTrigger.batch(targets, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: EASE,
        stagger: 0.09,
        overwrite: true,
      }),
    ...opts,
  })
}

/**
 * Split an element's text into word spans for cinematic reveals.
 * Mutates the element's children; returns the inner word spans.
 */
export function splitWords(el) {
  if (!el) return []
  const words = el.textContent.trim().split(/\s+/)
  el.innerHTML = words
    .map((w) => `<span class="word"><span>${w}</span></span>`)
    .join(' ')
  return Array.from(el.querySelectorAll('.word > span'))
}

/**
 * Split an element's text into letter spans for glitch-style reveals.
 */
export function splitChars(el) {
  if (!el) return []
  const text = el.textContent
  el.innerHTML = text
    .split('')
    .map((c) => `<span class="char">${c === ' ' ? '&nbsp;' : c}</span>`)
    .join('')
  return Array.from(el.querySelectorAll('.char'))
}
