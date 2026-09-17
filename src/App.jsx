/**
 * App — orchestrates the experience:
 *   Preloader → (curtain opens) → Hero entrance → sections.
 * Owns the single Lenis instance; global cursor + web canvas live
 * here so they overlay everything.
 */
import { useCallback, useEffect, useState } from 'react'
import Preloader from './components/Preloader.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import WebEffects from './components/WebEffects.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { useLenis } from './hooks/index.js'
import { ScrollTrigger } from './lib/gsap'

export default function App() {
  const [heroStarted, setHeroStarted] = useState(false)
  const { scrollTo, stop, start } = useLenis()

  // Lock scroll while the preloader plays
  useEffect(() => {
    stop()
    return () => start()
  }, [stop, start])

  // Mark the root as ready → fades .page-shell in over the boot bg
  useEffect(() => {
    document.getElementById('root')?.classList.add('app-ready')
  }, [])

  // Recalculate scroll triggers once fonts/images settle
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    if (document.readyState === 'complete') {
      const t = setTimeout(refresh, 400)
      return () => clearTimeout(t)
    }
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  // Preloader signals the moment the curtain starts opening
  const handlePreloaderDone = useCallback(() => {
    setHeroStarted(true)
    start()
  }, [start])

  return (
    <>
      {/* Preloader manages its own unmount (returns null when done) */}
      <Preloader onDone={handlePreloaderDone} />

      <CustomCursor />
      <WebEffects />

      <div className="page-shell">
        <div className="backdrop" aria-hidden="true" />

        <Navbar onNavigate={scrollTo} />

        <main>
          <Hero started={heroStarted} />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  )
}
