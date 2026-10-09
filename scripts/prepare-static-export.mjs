// Prepares the repo for a GitHub Pages static export by removing routes that
// require a server (API handlers, OpenGraph image generators) or that use
// dynamic rendering (the blog's searchParams pagination).
//
// Safe to run in CI (ephemeral checkout). Does not touch Cloudflare deploys.

import { rmSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

const targets = [
  "src/app/api",
  "src/app/blog",
  "src/app/opengraph-image.tsx",
];

for (const t of targets) {
  const p = resolve(root, t);
  rmSync(p, { recursive: true, force: true });
  console.log(`[static-export] removed ${t}`);
}

// Ensure .nojekyll so Next's `_next` directory is served by GitHub Pages.
mkdirSync(resolve(root, "public"), { recursive: true });
writeFileSync(resolve(root, "public/.nojekyll"), "");
console.log("[static-export] wrote public/.nojekyll");
