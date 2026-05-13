'use client'; // LA LIGNE INDISPENSABLE

import React from 'react';

export default function ProductCard({ product }) {
  const hasPromo = product.price_catalog && product.price_catalog > product.price_current;
  const reduction = hasPromo ? Math.round(((product.price_catalog - product.price_current) / product.price_catalog) * 100) : 0;
  
  const fallbackImage = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop";

  return (
    <article className="group">
      <a href={`/machines/${product.slug}`} className="block">
        <div className="aspect-[4/5] bg-white border border-stone-100 mb-8 overflow-hidden relative flex items-center justify-center p-12 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-stone-200">
          
          {hasPromo && reduction > 0 && (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">
              -{reduction}%
            </div>
          )}

          <img
            src={product.image_url || fallbackImage}
            alt={`Machine à café ${product.brand} ${product.model}`}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = fallbackImage;
              e.target.onerror = null; 
            }}
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-amber-800">{product.brand}</p>
          <h3 className="font-serif text-2xl uppercase tracking-tighter text-[#1a1a1a]">{product.model}</h3>
          <p className="text-stone-400 font-light text-sm line-clamp-2 italic mb-4">{product.description}</p>
          
          <div className="flex items-baseline gap-3">
            <p className="font-serif text-2xl text-red-600">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_current)}
            </p>
            
            {hasPromo && (
              <p className="text-sm text-stone-400 line-through decoration-stone-300">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_catalog)}
              </p>
            )}
          </div>
        </div>
      </a>
    </article>
  );
}
