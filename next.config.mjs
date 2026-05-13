/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // Capture toutes les URLs de catégories (deco, jardin, immo, etc.)
        source: '/category/:path*',
        destination: '/',
        permanent: true,
      },
      {
        // Capture toutes les URLs d'archives par date (2025/02/...)
        source: '/2025/:path*',
        destination: '/',
        permanent: true,
      },
      {
        // Capture tous les anciens fichiers .php
        source: '/:slug*.php',
        destination: '/',
        permanent: true,
      },
      {
        // Capture le blog et les auteurs
        source: '/blog/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/author/:path*',
        destination: '/',
        permanent: true,
      }
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.boulanger.com' },
      { protocol: 'https', hostname: '**.coffee-webstore.com' },
      { protocol: 'https', hostname: '**.scene7.com' },
    ],
  },
};

export default nextConfig;
