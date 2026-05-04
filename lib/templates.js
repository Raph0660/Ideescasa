import React from 'react';

export const ProductGridTemplate = ({ products, seo }) => {
  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-24">
      <section className="max-w-7xl mx-auto px-6 py-24 border-b border-stone-200">
        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-6">Verticale MUTHOS</p>
        <h1 className="font-serif text-6xl md:text-8xl mb-12 tracking-tighter leading-none text-[#1a1a1a]">
          {seo.title.split('|')[0]}
        </h1>
        <p className="text-xl text-stone-600 leading-relaxed font-light italic max-w-3xl">
          {seo.description}
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {products?.map((product) => (
            <article key={product.id} className="group">
              <a href={product.source_url} target="_blank" rel="noopener noreferrer">
                <div className="aspect-square bg-white border border-stone-100 mb-8 flex items-center justify-center p-12 overflow-hidden relative transition-all duration-700 group-hover:shadow-2xl">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.model} 
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <span className="text-2xl font-serif text-stone-200 uppercase tracking-widest">Muthos</span>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-amber-800">{product.brand}</p>
                  <h2 className="font-serif text-2xl uppercase tracking-tighter text-[#1a1a1a]">{product.model}</h2>
                  <p className="font-serif text-xl text-[#1a1a1a]">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_current)}
                  </p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
