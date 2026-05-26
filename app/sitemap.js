import { supabase } from '../lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://www.ideescasa.fr';

  // 1. Récupération dynamique des produits uniques (Vue best_products)
  let uniqueProducts = [];
  let productRoutes = [];
  try {
    const { data: products } = await supabase
      .from('best_products')
      .select('slug, last_hunt_at')
      .not('slug', 'is', null);

    if (products) {
      uniqueProducts = products; // On stocke la liste pour le comparateur juste en dessous
      productRoutes = products.map((product) => ({
        url: `${baseUrl}/machines/${product.slug}`,
        lastModified: product.last_hunt_at ? new Date(product.last_hunt_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (e) {
    console.error("Sitemap: Erreur récupération produits", e);
  }

  // 2. GÉNÉRATION AUTOMATIQUE DES COMBINAISONS DU COMPARATEUR (pSEO)
  let comparisonRoutes = [];
  try {
    if (uniqueProducts.length > 1) {
      // On trie les produits par ordre alphabétique de slug pour être synchro avec la page de destination
      const sortedProducts = [...uniqueProducts].sort((a, b) => a.slug.localeCompare(b.slug));

      // Algorithme de combinaison mathématique (Paires uniques A vs B sans doublon)
      for (let i = 0; i < sortedProducts.length; i++) {
        for (let j = i + 1; j < sortedProducts.length; j++) {
          const pA = sortedProducts[i];
          const pB = sortedProducts[j];

          // On détermine la date la plus fraîche entre les deux machines
          const dateA = pA.last_hunt_at ? new Date(pA.last_hunt_at) : new Date();
          const dateB = pB.last_hunt_at ? new Date(pB.last_hunt_at) : new Date();
          const mostRecentDate = dateA > dateB ? dateA : dateB;

          comparisonRoutes.push({
            url: `${baseUrl}/comparatif/${pA.slug}-vs-${pB.slug}`,
            lastModified: mostRecentDate,
            changeFrequency: 'weekly',
            priority: 0.6, // Priorité Claude validée pour les pages secondaires croisées
          });
        }
      }
    }
  } catch (e) {
    console.error("Sitemap: Erreur génération comparatifs pSEO", e);
  }

  // 3. Récupération dynamique des articles (Le Lab Idées Casa)
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

  // 4. Routes statiques (Identité et Confiance E-E-A-T)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // On fusionne tout le monde pour Googlebot
  return [...staticRoutes, ...productRoutes, ...comparisonRoutes, ...articleRoutes];
}
