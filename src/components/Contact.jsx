/**
 * Contact — "SEND A WEB".
 * Three channel pills (email / GitHub / LinkedIn, pulled from
 * site.js) and one oversized mailto CTA. Corner web decor echoes
 * the hero. All placeholders live in src/data/site.js.
 */
import { Mail, Github, Linkedin, ArrowRight } from 'lucide-react'
import { site, emailHref } from '../data/site.js'
import useGSAP from '../hooks/useGSAP'

/* corner spider web decoration */
function CornerWeb() {
  const spokes = [0, 22, 45, 68, 90]
  const arcs = [110, 190, 280, 380, 490]
  return (
    <svg className="contact-web" viewBox="0 0 500 500" fill="none" aria-hidden="true">
      <g stroke="rgba(230,36,41,0.22)" strokeWidth="1">
        {spokes.map((deg) => {
          const rad = (deg * Math.PI) / 180
          return (
            <line
              key={deg}
              x1="500"
              y1="0"
              x2={500 - Math.cos(rad) * 700}
              y2={Math.sin(rad) * 700}
            />
          )
        })}
        {arcs.map((r) => (
          <path
            key={r}
            d={`M 500 ${r} Q ${500 - r * 0.55} ${r * 0.55} ${500 - r} 0`}
          />
        ))}
      </g>
    </svg>
  )
}

export default function Contact() {
  const rootRef = useGSAP(
    ({ gsap: g, scope }) => {
      g.from(scope.querySelectorAll('.contact-channels .channel, .contact-cta'), {
        opacity: 0,
        y: 36,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: scope, start: 'top 75%', once: true },
      })
      // CTA arrow nudges on scroll into view
      g.from('.cta-arrow', {
        x: -30,
        opacity: 0,
        duration: 0.9,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: scope, start: 'top 60%', once: true },
      })
    },
    {}
  )

  return (
    <section id="contact" className="section contact" ref={rootRef}>
      <CornerWeb />

      <div className="container contact-inner">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <p className="section-eyebrow">Final Chapter — Transmission</p>
          <h2 className="section-title">
            SEND A <span className="red">WEB</span>
          </h2>
          <p className="section-sub" style={{ marginInline: 'auto' }}>
            Have an idea? Let&apos;s build something.
          </p>
        </div>

        <div className="contact-channels">
          <a className="channel" href={emailHref} data-cursor>
            <Mail size={15} />
            {site.email}
          </a>
          <a className="channel" href={site.github} target="_blank" rel="noreferrer" data-cursor>
            <Github size={15} />
            {site.github.replace(/^https?:\/\//, '')}
          </a>
          <a className="channel" href={site.linkedin} target="_blank" rel="noreferrer" data-cursor>
            <Linkedin size={15} />
            {site.linkedin.replace(/^https?:\/\//, '')}
          </a>
        </div>

        <a className="contact-cta" href={emailHref} data-cursor>
          <span className="contact-cta-text">
            <span>LET&apos;S BUILD</span>
            <span className="cta-arrow">
              <ArrowRight size={72} strokeWidth={1.6} />
            </span>
            <span>SOMETHING</span>
          </span>
          <span className="contact-cta-sub">Usually replies within 24 hours — faster than a spider-sense</span>
        </a>
      </div>
    </section>
  )
}
