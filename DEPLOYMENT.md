# Deployment Guide: Godwin Enendu Cybersecurity Portfolio

## Overview

This portfolio uses:
- **Frontend**: Next.js 16 on Cloudflare Pages
- **API**: Cloudflare Worker for GitHub GraphQL integration
- **Cache**: Cloudflare KV for 15-minute response caching

---

## 1. Local Development

### Prerequisites
- Node.js 18+
- pnpm 12+
- GitHub Personal Access Token (classic or fine-grained with `public_repo` scope)

### Setup

```bash
# Clone and install
git clone https://github.com/magicuidesign/portfolio.git godwin-portfolio
cd godwin-portfolio

# Enable pnpm and install
corepack enable
pnpm install

# Create local env file
cp .env.example .env.local
# Edit .env.local and add your GITHUB_TOKEN

# Run dev server
pnpm dev
```

Open http://localhost:3001

---

## 2. Cloudflare Worker Deployment

### Create KV Namespace

```bash
# Production KV
wrangler kv:namespace create CACHE_KV

# Preview/Development KV
wrangler kv:namespace create CACHE_KV --preview
```

Copy the returned IDs and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CACHE_KV"
id = "your-production-kv-id"
preview_id = "your-preview-kv-id"
```

### Configure Worker Secrets

```bash
# Set GitHub token as secret (never in wrangler.toml!)
wrangler secret put GITHUB_TOKEN
# Enter your GitHub PAT when prompted

# Set allowed origin
wrangler secret put ALLOWED_ORIGIN
# Enter: https://your-project.pages.dev
```

### Deploy Worker

```bash
wrangler deploy
```

Worker will be available at: `https://godwin-portfolio-api.your-subdomain.workers.dev`

---

## 3. Cloudflare Pages Deployment

### Connect Repository

1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project" → "Connect to Git"
3. Select your GitHub repository
4. Configure build settings:
   - **Build command**: `pnpm build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (or `/godwin-portfolio` if in subfolder)

### Environment Variables (Pages)

In Pages project settings → Environment variables:

| Variable | Value |
|----------|-------|
| `GITHUB_TOKEN` | Your GitHub PAT (use "Encrypt" toggle) |
| `ALLOWED_ORIGIN` | `https://your-project.pages.dev` |

### Custom Domain

1. In Pages project → Custom domains
2. Add your domain (e.g., `godwin-enendu.pages.dev` or custom domain)
3. Update `ALLOWED_ORIGIN` in Worker and Pages to match

---

## 4. GitHub Token Setup

### Option A: Classic PAT
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Scope: `public_repo`
4. Copy token immediately

### Option B: Fine-grained PAT (Recommended)
1. Go to https://github.com/settings/tokens?type=beta
2. Generate new token
3. Repository access: Select `enendugodwin` repositories
4. Permissions: `Contents` → `Read-only`
5. Copy token immediately

---

## 5. Architecture Details

### API Response Format

```json
{
  "source": "github" | "cache" | "fallback",
  "syncedAt": "2026-10-09T12:00:00.000Z",
  "projects": [
    {
      "name": "repo-name",
      "description": "Repository description",
      "url": "https://github.com/enendugodwin/repo-name",
      "homepageUrl": "https://demo-url.com",
      "updatedAt": "2026-10-04T12:00:00Z",
      "stargazerCount": 42,
      "forkCount": 5,
      "primaryLanguage": { "name": "Python", "color": "#3572A5" },
      "repositoryTopics": { "nodes": [{ "topic": { "name": "security" } }] },
      "isArchived": false
    }
  ]
}
```

### Caching Strategy

- **TTL**: 15 minutes (900 seconds)
- **Storage**: Cloudflare KV (edge-distributed)
- **Fallback**: Static fallback projects if both GitHub and cache fail
- **Headers**: `Cache-Control: public, max-age=600, stale-while-revalidate=300`

### CORS Configuration

- Worker validates `Origin` header against `ALLOWED_ORIGIN`
- Rejects requests from unauthorized origins
- Allows `GET` and `OPTIONS` methods only

---

## 6. Verification Checklist

### Local
- [ ] Dev server runs at `http://localhost:3001`
- [ ] Projects load from API (check Network tab)
- [ ] Fallback shows when token missing
- [ ] All sections render correctly

### Worker
- [ ] `GET /api/projects` returns JSON
- [ ] `OPTIONS /api/projects` returns CORS headers
- [ ] Unauthorized origin rejected (403)
- [ ] Token not visible in response
- [ ] Cache works (second request faster)

### Pages
- [ ] Build succeeds
- [ ] All routes accessible
- [ ] Projects section loads data
- [ ] Custom domain works
- [ ] HTTPS enforced

### Security
- [ ] No tokens in client bundle
- [ ] No tokens in Git history
- [ ] CSP headers present
- [ ] Security headers present

---

## 7. Updating Pinned Repositories

1. Go to https://github.com/enendugodwin
2. Click "Customize your pins" on profile
3. Select/reorder up to 6 repositories
4. Changes appear on website within **15 minutes** (cache TTL)

No redeployment needed!

---

## 8. Troubleshooting

### Projects not loading
- Check Worker logs: `wrangler tail`
- Verify GITHUB_TOKEN is set in Worker secrets
- Check GitHub API rate limits

### CORS errors
- Ensure `ALLOWED_ORIGIN` matches exactly (including protocol)
- Check Worker CORS headers in browser Network tab

### Build failures
- Run `pnpm build` locally first
- Check for TypeScript errors
- Verify all imports resolve

### Cache not working
- Verify KV namespace ID in `wrangler.toml`
- Check `CACHE_KV` binding in Worker
- Monitor KV operations in Cloudflare dashboard

---

## 9. File Structure Summary

```
godwin-portfolio/
├── src/
│   ├── app/
│   │   ├── api/projects/route.ts    # Next.js API route (dev)
│   │   ├── page.tsx                 # Main page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── section/
│   │   │   ├── projects-section.tsx # Dynamic GitHub projects
│   │   │   ├── expertise-section.tsx
│   │   │   ├── certifications-section.tsx
│   │   │   ├── work-section.tsx
│   │   │   └── contact-section.tsx
│   │   └── ...
│   ├── data/resume.tsx              # CV data (source of truth)
│   └── ...
├── worker/
│   └── index.ts                     # Cloudflare Worker
├── wrangler.toml                    # Worker config
├── .env.example                     # Env template
└── DEPLOYMENT.md                    # This file
```

---

## 10. Commands Reference

```bash
# Development
pnpm dev                 # Start dev server
pnpm build               # Production build
pnpm lint                # Run ESLint
pnpm lint:fix            # Fix lint issues

# Worker
wrangler dev             # Local worker dev
wrangler deploy          # Deploy worker
wrangler tail            # View worker logs
wrangler secret put KEY  # Set secret

# KV
wrangler kv:namespace create CACHE_KV
wrangler kv:key list --binding CACHE_KV
wrangler kv:key get pinned_projects --binding CACHE_KV
```

---

## Support

For issues:
1. Check Worker logs: `wrangler tail`
2. Check Pages build logs in Cloudflare dashboard
3. Verify GitHub token permissions
4. Test API directly: `curl https://your-worker.workers.dev/api/projects`