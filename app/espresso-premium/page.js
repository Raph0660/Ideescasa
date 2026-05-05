import { supabase } from '../../lib/supabase';

export const revalidate = 21600;

export default async function EspressoPremiumPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'espresso-premium')
    .gt('price_current', 0)
    .order('brand', { ascending: true });

  const byBrand = products?.reduce((acc, product) => {
    if (!acc[product.brand]) acc[product.brand] = [];
    acc[product.brand].push(product);
    return acc;
  }, {}) || {};

  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-24 text-[#1a1a1a]">
      <header className="max-w-7xl mx-auto px-6 py-24 border-b border-stone-200">
        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-6">Verticale Haute Performance</p>
        <h1 className="font-serif text-6xl md:text-8xl mb-12 tracking-tighter leading-none text-[#1a1a1a]">
          Espresso <br/> Premium
        </h1>
        <div className="max-w-3xl space-y-6">
          <p className="text-xl text-stone-600 leading-relaxed font-light italic">"L'aboutissement de décennies d'ingénierie thermique au service d'une extraction parfaite."</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 mt-24">
        {Object.entries(byBrand).map(([brand, brandProducts]) => (
          <div key={brand} className="mb-32">
            <h2 className="font-serif text-5xl mb-12 border-b border-stone-200 pb-6 tracking-tighter uppercase">{brand}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {brandProducts.map((product) => {
                const hasPromo = product.price_catalog > product.price_current;
                return (
                  <a key={product.id} href={product.source_url} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="aspect-square bg-white border border-stone-100 mb-6 flex items-center justify-center p-10 overflow-hidden relative transition-all duration-500 group-hover:shadow-xl">
                      {hasPromo && <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase">Offre</div>}
                      <img src={product.image_url} alt={product.model} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <h3 className="font-serif text-2xl mb-2 uppercase tracking-tighter">{product.model}</h3>
                    <div className="flex items-baseline gap-3 mb-4">
                       <p className="text-xl font-serif text-red-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_current)}</p>
                       {hasPromo && <p className="text-sm text-stone-400 line-through">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_catalog)}</p>}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
