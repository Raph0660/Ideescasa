import { supabase } from '../../lib/supabase';
import Image from 'next/image';

export const revalidate = 21600; // 6 heures

export default async function EspressoPremiumPage() {
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
    <div className="bg-[#fdfbf7] min-h-screen pb-24 text-[#1a1a1a]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-b border-stone-200">
        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-6">Verticale Haute Performance</p>
        <h1 className="font-serif text-6xl md:text-8xl mb-12 tracking-tighter leading-none">
          Espresso <br/> Premium
        </h1>
        <div className="max-w-3xl space-y-6">
          <p className="text-xl text-stone-600 leading-relaxed font-light italic">
            "L'aboutissement de décennies d'ingénierie thermique italienne au service d'une extraction parfaite."
          </p>
          <p className="text-stone-500 leading-relaxed">
            MUTHOS décortique la thermodynamique, les matériaux et l'ergonomie des machines d'exception. 
            PID de précision, chaudières double paroi, groupes E61 massifs : nous analysons les faits 
            techniques qui justifient un investissement de 2 000€ à 8 000€.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-3 gap-px bg-stone-200 border border-stone-200 shadow-sm">
          <div className="bg-[#fdfbf7] p-8 text-center">
            <p className="text-3xl font-serif text-amber-800">{products?.length || 0}</p>
            <p className="text-[9px] uppercase tracking-widest text-stone-400 mt-2">Machines Analysées</p>
          </div>
          <div className="bg-[#fdfbf7] p-8 text-center">
            <p className="text-3xl font-serif text-amber-800">{Object.keys(byBrand).length}</p>
            <p className="text-[9px] uppercase tracking-widest text-stone-400 mt-2">Marques Couvertes</p>
          </div>
          <div className="bg-[#fdfbf7] p-8 text-center">
            <p className="text-3xl font-serif text-amber-800">
              {products && products.length > 0
                ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(
                    Math.round(products.reduce((sum, p) => sum + p.price_current, 0) / products.length)
                  )
                : '—'}
            </p>
            <p className="text-[9px] uppercase tracking-widest text-stone-400 mt-2">Investissement Moyen</p>
          </div>
        </div>
      </section>

      {/* List by Brand */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        {Object.entries(byBrand).map(([brand, brandProducts]) => (
          <div key={brand} className="mb-32">
            <h2 className="font-serif text-5xl mb-12 border-b border-stone-200 pb-6 tracking-tighter uppercase">{brand}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {brandProducts.map((product) => (
                <a key={product.id} href={product.source_url} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="aspect-square bg-white border border-stone-100 mb-6 flex items-center justify-center p-10 overflow-hidden relative transition-all duration-500 group-hover:shadow-xl">
                    <img
                      src={product.image_url}
                      alt={product.model}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-serif text-2xl mb-2 group-hover:text-amber-800 transition-colors uppercase tracking-tighter">{product.model}</h3>
                  <p className="text-sm text-stone-500 font-light line-clamp-2 italic mb-4">{product.description}</p>
                  <p className="text-xl font-serif text-amber-900">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_current)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
