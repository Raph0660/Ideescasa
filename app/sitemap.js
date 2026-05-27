import { supabase } from '../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = 'https://www.ideescasa.fr';

  try {
    // 1. Extraction des données produits nécessaires (Specs, Slugs, Marques et Catégories)
    const { data: products } = await supabase
      .from('best_products')
      .select('slug, brand, category, updated_at, last_hunt_at')
      .not('slug', 'is', null);

    // 2. Extraction des articles du Lab (Blog informatique)
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, reviewed_at');

    // Initialisation avec la page d'accueil
    const entries = [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];

    if (products && products.length > 0) {
      // A. GÉNÉRATION DES FICHES PRODUITS
      products.forEach((product) => {
        const dateRaw = product.updated_at || product.last_hunt_at || new Date();
        entries.push({
          url: `${baseUrl}/machines/${product.slug}`,
          lastModified: new Date(dateRaw).toISOString(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });

      // B. GÉNÉRATION DYNAMIQUE DES PAGES MARQUES (pSEO)
      const rawBrands = products.map((p) => p.brand).filter(Boolean);
      const uniqueBrands = [...new Set(rawBrands.map((b) => b.toLowerCase()))];

      uniqueBrands.forEach((brandSlug) => {
        const brandProducts = products.filter((p) => p.brand?.toLowerCase() === brandSlug);
        const latestUpdate = brandProducts.reduce((acc, current) => {
          const checkDate = current.updated_at || current.last_hunt_at;
          const currentDate = checkDate ? new Date(checkDate) : new Date(0);
          return currentDate > acc ? currentDate : acc;
        }, new Date(0));

        entries.push({
          url: `${baseUrl}/marques/${brandSlug}`,
          lastModified: latestUpdate.getTime() === new Date(0).getTime() ? new Date().toISOString() : latestUpdate.toISOString(),
          changeFrequency: 'daily',
          priority: 0.7,
        });
      });

      // ◄ NOUVEAU ► C. GÉNÉRATION DYNAMIQUE DES PAGES GUIDES / CATÉGORIES (pSEO)
      const rawCategories = products.map((p) => p.category).filter(Boolean);
      const uniqueCategories = [...new Set(rawCategories.map((c) => c.toLowerCase()))];

      uniqueCategories.forEach((catSlug) => {
        const catProducts = products.filter((p) => p.category?.toLowerCase() === catSlug);
        const latestUpdate = catProducts.reduce((acc, current) => {
          const checkDate = current.updated_at || current.last_hunt_at;
          const currentDate = checkDate ? new Date(checkDate) : new Date(0);
          return currentDate > acc ? currentDate : acc;
        }, new Date(0));

        entries.push({
          url: `${baseUrl}/guides/${catSlug}`,
          lastModified: latestUpdate.getTime() === new Date(0).getTime() ? new Date().toISOString() : latestUpdate.toISOString(),
          changeFrequency: 'daily',
          priority: 0.7,
        });
      });

      // D. MOTEUR pSEO : Combinaisons croisées du Comparateur (Duels)
      const sortedProducts = [...products].sort((a, b) => a.slug.localeCompare(b.slug));
      for (let i = 0; i < sortedProducts.length; i++) {
        for (let j = i + 1; j < sortedProducts.length; j++) {
          const pA = sortedProducts[i];
          const pB = sortedProducts[j];

          const dateA = pA.updated_at || pA.last_hunt_at || new Date();
          const dateB = pB.updated_at || pB.last_hunt_at || new Date();
          const mostRecentDate = new Date(dateA) > new Date(dateB) ? dateA : dateB;

          entries.push({
            url: `${baseUrl}/comparatif/${pA.slug}-vs-${pB.slug}`,
            lastModified: new Date(mostRecentDate).toISOString(),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      }
    }

    // E. GÉNÉRATION DES ARTICLES DU LAB (Le Blog)
    if (articles && articles.length > 0) {
      articles.forEach((article) => {
        const dateRaw = article.reviewed_at || new Date();
        entries.push({
          url: `${baseUrl}/article/${article.slug}`,
          lastModified: new Date(dateRaw).toISOString(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }

    return entries;

  } catch (error) {
    console.error('Erreur lors de la compilation du sitemap unifié:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
