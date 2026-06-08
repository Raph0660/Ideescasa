import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Génère de belles balises meta SEO automatiques pour chaque catégorie
export async function generateMetadata({ params }) {
  const categoryName = params.category.replace(/-/g, ' ');
  return {
    title: `Les Meilleures Machines Expresso ${categoryName} — Idées Casa`,
    description: `Découvrez notre sélection et comparatif technique des machines à café ${categoryName} sélectionnées pour leur rapport qualité/prix.`,
  };
}

export default async function CategoryPage({ params }) {
  // Récupération des machines de cette catégorie, triées par prix décroissant
  const { data: products } = await supabase
    .from('best_products')
    .select('*')
    .eq('category', params.category)
    .order('price_current', { ascending: false });

  if (!products || products.length === 0) {
    return <div className="p-10 text-center">Aucune machine trouvée dans cette catégorie.</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold capitalize mb-2">
        Guide d'Achat : Machines Expresso {params.category.replace(/-/g, ' ')}
      </h1>
      <p className="text-gray-600 mb-8">
        Analyses techniques indépendantes basées sur les spécifications réelles du marché en mai 2026.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-xl p-5 shadow-sm bg-white flex flex-col justify-between">
            <div>
              <img src={product.image_url} alt={product.model} className="w-48 h-48 object-contain mx-auto mb-4" />
              <span className="text-xs font-semibold uppercase px-2 py-1 bg-amber-100 text-amber-800 rounded">
                {product.brand}
              </span>
              <h2 className="text-xl font-bold mt-2 mb-4">{product.model}</h2>
              
              {/* FIX CLAUDE : Affichage dynamique des specs sécurisé avec l'optional chaining ?. */}
              <ul className="text-sm text-gray-600 space-y-1 mb-6">
                {product.specs?.pression_bars && <li>⚡ Pression : {product.specs.pression_bars} bars</li>}
                {product.specs?.reservoir_eau_litres && <li>💧 Réservoir : {product.specs.reservoir_eau_litres} L</li>}
                {product.specs?.broyeur_integre && <li>🌾 Broyeur de grains : Oui</li>}
              </ul>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-black text-red-600">{product.price_current}€</span>
                {product.price_catalog > product.price_current && (
                  <span className="text-sm text-gray-400 line-through">{product.price_catalog}€</span>
                )}
              </div>
              <Link href={`/machines/${product.slug}`} className="block text-center w-full bg-neutral-900 text-white font-medium py-2.5 rounded-lg hover:bg-neutral-800 transition">
                Voir l'Analyse Expert
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
