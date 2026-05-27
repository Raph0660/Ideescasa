import { supabase } from '../lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://www.ideescasa.fr';

  let uniqueProducts = [];
  let productRoutes = [];
  let brandRoutes = []; // ◄ AJOUTÉ pour stocker les pages de marques

  // 1. Récupération dynamique des produits uniques (Vue best_products)
  try {
    const { data: products } = await supabase
      .from('best_products')
      .select('slug, last_hunt_at, brand') // ◄ AJOUTÉ : sélection de la colonne 'brand'
      .not('slug', 'is', null);

    if (products) {
      uniqueProducts = products; 
      
      // Génération des fiches produits individuelles
      productRoutes = products.map((product) => ({
        url: `${baseUrl}/machines/${product.slug}`,
        lastModified: product.last_hunt_at ? new Date(product.last_hunt_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

      // GÉNÉRATION DYNAMIQUE DES PAGES MARQUES (pSEO)
      // On isole les marques uniques en minuscules pour éviter les doublons de casse
      const rawBrands = products.map(p => p.brand).filter(Boolean);
      const uniqueBrands = [...new Set(rawBrands.map(b => b.toLowerCase()))];

      brandRoutes = uniqueBrands.map((brandSlug) => {
        // On trouve la date de rafraîchissement la plus récente pour cette marque précise
        const brandProducts = products.filter(p => p.brand?.toLowerCase() === brandSlug);
        const latestUpdate = brandProducts.reduce((acc, current) => {
          const currentDate = current.last_hunt_at ? new Date(current.last_hunt_at) : new Date(0);
          return currentDate > acc ? currentDate : acc;
        }, new Date(0));

        return {
          url: `${baseUrl}/marques/${brandSlug}`,
          lastModified: latestUpdate.getTime() === new Date(0).getTime() ? new Date() : latestUpdate,
          changeFrequency: 'daily', // Haute fréquence car de nouveaux prix entrent tout le temps pour une marque
          priority: 0.7, // Priorité forte intermédiaire préconisée pour les catégories de marque
        };
      });
    }
  } catch (e) {
    console.error("Sitemap: Erreur récupération produits et marques", e);
  }

  // 2. GÉNÉRATION AUTOMATIQUE DES COMBINAISONS DU COMPARATEUR (pSEO)
  let comparisonRoutes = [];
  try {
    if (uniqueProducts.length > 1) {
      const sortedProducts = [...uniqueProducts].sort((a, b) => a.slug.localeCompare(b.slug));

      for (let i = 0; i < sortedProducts.length; i++) {
        for (let j = i + 1; j < sortedProducts.length; j++) {
          const pA = sortedProducts[i];
          const pB = sortedProducts[j];

          const dateA = pA.last_hunt_at ? new Date(pA.last_hunt_at) : new Date();
          const dateB = pB.last_hunt_at ? new Date(pB.last_hunt_at) : new Date();
          const mostRecentDate = dateA > dateB ? dateA : dateB;

          comparisonRoutes.push({
            url: `${baseUrl}/comparatif/${pA.slug}-vs-${pB.slug}`,
            lastModified: mostRecentDate,
            changeFrequency: 'weekly',
            priority: 0.6, 
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

  // Fusion globale de toutes les routes pour les indexeurs de Google
  return [...staticRoutes, ...brandRoutes, ...productRoutes, ...comparisonRoutes, ...articleRoutes];
}
