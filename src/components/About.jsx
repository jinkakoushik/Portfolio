/**
 * About — "BEHIND THE CODE".
 * Web-ringed portrait disc (drop your photo into site.portraitUrl),
 * lead statement, editable paragraphs, and four trait chips.
 * All copy lives in src/data/site.js.
 */
import { Code2, Puzzle, Hammer, Lightbulb } from 'lucide-react'
import { site } from '../data/site.js'
import useGSAP from '../hooks/useGSAP'

const TRAIT_ICONS = [Code2, Puzzle, Hammer, Lightbulb]

export default function About() {
  // useGSAP returns the scope ref — attach it to the section
  const rootRef = useGSAP(
    ({ gsap: g, scope }) => {
      g.from(scope.querySelectorAll('.about-visual, .about-content > *'), {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: scope, start: 'top 75%', once: true },
      })
    },
    {}
  )

  return (
    <section id="about" className="section" ref={rootRef}>
      <div className="container">
        <div className="section-head">
          <p className="section-eyebrow">Chapter 01 — Who is Koushik</p>
          <h2 className="section-title">
            BEHIND THE <span className="red">CODE</span>
          </h2>
        </div>

        <div className="about-grid">
          {/* -------- portrait disc -------- */}
          <div className="about-visual">
            <div className="about-disc" data-cursor>
              {site.portraitUrl ? (
                <img
                  className="about-photo"
                  src={site.portraitUrl}
                  alt={`Portrait of ${site.name}`}
                  loading="lazy"
                />
              ) : (
                <div className="about-monogram">KJ</div>
              )}
              <div className="about-web" />
              <div className="about-scan" />
            </div>
            <p className="about-caption">// hero_dossier.jpg</p>
          </div>

          {/* -------- copy -------- */}
          <div className="about-content">
            <p className="about-lead">{site.about.lead}</p>
            {site.about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <div className="about-traits">
              {site.about.traits.map((t, i) => {
                const Icon = TRAIT_ICONS[i % TRAIT_ICONS.length]
                return (
                  <div className="trait" key={t.label}>
                    <span className="trait-icon">
                      <Icon size={16} />
                    </span>
                    <span>
                      <span className="trait-name">{t.label}</span>
                      <br />
                      <span className="trait-detail">{t.detail}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
