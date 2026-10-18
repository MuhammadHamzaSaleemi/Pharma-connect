/** @type {import('next').NextConfig} */
const path = require('path')

// Private areas: reachable, but kept out of search results.
const NOINDEX_ROUTES = ['dashboard', 'login']

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: `/:route(${NOINDEX_ROUTES.join('|')})/:rest*`,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        // Static images rarely change; a week of browser/CDN caching. Rename a file to bust it.
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
    ]
  },
  output: 'standalone',
  // Deliberately off: local images are pre-converted to small WebP files, and remote (API-hosted) images
  // would need `remotePatterns`, which Next 14 has an unpatched Image Optimizer DoS advisory for (fixed
  // only in 15+). Standalone output would also need `sharp`. Revisit after a Next major upgrade.
  images: {
    unoptimized: true,
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
