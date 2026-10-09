# Deployment Guide — Cloudflare

This portfolio is a **Next.js app deployed to Cloudflare Workers** using the
[OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare). This runs the
full app — including the `/api/projects` route that serves live, pinned GitHub
repositories (15-minute cache) — so the Projects section updates automatically
without a redeploy.

## Architecture

| Piece | Where |
|-------|-------|
| Next.js app (SSR + `/api/projects`) | Cloudflare Worker (`godwin-portfolio`) |
| GitHub token | Worker secret `GITHUB_TOKEN` (never in the client) |
| Static assets | Served from the Worker's `ASSETS` binding |
| CI/CD | GitHub Actions (`.github/workflows/deploy-cloudflare.yml`) |

## Files

- `open-next.config.ts` — OpenNext Cloudflare config
- `wrangler.jsonc` — Worker name, entry, `nodejs_compat`, assets binding
- `.github/workflows/deploy-cloudflare.yml` — build + deploy on push to `main`
- `src/app/api/projects/route.ts` — API used by the Projects section

---

## 1. Local development

```bash
pnpm install
cp .env.example .env.local     # set GITHUB_TOKEN
pnpm dev                       # http://localhost:3000
```

## 2. One-time Cloudflare setup

### a) Create an API token
Cloudflare dashboard → **My Profile → API Tokens → Create Token** →
use the **"Edit Cloudflare Workers"** template.
Copy the token.

### b) Get your Account ID
Cloudflare dashboard → **Workers & Pages** → right sidebar shows **Account ID**.

### c) Add repo secrets (GitHub → Settings → Secrets and variables → Actions)
| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | the token from (a) |
| `CLOUDFLARE_ACCOUNT_ID` | your account ID from (b) |

### d) Set the GitHub token as a Worker secret
After the first deploy creates the Worker, run once locally:

```bash
wrangler login
wrangler secret put GITHUB_TOKEN
# paste a read-only GitHub PAT when prompted
```

Optional: create a KV namespace for edge caching and uncomment the
`kv_namespaces` block in `wrangler.jsonc`:

```bash
wrangler kv namespace create CACHE_KV
```

## 3. Deploy

**Automatic:** push to `main` — the GitHub Action builds and deploys.

**Manual:**

```bash
pnpm exec opennextjs-cloudflare build
pnpm exec wrangler deploy
```

The app is served at `https://godwin-portfolio.<your-subdomain>.workers.dev`.

> ⚠️ **Windows:** OpenNext's bundling step does not run on Windows. Build on
> Linux/macOS, in WSL, or via GitHub Actions (recommended). Next.js `next dev`
> and `next build` still work fine on Windows.

## 4. Connecting a custom domain (optional)

Cloudflare dashboard → Workers & Pages → `godwin-portfolio` → **Settings →
Domains & Routes → Add custom domain**. Then set `ALLOWED_ORIGIN` in
`wrangler.jsonc` to that origin to lock down CORS.

---

## Alternative: Cloudflare dashboard Git integration

Instead of GitHub Actions, you can connect the repo directly:

1. Cloudflare dashboard → **Workers & Pages → Create → Connect to Git**
2. Select the repository
3. Build command: `npx opennextjs-cloudflare build`
   Deploy command: `npx wrangler deploy`
4. Add `GITHUB_TOKEN` under the Worker's **Settings → Variables and Secrets**

Either method works; the GitHub Action is version-controlled and reproducible.

---

## Verification checklist

- [ ] `pnpm build` succeeds locally
- [ ] `pnpm exec opennextjs-cloudflare build` succeeds on Linux/CI
- [ ] Worker deployed; site loads at the `.workers.dev` URL
- [ ] `/api/projects` returns JSON with your pinned repos
- [ ] Projects section shows repos; images/CV load
- [ ] `GITHUB_TOKEN` set as a Worker **secret** (not a plain var, not in git)
- [ ] Changing pins updates the site within 15 minutes

## Security notes

- The GitHub token lives only as a Worker secret and in `.env.local` (gitignored).
- Never commit `.env.local`, `.dev.vars`, or paste tokens into source.
- Use a **read-only** GitHub token (public repo metadata only).
