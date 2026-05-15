/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "img-src 'self' data: https://*.scene7.com https://*.boulanger.com https://*.unsplash.com https://m.media-amazon.com;",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/category/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/2025/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:slug*.php',
        destination: '/',
        permanent: true,
      },
      {
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
      { protocol: 'https', hostname: '**.maxicoffee.com' },
      { protocol: 'https', hostname: 'media1.coffee-webstore.com' },
      { protocol: 'https', hostname: 'media2.coffee-webstore.com' },
      { protocol: 'https', hostname: 'media3.coffee-webstore.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: '**.scene7.com' }
    ],
  },
};

export default nextConfig;
