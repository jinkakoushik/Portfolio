/**
 * ============================================================
 *  SITE DATA  —  ✏️  EDIT YOUR PERSONAL INFO HERE
 * ============================================================
 *  Everything below is placeholder-friendly. Replace the values
 *  marked with "EDIT" and the whole site updates automatically.
 * ============================================================
 */

export const site = {
  // EDIT: your name exactly as you want it displayed
  name: 'Koushik Jinka',
  // Short version used in the navbar ("KJ" mark + name)
  shortName: 'KJ',
  role: 'Full Stack Developer',
  tagline:
    'Building digital experiences with code, creativity and a little bit of web-slinging.',

  // EDIT: point this at your real resume (place the file in /public/)
  resumeUrl: '/resume.pdf',

  // EDIT: drop your portrait in /public/images/ and set the path here.
  // Leave as '' to use the built-in spider-mask placeholder.
  portraitUrl: '',

  // ==========================================================
  //  CONTACT — ✏️ REPLACE THESE THREE PLACEHOLDERS
  // ==========================================================
  email: 'jkoushik15@gmail.com', // EDIT: your email
  github: 'https://github.com/jinkakoushik', // EDIT: your GitHub URL
  linkedin: 'https://www.linkedin.com/in/koushik-j-a49112324/', // EDIT: your LinkedIn URL

  // ==========================================================
  //  ABOUT — ✏️ WRITE YOUR REAL INTRO HERE
  //  (No fake achievements — every paragraph below is a
  //   placeholder template you should rewrite.)
  // ==========================================================
  about: {
    lead: "Hi, I'm Koushik Jinka, a Full Stack Developer who enjoys turning ideas into useful, modern and interactive digital products.",
    paragraphs: [
      // EDIT: replace this template paragraph with your own story.
      "I like working across the whole stack — shaping clean interfaces on the front, designing dependable APIs on the back, and making sure the two meet in a product that simply works. This portfolio is a small example of that: built with React, GSAP and a lot of attention to motion detail.",
      // EDIT: replace with your current focus / what you're learning.
      "Right now I'm focused on deepening my craft: writing cleaner components, designing better APIs and learning how production systems scale. The goal is always the same — build things that are genuinely useful and feel great to use.",
    ],
    // EDIT: tweak these four identity words if you like
    traits: [
      { label: 'Developer', detail: 'End-to-end product building' },
      { label: 'Problem solver', detail: 'Breaking complex problems into small wins' },
      { label: 'Builder', detail: 'Shipping real projects, not just tutorials' },
      { label: 'Creative thinker', detail: 'Design-minded engineering' },
    ],
  },

  // Footer copyright line
  copyright: '© 2026 Koushik Jinka. Built with code & creativity.',
}

// Derived convenience values (no need to edit)
export const emailHref = `mailto:${site.email}`
