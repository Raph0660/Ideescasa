import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

// TÂCHE 5 : GENRATE METADATA FUSIONNÉ (SEO + NOINDEX DYNAMIQUE)
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const hasFilters = Object.keys(params).length > 0;

  return {
    title: "IdeesCasa | Curateur d'Excellence pour la Maison & Café de Spécialité",
    description: "Héritier d'une passion pour l'art de vivre, IdeesCasa sélectionne pour vous le meilleur de l'équipement domestique et des machines espresso premium.",
    alternates: {
      canonical: 'https://www.ideescasa.fr',
    },
    openGraph: {
      title: 'IdeesCasa - L’Excellence au Meilleur Prix',
      description: 'Le comparateur premium pour sublimer votre intérieur.',
      url: 'https://www.ideescasa.fr',
      siteName: 'IdeesCasa',
      locale: 'fr_FR',
      type: 'website',
    },
    // Si l'URL a des filtres de tri (?sort=...), on masque à Google sans bloquer le jus de lien
    robots: hasFilters 
      ? { index: false, follow: true } 
      : { index: true, follow: true },
  };
}

// ISR : Revalidation toutes les 24h
export const revalidate = 86400;

export default async function HomePage() {
  // Récupération des machines avec meilleure source (source_priority ASC)
  const { data: latestProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'espresso-premium')
    .gt('price_current', 0)
    .order('slug', { ascending: true })
    .order('source_priority', { ascending: true })
    .order('last_hunt_at', { ascending: false })
    .limit(50);

  // Filtrer les doublons (garder un seul par slug)
  const seen = new Set();
  const uniqueProducts = latestProducts?.filter(p => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  }).slice(0, 12) || [];

  return (
    <div className="bg-[#fdfbf7]">
      {/* 1. HERO SECTION - Le Pont Sémantique */}
      <section className="pt-32 pb-20 px-6 text-center border-b border-stone-200">
        <span className="text-[10px] uppercase tracking-[0.4em] mb-8 block opacity-50 font-bold text-stone-800">
          L'Héritage de l'Excellence Domestique — IdeesCasa
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6 tracking-tighter leading-tight text-[#1a1a1a]">
          L'Art de Vivre <br className="hidden md:block" /> au Meilleur Prix
        </h1>
        <p className="text-stone-500 max-w-2xl mx-auto font-light italic text-lg leading-relaxed">
          Héritier d'une passion pour l'excellence domestique, <strong>IdeesCasa</strong> devient votre curateur spécialisé. Des conseils d'aménagement au choix du matériel de pointe, nous traquons quotidiennement les meilleures opportunités sur les <strong>machines espresso premium</strong> pour sublimer votre intérieur.
        </p>
      </section>

      {/* 2. PRODUCT GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <h2 className="font-serif text-4xl tracking-tight uppercase text-[#1a1a1a]">Les Meilleures Offres</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {uniqueProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {(!uniqueProducts || uniqueProducts.length === 0) && (
           <div className="text-center py-20 text-stone-400 font-serif italic">
             Les offres sont en cours d'actualisation...
           </div>
        )}
      </section>

      {/* 3. BLOC CONFIANCE / E-E-A-T (Le Pont Sémantique) */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-stone-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl mb-6 text-[#1a1a1a]">L'Art de Vivre, de la Décoration au Rituel</h2>
            <p className="text-stone-500 font-light leading-relaxed mb-6">
              Depuis sa création, <strong>IdeesCasa</strong> a pour mission d'accompagner les Français dans l'embellissement de leur foyer. Mais une maison ne se résume pas à son esthétique ; elle se vit à travers ses rituels. 
            </p>
            <p className="text-stone-500 font-light leading-relaxed">
              C'est why notre rédaction a choisi de se spécialiser dans l'élément central de la cuisine moderne : <strong>la machine espresso de spécialité</strong>. Nous appliquons la même exigence de design et de qualité que nous avions pour la décoration pour vous aider à choisir l'équipement qui transformera votre quotidien.
            </p>
          </div>
          <div className="bg-stone-50 p-8 rounded-sm border border-stone-100">
            <h4 className="font-serif text-lg mb-4 italic">Notre Indépendance</h4>
            <p className="text-xs text-stone-400 leading-relaxed italic">
              Nous ne recevons aucun produit gratuitement. Nos recommandations sont basées sur l'analyse croisée de données techniques, de retours d'utilisateurs et de la stabilité des prix du marché premium.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
