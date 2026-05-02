import { createClient } from '@/lib/supabase';
import Image from 'next/image';

export const revalidate = 21600; // 6 heures

export default async function EspressoPremiumPage() {
  const supabase = createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'espresso-premium')
    .gt('price_current', 0)
    .order('price_current', { ascending: false });

  // Grouper par marque
  const byBrand = products?.reduce((acc, product) => {
    if (!acc[product.brand]) {
      acc[product.brand] = [];
    }
    acc[product.brand].push(product);
    return acc;
  }, {}) || {};

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <section className="mb-20">
        <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
          Verticale Premium
        </p>
        <h1 className="font-serif text-6xl md:text-7xl mb-8 tracking-tight">
          Espresso Premium
        </h1>
        <div className="prose prose-lg max-w-3xl">
          <p className="text-xl text-gray-700 leading-relaxed">
            Les machines espresso semi-professionnelles représentent l'aboutissement 
            de décennies d'ingénierie thermique italienne. PID de précision, chaudières 
            double paroi, groupes E61 massifs : chaque composant est dimensionné pour 
            une extraction parfaite, shot après shot.
          </p>
          <p className="text-gray-600 mt-4">
            MUTHOS décortique la thermodynamique, les matériaux et l'ergonomie de ces 
            machines d'exception. Pas de marketing, seulement les faits techniques qui 
            justifient l'investissement de 2 000€ à 8 000€.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-3 gap-8 mb-16 p-8 bg-gray-50 border border-gray-200">
        <div className="text-center">
          <p className="text-4xl font-bold text-amber-700">{products?.length || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Machines Analysées</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-amber-700">
            {Object.keys(byBrand).length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Marques Couvertes</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-amber-700">
            {products && products.length > 0
              ? new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 0,
                }).format(
                  Math.round(
                    products.reduce((sum, p) => sum + p.price_current, 0) /
                      products.length
                  )
                )
              : '—'}
          </p>
          <p className="text-sm text-gray-600 mt-1">Prix Moyen</p>
        </div>
      </section>

      {/* Products by Brand */}
      {Object.entries(byBrand).map(([brand, brandProducts]) => (
        <section key={brand} className="mb-16">
          <h2 className="font-serif text-4xl mb-8 border-b border-gray-200 pb-4">
            {brand}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brandProducts.map((product) => (
              <a
                key={product.id}
                href={product.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-200 hover:border-amber-700 
                         transition-all duration-300 hover:shadow-lg"
              >
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

                <div className="p-6">
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
        </section>
      ))}
    </div>
  );
}
