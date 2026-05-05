import React from 'react';

// Fonctions utilitaires pour le prix et la promo
const formatPrice = (price) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price);
const getReduction = (current, catalog) => catalog && catalog > current ? Math.round(((catalog - current) / catalog) * 100) : 0;

// --- TEMPLATE 1 : GRILLE PRODUITS (Pages Marques) ---
export const ProductGridTemplate = ({ products, seo }) => (
  <div className="bg-[#fdfbf7] min-h-screen pb-24">
    <section className="max-w-7xl mx-auto px-6 py-24 border-b border-stone-200">
      <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-6">Expertise MUTHOS</p>
      <h1 className="font-serif text-6xl md:text-8xl mb-12 tracking-tighter text-[#1a1a1a] leading-none">
        {seo?.title?.split('|')[0] || "Catalogue"}
      </h1>
      <p className="text-xl text-stone-600 italic max-w-3xl font-light">{seo?.description}</p>
    </section>
    <section className="max-w-7xl mx-auto px-6 mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {products?.map(p => {
          const reduction = getReduction(p.price_current, p.price_catalog);
          return (
            <article key={p.id} className="group bg-white border border-stone-100 p-8 hover:shadow-2xl transition-all duration-500 relative">
              {reduction > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 z-10">-{reduction}%</div>
              )}
              <a href={p.source_url} target="_blank" rel="noopener noreferrer">
                <div className="aspect-square mb-8 overflow-hidden">
                  <img src={p.image_url} alt={p.model} className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110 duration-700" />
                </div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-amber-800">{p.brand}</p>
                <h2 className="font-serif text-2xl uppercase tracking-tighter text-[#1a1a1a]">{p.model}</h2>
                <div className="flex items-baseline gap-3 mb-4">
                  <p className="font-serif text-xl text-red-600">{formatPrice(p.price_current)}</p>
                  {reduction > 0 && <p className="text-sm text-stone-400 line-through">{formatPrice(p.price_catalog)}</p>}
                </div>
                <p className="text-sm text-stone-500 italic font-light line-clamp-2 border-t border-stone-50 pt-4">{p.description}</p>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  </div>
);

// --- TEMPLATE 3 : TOP 10 RANKING (Pages Top) ---
export const TopListTemplate = ({ products, seo }) => (
  <div className="bg-[#fdfbf7] min-h-screen pb-24">
    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
      <p className="text-[10px] uppercase tracking-[0.4em] text-amber-800 font-bold mb-6">Classement Officiel 2026</p>
      <h1 className="font-serif text-5xl md:text-7xl mb-8 tracking-tighter leading-tight text-[#1a1a1a]">
        {seo?.title?.split('|')[0]}
      </h1>
      <div className="h-px w-24 bg-amber-800 mx-auto mb-8"></div>
      <p className="text-xl text-stone-500 italic font-light leading-relaxed">{seo?.description}</p>
    </section>
    <section className="max-w-5xl mx-auto px-6 space-y-12">
      {products?.map((p, index) => {
        const reduction = getReduction(p.price_current, p.price_catalog);
        return (
          <article key={p.id} className="relative bg-white border border-stone-200 overflow-hidden flex flex-col md:flex-row items-stretch group hover:border-amber-800 transition-colors duration-500">
            <div className="absolute top-0 left-0 bg-[#1a1a1a] text-white w-12 h-12 flex items-center justify-center font-serif text-xl z-10">{index + 1}</div>
            <div className="md:w-1/3 bg-stone-50 p-12 flex items-center justify-center relative">
              {reduction > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1">PROMO</div>
              )}
              <img src={p.image_url} alt={p.model} className="max-h-64 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="md:w-2/3 p-12 flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-widest font-bold text-amber-800 mb-2">{p.brand}</p>
              <h2 className="font-serif text-4xl tracking-tighter text-[#1a1a1a] uppercase mb-4">{p.model}</h2>
              <p className="text-stone-600 font-light italic mb-8">{p.description}</p>
              <div className="flex items-center justify-between pt-8 border-t border-stone-100">
                <div className="flex flex-col">
                  <p className="font-serif text-3xl text-red-600">{formatPrice(p.price_current)}</p>
                  {reduction > 0 && <p className="text-sm text-stone-400 line-through">{formatPrice(p.price_catalog)}</p>}
                </div>
                <a href={p.source_url} target="_blank" className="bg-[#1a1a1a] text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-900 transition-colors">Vérifier le stock</a>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  </div>
);

// Note: ComparisonTemplate, ArticleTemplate, et FAQTemplate restent identiques à ta version mais utilisent price_current.
