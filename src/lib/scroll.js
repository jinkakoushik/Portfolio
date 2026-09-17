/**
 * scroll.js — tiny bridge between the Lenis instance owned by
 * useLenis() and the rest of the app. Components import these
 * helpers instead of prop-drilling the scroll function.
 */
let lenisInstance = null

/** Called internally by useLenis when the instance is created/destroyed */
export function registerLenis(instance) {
  lenisInstance = instance
}

/** Smooth-scroll to a selector, element, or pixel offset */
export function lenisScrollTo(target, opts = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -70, duration: 1.4, ...opts })
    return
  }
  // Graceful fallback when Lenis isn't active
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/** Pause / resume page scroll (mobile menu, preloader) */
export function stopScroll() {
  lenisInstance?.stop()
}

export function startScroll() {
  lenisInstance?.start()
}
