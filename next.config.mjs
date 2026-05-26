/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Redirections SEO indispensables (Ancien domaine expiré)
  async redirects() {
    return [
      { source: '/category/:path*', destination: '/', permanent: true },
      { source: '/2025/:path*', destination: '/', permanent: true },
      { source: '/:slug*.php', destination: '/', permanent: true },
      { source: '/blog/:path*', destination: '/', permanent: true },
      { source: '/author/:path*', destination: '/', permanent: true },

      // ➔ FILET DE SÉCURITÉ GLOBAL SÉCURISÉ & CORRIGÉ
      // - Remplacement de ".*" par ".+" pour ignorer la Home (chemin vide) et briser la boucle de redirections.
      // - Ajout de "comparatif" pour immuniser ton moteur pSEO de duels.
      {
        source: '/:path((?!machines|article|comparatif|contact|mentions-legales|politique-confidentialite|sitemap|robots|_next|api|favicon).+)',
        destination: '/',
        permanent: true,
      }
    ];
  },

  // 2. Autorisations d'images pour tes scrapers marchands & CDN
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

  // 3. En-têtes de sécurité statiques (Complétés par le nonce du middleware)
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
