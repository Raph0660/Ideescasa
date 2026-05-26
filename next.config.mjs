/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Tes redirections SEO indispensables (Domaine expiré)
  async redirects() {
    return [
      { source: '/category/:path*', destination: '/', permanent: true },
      { source: '/2025/:path*', destination: '/', permanent: true },
      { source: '/:slug*.php', destination: '/', permanent: true },
      { source: '/blog/:path*', destination: '/', permanent: true },
      { source: '/author/:path*', destination: '/', permanent: true }
    ];
  },

  // 2. Tes autorisations d'images marchands
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.boulanger.com' },
      { protocol: 'https', hostname: '**.coffee-webstore.com' },
      { protocol: 'https', hostname: '**.maxicoffee.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: '**.scene7.com' },
      { protocol: 'https', hostname: '**.ideescasa.fr' }
    ],
  },

  // 3. AJOUT : Les en-têtes de sécurité de Claude (Validés pour Google)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
