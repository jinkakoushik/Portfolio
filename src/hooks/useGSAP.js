/**
 * useGSAP — minimal React hook for running GSAP animations with
 * automatic cleanup, scoped selector support, and SSR-safe effect
 * choice (useLayoutEffect on the client so entrance animations
 * run before first paint; useEffect during SSR).
 *
 * Usage:
 *   const scope = useGSAP(() => {
 *     gsap.from('.card', { opacity: 0, y: 40, stagger: 0.1 })
 *   }, { scope: sectionRef })
 *
 * Everything returned/created inside the callback is cleaned up
 * on unmount via a collected context (gsap.context).
 */
import { useLayoutEffect, useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * @param {(ctx: { gsap: typeof gsap, scope: HTMLElement | null }) => void} fn
 *        Animation setup. Runs once after mount. All gsap calls
 *        made through ctx.gsap inside here are auto-reverted.
 * @param {{ scope?: React.RefObject<HTMLElement>, dependencies?: unknown[] }} [options]
 *        scope — ref whose element limits selector text to its subtree
 *        dependencies — re-run the effect when these change (default [])
 */
export default function useGSAP(fn, options = {}) {
  const { scope, dependencies = [] } = options
  const internalRef = useRef(null)
  const scopeRef = scope ?? internalRef

  useIsomorphicLayoutEffect(() => {
    if (typeof fn !== 'function') return undefined

    const context = gsap.context(() => {
      fn({ gsap, scope: scopeRef.current })
    }, scopeRef)

    return () => context.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return scopeRef
}
