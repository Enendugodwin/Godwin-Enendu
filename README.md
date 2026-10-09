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

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Cloudflare Pages + Worker setup, secrets,
and verification steps.

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
