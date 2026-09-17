/**
 * Navbar — fixed glass bar with scroll state, active section
 * tracking, smooth anchor scrolling, and an animated mobile
 * drawer (circular clip-path reveal) that locks page scroll
 * while open.
 */
import { useEffect, useState } from 'react'
import { site } from '../data/site.js'
import { lenisScrollTo, stopScroll, startScroll } from '../lib/scroll'

const LINKS = [
  { label: 'Home', href: '#home', index: '01' },
  { label: 'About', href: '#about', index: '02' },
  { label: 'Skills', href: '#skills', index: '03' },
  { label: 'Projects', href: '#projects', index: '04' },
  { label: 'Contact', href: '#contact', index: '05' },
]

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState('home')

  // Glass background after leaving the hero
  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
        raf = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Track the section occupying the middle of the viewport
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Lock Lenis scroll while the drawer is open
  useEffect(() => {
    if (!open) return undefined
    stopScroll()
    return () => startScroll()
  }, [open])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    lenisScrollTo(href)
    onNavigate?.(href)
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Primary">
        <a
          href="#home"
          className="nav-logo"
          data-cursor
          onClick={(e) => go(e, '#home')}
        >
          <span className="logo-mark">{site.shortName}</span>
          <span className="logo-name">{site.name}</span>
        </a>

        {/* Desktop links */}
        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link ${activeId === link.href.slice(1) ? 'active' : ''}`}
                onClick={(e) => go(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          className={`nav-burger ${open ? 'open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        {LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            style={{ transitionDelay: open ? `${0.15 + i * 0.07}s` : '0s' }}
            tabIndex={open ? 0 : -1}
            onClick={(e) => go(e, link.href)}
          >
            <span className="drawer-index">{link.index}</span>
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
