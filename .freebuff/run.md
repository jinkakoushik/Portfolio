# Run doc — Koushik Jinka Portfolio (Vite + React)

Static React SPA. No backend, no env files, no secrets — nothing needs copying
from another checkout. Dependencies are standard npm (`package-lock.json`).

## Reproduce artifacts

```bash
npm install          # installs vite, react, gsap, lenis, lucide-react
```

(`node_modules` was already present in this worktree; only run if it's missing.)

## Run the server

```bash
npm run dev -- --port 5180 --strictPort
```

- Default Vite port is **5173** — on this machine it was occupied by an unrelated
  listener, so the preview uses **5180**. If 5180 is taken, pick any free port
  and update the Preview registration accordingly.
- Serve from the project root (this directory). No env vars needed.

## Detached start (Windows, for the preview harness)

```powershell
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','--port','5180','--strictPort' -WorkingDirectory 'C:\Users\jkous\OneDrive\Desktop\Portfolio' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
```

stdout and stderr go to different files (PowerShell requirement). Verify with
`Get-Process -Id <pid>` and `curl http://localhost:5180/` → expect HTTP 200.

## Production build (optional sanity check)

```bash
npm run build   # outputs to dist/ — ~310KB JS / 107KB gzipped, 28KB CSS
```
