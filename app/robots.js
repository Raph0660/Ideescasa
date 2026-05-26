export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/recherche',
          '/filtres',
          '/*?sort=',
          '/*?page=',
          '/*?filter=',
          '/*?ref=',
          '/*?utm_*',
          '/api/'
        ],
      },
      {
        // On bloque les robots d'IA pour préserver ton serveur et tes contenus
        userAgent: ['GPTBot', 'CCBot', 'Google-Extended', 'Anthropic-AI'],
        disallow: '/',
      }
    ],
    sitemap: 'https://www.ideescasa.fr/sitemap.xml',
  }
}
