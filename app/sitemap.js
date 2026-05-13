import { supabase } from '../lib/supabase';

export default async function sitemap() {
  // L'URL officielle de ton nouvel empire
  const baseUrl = 'https://www.ideescasa.fr';

  // 1. Récupération dynamique des produits (Les machines espresso)
  let productRoutes = [];
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug, last_hunt_at')
      .not('slug', 'is', null);

    if (products) {
      productRoutes = products.map((product) => ({
        url: `${baseUrl}/machines/${product.slug}`,
        lastModified: product.last_hunt_at ? new Date(product.last_hunt_at) : new Date(),
        changeFrequency: 'weekly', // On passe en weekly car les prix ne bougent pas toutes les heures
        priority: 0.8,
      }));
    }
  } catch (e) {
    console.error("Sitemap: Erreur récupération produits", e);
  }

  // 2. Récupération dynamique des articles (Le Lab Idées Casa)
  let articleRoutes = [];
  try {
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, created_at')
      .not('slug', 'is', null);

    if (articles) {
      articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/article/${article.slug}`,
        lastModified: article.created_at ? new Date(article.created_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    }
  } catch (e) {
    console.error("Sitemap: Erreur récupération articles", e);
  }

  // 3. Routes statiques (Accueil et Contact)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // On assemble le tout pour Google
  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
