# Godwin Enendu — Cybersecurity Portfolio

A responsive, dark-themed personal portfolio for **Godwin Enendu**, a cybersecurity
professional focused on security operations, detection, and automation.

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Magic UI components.
Project data is pulled live from GitHub, with the API served by a Cloudflare Worker.

## Features

- **Hero, About, Expertise, Experience, Certifications, Education, Projects, Contact**
- **Live GitHub projects** — automatically synced from pinned repositories (15-min cache)
- **Certifications** with issuer logos
- **Responsive** across mobile, tablet, and desktop
- **Accessible** — semantic HTML, keyboard navigation, visible focus states, reduced-motion support
- **Dark cybersecurity theme** (navy + cyan accents)
- **CV download** (`public/cv.pdf`)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI | Magic UI / shadcn-style components |
| API | Next.js route handler (dev) + Cloudflare Worker (prod) |
| Data | GitHub GraphQL API (`pinnedItems`) |
| Hosting | Cloudflare Pages + Workers |

## Getting Started

```bash
# Install (pnpm)
corepack enable
pnpm install

# Configure environment
cp .env.example .env.local
# then set GITHUB_TOKEN in .env.local

# Run
pnpm dev
```

Open http://localhost:3000

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | GitHub PAT (read-only) for fetching pinned repositories |
| `ALLOWED_ORIGIN` | Production origin allowed by the Worker's CORS policy |

`.env.local` is gitignored. Never commit real tokens.

## Live GitHub Projects

The Projects section fetches from `/api/projects`, which queries GitHub GraphQL for
the user's **pinned repositories** in pinned order. Successful responses are cached
for 15 minutes. Pinning/unpinning/reordering repos updates the site without a
frontend redeploy.

In development, the Next.js route handler (`src/app/api/projects/route.ts`) serves
the data. In production, the Cloudflare Worker (`worker/index.ts`) does, with KV
caching and a fallback dataset.

## Deployment

### GitHub Pages (static)

The site is a static export (`output: "export"` → `out/`) and deploys via
GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`, plus a
daily scheduled rebuild to refresh GitHub project data.

**One-time setup:**
1. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. (Optional) Add a `GH_PAT` repo secret for higher GitHub API rate limits;
   otherwise the automatic `GITHUB_TOKEN` is used.

**Base path:** served as a project site at `https://enendugodwin.github.io/Godwin-Enendu/`,
so the workflow sets `NEXT_PUBLIC_BASE_PATH=/Godwin-Enendu`. If you rename the
repo to `enendugodwin.github.io` (user site at the domain root), set it to empty.

**Refreshing projects:** the build fetches pinned repos via `scripts/fetch-projects.mjs`
using `GITHUB_TOKEN`. Pin/unpin/reorder on GitHub, then re-run the workflow
(often automatic daily, or trigger it manually) — no code change needed.

### Cloudflare (optional)

The repo also includes a Cloudflare Worker (`worker/index.ts`) that serves
`/api/projects` with live 15-minute caching for truly real-time updates. See
[DEPLOYMENT.md](./DEPLOYMENT.md) for Cloudflare Pages + Worker setup.

## Project Structure

```
src/
  app/
    api/projects/route.ts   # dev API (GitHub GraphQL)
    page.tsx                # main page
    layout.tsx              # layout + metadata
    globals.css             # theme tokens
  components/
    section/                # page sections
    ui/                     # base UI components
  data/resume.tsx           # CV data (source of truth)
worker/index.ts             # Cloudflare Worker (production API)
wrangler.toml               # Worker config
```

## Credits

Scaffolded from the [Magic UI portfolio template](https://github.com/magicuidesign/portfolio),
customized for Godwin Enendu.

## Contact

- Email: enendugodwin@gmail.com
- GitHub: [@enendugodwin](https://github.com/enendugodwin)
- LinkedIn: [enendugodwin](https://linkedin.com/in/enendugodwin)
- Location: Lagos, Nigeria
