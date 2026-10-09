// Prefixes public asset paths with the deployment base path.
// Needed for GitHub Pages project sites (served under /<repo>/).
// Empty base path (Cloudflare / local dev) leaves paths unchanged.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${p}`;
}
