/**
 * ============================================================
 *  PROJECTS DATA  —  ✏️  EDIT YOUR PROJECTS HERE
 * ============================================================
 *  HOW TO ADD A PROJECT:
 *  1. Add an object to the `projects` array below.
 *  2. `image`  → path to a screenshot in /public/images/
 *                (leave null to use the generated web visual)
 *  3. `demo` / `github` → links for the LIVE DEMO / GITHUB buttons
 *                (use "#" as placeholder or a real URL when ready)
 *  4. `status` 'featured' renders the big showcase card;
 *     'soon' renders an empty MISSION 00X — COMING SOON slot.
 * ============================================================
 */

export const projects = [
  {
    id: 'wine-explorer',
    number: '001',
    title: 'WINE EXPLORER',
    description:
      'A full-stack web application for discovering and exploring wines.',
    // Longer optional detail shown in the featured card
    detail:
      'Discover wines by taste, region and rating. Built end-to-end — a React frontend, an Express REST API with JWT authentication, and a MongoDB database behind it.',
    status: 'featured',
    // EDIT: add your real screenshot → /public/images/wine-explorer.jpg
    image: '/images/project-wine.jpg.svg',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'REST API'],
    // EDIT: real links when the project is live
    demo: 'https://wine-explorer-sigma.vercel.app/',
    github: 'https://github.com/jinkakoushik/wine-explorer',
  },
  {
    id: 'mission-002',
    number: '002',
    title: 'COMING SOON',
    description:
      'Next mission in progress. Replace this slot with your second project.',
    status: 'soon',
    tech: [],
  },
  {
    id: 'mission-003',
    number: '003',
    title: 'COMING SOON',
    description:
      'Another slot waiting for a future build. Swap in your project details.',
    status: 'soon',
    tech: [],
  },
]
