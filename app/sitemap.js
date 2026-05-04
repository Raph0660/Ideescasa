import { supabase } from '../lib/supabase';
import configData from '../data/page-config.json';

export default async function sitemap() {
  const baseUrl = 'https://www.muthos-empire.com';

  // 1. SOURCE A : Récupérer dynamiquement tous les SLUGS d'articles dans Supabase
  const { data: articles } = await supabase
    .from('articles')
    .select('slug');

  const articlePages = (articles || []).map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 2. SOURCE B : Les pages de catégories définies dans ton JSON
  const configPages = configData.pages.map((page) => ({
    url: `${baseUrl}/${page.slug.join('/')}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. SOURCE C : La page d'accueil
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // FUSION de toutes les sources
  return [...staticPages, ...configPages, ...articlePages];
}
