/**
 * Footer — name, role, socials, copyright. Data from site.js.
 */
import { Github, Linkedin, Mail } from 'lucide-react'
import { site, emailHref } from '../data/site.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-name">{site.name}</div>
          <div className="footer-role">{site.role}</div>
        </div>

        <div className="footer-socials">
          <a
            className="footer-social"
            href={site.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            data-cursor
          >
            <Github size={18} />
          </a>
          <a
            className="footer-social"
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            data-cursor
          >
            <Linkedin size={18} />
          </a>
          <a className="footer-social" href={emailHref} aria-label="Email" data-cursor>
            <Mail size={18} />
          </a>
        </div>

        <p className="footer-copy">{site.copyright}</p>
      </div>
    </footer>
  )
}
