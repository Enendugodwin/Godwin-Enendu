// Base path when hosting on GitHub Pages as a project site:
//   https://<user>.github.io/<repo>/  ->  basePath = "/<repo>"
// For a user/org site (repo named <user>.github.io) or local dev, leave empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages serves static files only.
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
