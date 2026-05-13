/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // Redirige toutes les anciennes pages de déco/maison vers la Home
        // Ce "wildcard" capture tout ce qui n'est pas une de tes nouvelles routes
        source: '/ancienne-categorie/:path*', 
        destination: '/',
        permanent: true,
      },
    ];
  },
  // Assure-toi que tes domaines d'images sont autorisés pour éviter les erreurs 400
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.boulanger.com' },
      { protocol: 'https', hostname: '**.coffee-webstore.com' },
      { protocol: 'https', hostname: '**.scene7.com' },
    ],
  },
};

export default nextConfig;
