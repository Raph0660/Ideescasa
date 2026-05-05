import { supabase } from '../../../lib/supabase';
import { ComparisonTemplate } from '../../../lib/templates';

export default async function ComparisonPage({ params }) {
  const { slug } = await params; // ex: ["Lelit-Bianca", "Rocket-R58"]
  
  // On transforme les slugs en noms de modèles (en remplaçant les tirets par des espaces)
  const models = slug.map(s => s.replace(/-/g, ' '));

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .in('model', models);

  return (
    <ComparisonTemplate 
      products={products} 
      seo={{ description: `Analyse comparative détaillée entre : ${models.join(' et ')}.` }} 
    />
  );
}
