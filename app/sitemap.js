import { supabase } from '../lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://www.ideescasa.fr';

  let uniqueProducts = [];
  let productRoutes = [];
  let brandRoutes = [];
  let guideRoutes = []; // ◄ AJOUTÉ : Pour stocker les hubs de catégories/guides

  // 1. Récupération dynamique des produits uniques (Vue best_products)
  try {
    const { data: products } = await supabase
      .from('best_products')
      .select('slug, brand, category, updated_at, last_hunt_at, specs, image_url')
      .not('slug', 'is', null);

    if (products) {
      uniqueProducts = products; 
      
      // Fiches produits individuelles
      productRoutes = products.map((product) => ({
        url: `${baseUrl}/machines/${product.slug}`,
        lastModified: product.last_hunt_at ? new Date(product.last_hunt_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

      // Pages marques pSEO
      const rawBrands = products.map(p => p.brand).filter(Boolean);
      const uniqueBrands = [...new Set(rawBrands.map(b => b.toLowerCase()))];

      brandRoutes = uniqueBrands.map((brandSlug) => {
        const brandProducts = products.filter(p => p.brand?.toLowerCase() === brandSlug);
        const latestUpdate = brandProducts.reduce((acc, current) => {
          const currentDate = current.last_hunt_at ? new Date(current.last_hunt_at) : new Date(0);
          return currentDate > acc ? currentDate : acc;
        }, new Date(0));

        return {
          url: `${baseUrl}/marques/${brandSlug}`,
          lastModified: latestUpdate.getTime() === new Date(0).getTime() ? new Date() : latestUpdate,
          changeFrequency: 'daily',
          priority: 0.7,
        };
      });

      // ◄ AJOUTÉ : Pages Guides / Catégories pSEO (ex: /guides/espresso-premium)
      const rawCategories = products.map(p => p.category).filter(Boolean);
      const uniqueCategories = [...new Set(rawCategories.map(c => c.toLowerCase()))];

      guideRoutes = uniqueCategories.map((categorySlug) => {
        const categoryProducts = products.filter(p => p.category?.toLowerCase() === categorySlug);
        const latestUpdate = categoryProducts.reduce((acc, current) => {
          const currentDate = current.last_hunt_at ? new Date(current.last_hunt_at) : new Date(0);
          return currentDate > acc ? currentDate : acc;
        }, new Date(0));

        return {
          url: `${baseUrl}/guides/${categorySlug}`,
          lastModified: latestUpdate.getTime() === new Date(0).getTime() ? new Date() : latestUpdate,
          changeFrequency: 'daily',
          priority: 0.7,
        };
      });
    }
  } catch (e) {
    console.error("Sitemap: Erreur récupération produits, marques et guides", e);
  }

  // 2. GÉNÉRATION DES COMBINAISONS DU COMPARATEUR (ANTI-THIN CONTENT)
  let comparisonRoutes = [];
  try {
    if (uniqueProducts.length > 1) {
      const sortedProducts = [...uniqueProducts].sort((a, b) => a.slug.localeCompare(b.slug));

      const comparableProducts = sortedProducts.filter(p => 
        p.image_url && 
        p.specs && 
        typeof p.specs === 'object' && 
        Object.keys(p.specs).length > 2
      );

      for (let i = 0; i < comparableProducts.length; i++) {
        for (let j = i + 1; j < comparableProducts.length; j++) {
          const pA = comparableProducts[i];
          const pB = comparableProducts[j];

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

  // 3. Récupération dynamique des articles
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
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/politique-confidentialite`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // On fusionne tout le monde, guides inclus !
  return [...staticRoutes, ...brandRoutes, ...guideRoutes, ...productRoutes, ...comparisonRoutes, ...articleRoutes];
}
