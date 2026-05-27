import { supabase } from '../lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://www.ideescasa.fr';

  let uniqueProducts = [];
  let productRoutes = [];
  let brandRoutes = [];

  // 1. Récupération dynamique des produits uniques (Vue best_products)
  try {
    const { data: products } = await supabase
      .from('best_products')
      .select('slug, last_hunt_at, updated_at, brand') // ◄ AJOUTÉ : updated_at pour traquer les changements de prix
      .not('slug', 'is', null);

    if (products) {
      uniqueProducts = products; 
      
      // Génération des fiches produits individuelles
      productRoutes = products.map((product) => {
        // Priorité à la date de changement de prix, sinon date du dernier scrap
        const exactDate = product.updated_at || product.last_hunt_at;
        
        return {
          url: `${baseUrl}/machines/${product.slug}`,
          lastModified: exactDate ? new Date(exactDate).toISOString() : new Date().toISOString(), // ◄ Format ISO strict
          changeFrequency: 'weekly',
          priority: 0.8,
        };
      });

      // GÉNÉRATION DYNAMIQUE DES PAGES MARQUES (pSEO)
      const rawBrands = products.map(p => p.brand).filter(Boolean);
      const uniqueBrands = [...new Set(rawBrands.map(b => b.toLowerCase()))];

      brandRoutes = uniqueBrands.map((brandSlug) => {
        const brandProducts = products.filter(p => p.brand?.toLowerCase() === brandSlug);
        
        const latestUpdate = brandProducts.reduce((acc, current) => {
          const checkDate = current.updated_at || current.last_hunt_at;
          const currentDate = checkDate ? new Date(checkDate) : new Date(0);
          return currentDate > acc ? currentDate : acc;
        }, new Date(0));

        return {
          url: `${baseUrl}/marques/${brandSlug}`,
          lastModified: latestUpdate.getTime() === new Date(0).getTime() ? new Date().toISOString() : latestUpdate.toISOString(),
          changeFrequency: 'daily',
          priority: 0.7,
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

          const dateA = new Date(pA.updated_at || pA.last_hunt_at || Date.now());
          const dateB = new Date(pB.updated_at || pB.last_hunt_at || Date.now());
          const mostRecentDate = dateA > dateB ? dateA : dateB;

          comparisonRoutes.push({
            url: `${baseUrl}/comparatif/${pA.slug}-vs-${pB.slug}`,
            lastModified: mostRecentDate.toISOString(),
            changeFrequency: 'weekly',
            priority: 0.6, 
          });
        }
      }
    }
