// 1. NE PAS utiliser 'force-dynamic' ici
// 2. On garde revalidate pour l'ISR (perf optimale)
export const revalidate = 86400; 

export async function generateStaticParams() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('slug')
      .not('slug', 'is', null);

    if (error) throw error;

    // PROTECTION : On filtre strictement pour n'envoyer que des slugs valides
    return products
      ?.filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
      .map((p) => ({ slug: p.slug })) || [];
      
  } catch (err) {
    console.error('Erreur critique dans generateStaticParams:', err);
    // En cas d'erreur fatale, on retourne un tableau vide 
    // pour que le build puisse continuer sans crash
    return [];
  }
}

// Dans ton composant ProductPage, on garde le maybeSingle() 
// pour la protection à l'exécution :
export default async function ProductPage({ params }) {
  const { slug } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!product) notFound();
  
  // ... reste de ton code ...
}
