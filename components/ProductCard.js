'use client'; 
import React from 'react';

export default function ProductCard({ product }) {
  const fallback = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800";
  const hasPromo = product.price_catalog && product.price_catalog > product.price_current;

  return (
    <article className="group border border-stone-100 p-4 bg-white">
      <a href={`/machines/${product.slug}`}>
        <div className="aspect-square mb-4 flex items-center justify-center overflow-hidden">
          <img 
            src={product.image_url || fallback} 
            alt={product.model}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">{product.brand}</p>
          <h3 className="font-serif text-xl uppercase mb-2 line-clamp-1">{product.model}</h3>
          <p className="text-red-600 font-bold text-xl">{product.price_current}€</p>
        </div>
      </a>
    </article>
  );
}
