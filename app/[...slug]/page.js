import { supabase } from '../../lib/supabase';
import { ProductGridTemplate, ComparisonTemplate, ArticleTemplate, FAQTemplate } from '../../lib/templates';
import configData from '../../data/page-configs.json';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const slugPath = (params.slug || []).join('/');
  const config = configData.pages.find(p => p.slug.join('/') === slugPath);
  
  if (config) return { title: config.seo.title, description: config.seo.description };

  const { data: article } = await supabase.from('articles').select('theme').eq('slug', slugPath).single();
  if (article) return { title: `${article.theme} | MUTHOS` };

  return { title: "Expertise Technique | MUTHOS" };
}

export default async function DynamicPage({ params }) {
  const slugPath = (params.slug || []).join('/');
  const config = configData.pages.find(p => p.slug.join('/') === slugPath);
  
  // 1. LOGIQUE JSON (Pages configurées)
  if (config) {
    if (config.template === 'product-grid') {
      const { data: products } = await supabase.from('products').select('*')
        .ilike('brand', config.brand_filter || '%')
        .eq('category', config.category_filter || 'espresso-premium')
        .gt('price_current', 0).order('price_current', { ascending: false });
      return <ProductGridTemplate products={products || []} seo={config.seo} />;
    }

    if (config.template === 'comparison') {
      const { data: products } = await supabase.from('products').select('*').in('model', config.comparison_models);
      return <ComparisonTemplate products={products || []} seo={config.seo} />;
    }

    if (config.template === 'faq') {
      return <FAQTemplate faqs={config.faqs} seo={config.seo} />;
    }
  }

  // 2. LOGIQUE SUPABASE (Articles longs / Guides)
  const { data: article } = await supabase.from('articles').select('*').eq('slug', slugPath).single();
  if (article) {
    return <ArticleTemplate article={article} />;
  }

  return notFound();
}
