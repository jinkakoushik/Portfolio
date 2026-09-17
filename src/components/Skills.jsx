/**
 * Skills — "MY WEB SHOOTERS".
 * Four category cards that tilt toward the cursor, glow where the
 * cursor is, and reveal with a stagger. Data-driven from skills.js.
 */
import { useRef } from 'react'
import { skillGroups } from '../data/skills.js'
import { gsap, isTouchDevice, prefersReducedMotion } from '../lib/gsap'
import useGSAP from '../hooks/useGSAP'

/* original minimal web icon (not from any icon set) */
function WebIcon() {
  return (
    <svg className="skill-web" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="12" cy="12" r="9.2" opacity="0.55" />
      <path d="M12 2.8v18.4M2.8 12h18.4M5.5 5.5l13 13M18.5 5.5l-13 13" opacity="0.7" />
      <path d="M12 6.2c-3 .8-5 2.8-5.8 5.8M12 6.2c3 .8 5 2.8 5.8 5.8M6.2 12c.8 3 2.8 5 5.8 5.8M17.8 12c-.8 3-2.8 5-5.8 5.8" />
    </svg>
  )
}

export default function Skills() {
  const rootRef = useGSAP(
    ({ gsap: g, scope }) => {
      g.from(scope.querySelectorAll('.skill-card'), {
        opacity: 0,
        y: 48,
        scale: 0.97,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: scope.querySelector('.skills-grid'), start: 'top 80%', once: true },
      })
    },
    {}
  )

  const cardRefs = useRef([])

  // Cursor-tracking tilt + glow (desktop only)
  const handleMove = (e, index) => {
    if (isTouchDevice() || prefersReducedMotion()) return
    const card = cardRefs.current[index]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    card.style.setProperty('--mx', `${px * 100}%`)
    card.style.setProperty('--my', `${py * 100}%`)
    card.style.setProperty('--tilt-x', `${(0.5 - py) * 5}deg`)
    card.style.setProperty('--tilt-y', `${(px - 0.5) * 5}deg`)
  }

  const handleLeave = (index) => {
    const card = cardRefs.current[index]
    if (!card) return
    card.style.setProperty('--tilt-x', '0deg')
    card.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <section id="skills" className="section" ref={rootRef}>
      <div className="container">
        <div className="section-head">
          <p className="section-eyebrow">Chapter 02 — Arsenal</p>
          <h2 className="section-title">
            MY WEB <span className="red">SHOOTERS</span>
          </h2>
          <p className="section-sub">
            The tools I reach for when building products end to end.
          </p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <article
              key={group.id}
              className="skill-card"
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              onMouseMove={(e) => handleMove(e, i)}
              onMouseLeave={() => handleLeave(i)}
            >
              <WebIcon />
              <div className="skill-head">
                <h3 className="skill-title">{group.title}</h3>
                <span className="skill-code">{group.code}</span>
              </div>
              <ul className="skill-list">
                {group.items.map((item) => (
                  <li className="skill-item" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
