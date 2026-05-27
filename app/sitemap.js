import { supabase } from '../lib/supabase'; // ◄ Vérifie bien que le chemin vers ton client Supabase est exact

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = 'https://www.ideescasa.fr';

  try {
    // 1. Récupération des machines pour les fiches produits et les duels comparatifs
    const { data: products } = await supabase
      .from('best_products')
      .select('slug, updated_at, last_hunt_at');

    // 2. Récupération des articles du Lab (Blog)
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, reviewed_at');

    // Initialisation du sitemap avec la racine
    const entries = [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];

    // Génération des URLs pour les fiches machines
    if (products && products.length > 0) {
      products.forEach((product) => {
        const dateRaw = product.updated_at || product.last_hunt_at || new Date();
        entries.push({
          url: `${baseUrl}/machines/${product.slug}`,
          lastModified: new Date(dateRaw).toISOString(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });

      // MOTEUR pSEO : Génération croisée mathématique des duels de comparaison
      for (let i = 0; i < products.length; i++) {
        for (let j = i + 1; j < products.length; j++) {
          const slugA = products[i].slug;
          const slugB = products[j].slug;

          // Tri alphabétique strict (Règle canonique d'Idées Casa : 1 seule URL par paire)
          const sortedSlugs = [slugA, slugB].sort();
          const duelSlug = `${sortedSlugs[0]}-vs-${sortedSlugs[1]}`;

          // Détermination du timestamp le plus frais entre les deux machines
          const dateA = products[i].updated_at || products[i].last_hunt_at || new Date();
          const dateB = products[j].updated_at || products[j].last_hunt_at || new Date();
          const latestDate = new Date(dateA) > new Date(dateB) ? dateA : dateB;

          entries.push({
            url: `${baseUrl}/comparatif/${duelSlug}`,
            lastModified: new Date(latestDate).toISOString(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    }

    // Génération des URLs pour les articles du Lab
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
    console.error('Erreur critique lors de la génération du sitemap:', error);
    
    // FILET DE SÉCURITÉ : Renvoie au moins la Home si la DB ne répond pas au build
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
