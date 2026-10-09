import { withContentCollections } from "@content-collections/next";

// --- Deployment modes -------------------------------------------------------
// Cloudflare (default): full Next.js, SSR + /api/projects (live pinned repos).
// GitHub Pages (STATIC_EXPORT=1): static export under a base path.
//
//   NEXT_PUBLIC_BASE_PATH  e.g. "/Godwin-Enendu" for a Pages project site.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isStatic = process.env.STATIC_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isStatic
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath || undefined,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "DENY" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
              ],
            },
          ];
        },
      }),
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
