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
        // On maintient le blocage strict sur les scrapers IA tiers, mais sans Google-Extended
        userAgent: ['GPTBot', 'CCBot', 'Anthropic-AI'], 
        allow: '/llms.txt',
        disallow: '/',
      }
    ],
    sitemap: 'https://www.ideescasa.fr/sitemap.xml',
  }
}
