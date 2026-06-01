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
        // On bloque le crawl global mais on autorise explicitement le point d'ancrage IA
        userAgent: ['GPTBot', 'CCBot', 'Google-Extended', 'Anthropic-AI'],
        allow: '/llms.txt',
        disallow: '/',
      }
    ],
    sitemap: 'https://www.ideescasa.fr/sitemap.xml',
  }
}
