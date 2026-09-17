/**
 * Projects — "MISSIONS".
 * Featured mission card (hover-zoom media, drawn web lines, tech
 * tags) plus dashed COMING SOON slots. Entirely data-driven from
 * projects.js — add an object, get a mission.
 */
import { ArrowUpRight, Github } from 'lucide-react'
import { projects } from '../data/projects.js'
import useGSAP from '../hooks/useGSAP'
import useMagnetic from '../hooks/useMagnetic'

/* Red web lines drawn across the media when the card is hovered */
function MissionWeb({ seed }) {
  const lines = [
    { x1: 0, y1: 0, x2: 55, y2: 100 },
    { x1: 0, y1: 0, x2: 85, y2: 78 },
    { x1: 100, y1: 100, x2: 45, y2: 8 },
    { x1: 100, y1: 100, x2: 18, y2: 30 },
    { x1: 0, y1: 100, x2: 100, y2: 0 },
  ]
  return (
    <svg className="mission-web" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {lines.map((l, i) => (
        <line
          key={`${seed}-${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}

/* Featured mission card */
function MissionCard({ project }) {
  const ref = useMagnetic({ strength: 0.12 })

  return (
    <article className="mission-card" ref={ref}>
      <div className="mission-grid">
        <div className="mission-media" data-cursor>
          <img
            className="mission-img"
            src={project.image}
            alt={`${project.title} — project preview`}
            loading="lazy"
          />
          <MissionWeb seed={project.id} />
        </div>

        <div className="mission-body">
          <div className="mission-top">
            <span className="mission-number">{project.number}</span>
            <span className="mission-label">Mission {project.number}</span>
            <span className="mission-status">
              <span className="dot" />
              Deployed
            </span>
          </div>

          <h3 className="mission-title">{project.title}</h3>
          <p className="mission-desc">{project.description}</p>
          {project.detail && <p className="mission-detail">{project.detail}</p>}

          <div className="mission-tech">
            {project.tech.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>

          <div className="mission-links">
            <a className="btn btn-primary" href={project.demo} data-cursor>
              Live Demo
              <ArrowUpRight size={15} />
            </a>
            <a className="btn btn-link" href={project.github} data-cursor>
              <Github size={15} />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

/* Empty coming-soon slot */
function MissionSoon({ project }) {
  return (
    <article className="mission-card mission-soon">
      <div className="mission-soon-inner">
        <span className="mission-soon-number">MISSION {project.number}</span>
        <h3 className="mission-soon-title">{project.title}</h3>
        <span className="mission-soon-hint">// awaiting next deployment</span>
      </div>
    </article>
  )
}

export default function Projects() {
  const rootRef = useGSAP(
    ({ gsap: g, scope }) => {
      g.from(scope.querySelectorAll('.mission-card'), {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: scope.querySelector('.missions-list'), start: 'top 80%', once: true },
      })
    },
    {}
  )

  return (
    <section id="projects" className="section" ref={rootRef}>
      <div className="container">
        <div className="section-head">
          <p className="section-eyebrow">Chapter 03 — Field Record</p>
          <h2 className="section-title">
            MIS<span className="red">SIONS</span>
          </h2>
          <p className="section-sub">
            Selected builds. Each one shipped, documented and battle-tested.
          </p>
        </div>

        <div className="missions-list">
          {projects.map((p) =>
            p.status === 'featured' ? (
              <MissionCard key={p.id} project={p} />
            ) : (
              <MissionSoon key={p.id} project={p} />
            )
          )}
        </div>
      </div>
    </section>
  )
}
