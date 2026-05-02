import { createClient } from '@/lib/supabase';
import Image from 'next/image';

// Revalidation toutes les 6 heures
export const revalidate = 21600;

export default async function HomePage() {
  const supabase = createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'espresso-premium')
    .gt('price_current', 0)
    .order('last_hunt_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Erreur Supabase:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="font-serif text-6xl md:text-7xl mb-6 tracking-tight">
          L'Ingénierie<br/>
          de l'Espresso d'Exception
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Analyses techniques approfondies des machines espresso semi-professionnelles. 
          Thermodynamique, PID, matériaux : le verdict sans compromis.
        </p>
      </section>

      {/* Product Grid */}
      <section>
        <h2 className="font-serif text-3xl mb-8 flex items-center gap-3">
          <span className="text-4xl">⚙️</span>
          Les Machines Chassées
        </h2>

        {!products || products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="font-serif text-xl">Le Hunter est en mission...</p>
            <p className="text-sm mt-2">Premières analyses en cours</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <a
                key={product.id}
                href={product.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-200 hover:border-amber-700 
                         transition-all duration-300 hover:shadow-lg"
              >
                {/* Image */}
                <div className="aspect-square relative bg-gray-50 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={`${product.brand} ${product.model}`}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      ☕
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    {product.brand}
                  </p>
                  <h3 className="font-serif text-2xl mb-3 group-hover:text-amber-700 transition-colors">
                    {product.model}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {product.price_current > 0 && (
                    <p className="text-2xl font-bold text-amber-700">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 0,
                      }).format(product.price_current)}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-4 group-hover:text-amber-700 transition-colors">
                    Voir le produit →
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mt-24 bg-gray-50 border border-gray-200 p-12 text-center">
        <p className="font-serif text-3xl mb-4">Pourquoi MUTHOS ?</p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-8">
          <div>
            <p className="text-4xl mb-3">🔬</p>
            <p className="font-semibold mb-2">Analyses Techniques</p>
            <p className="text-sm text-gray-600">
              Thermodynamique, PID, profiling de pression : l'ingénierie décryptée
            </p>
          </div>
          <div>
            <p className="text-4xl mb-3">⚖️</p>
            <p className="font-semibold mb-2">Verdict Objectif</p>
            <p className="text-sm text-gray-600">
              Zéro marketing. Seulement les faits et les mesures qui comptent.
            </p>
          </div>
          <div>
            <p className="text-4xl mb-3">🎯</p>
            <p className="font-semibold mb-2">Sélection Premium</p>
            <p className="text-sm text-gray-600">
              Uniquement les machines semi-pro qui méritent votre investissement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
