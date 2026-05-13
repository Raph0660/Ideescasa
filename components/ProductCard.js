'use client'; 

import React from 'react';

export default function ProductCard({ product }) {
  const hasPromo = product.price_catalog && product.price_catalog > product.price_current;
  const reduction = hasPromo ? Math.round(((product.price_catalog - product.price_current) / product.price_catalog) * 100) : 0;
  
  const fallbackImage = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop";

  return (
    <article className="group">
      <a href={`/machines/${product.slug}`} className="block">
        {/* Container Image : On garde un fond blanc propre sans le multiply qui assombrit */}
        <div className="aspect-[4/5] bg-white border border-stone-100 mb-8 overflow-hidden relative flex items-center justify-center p-12 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-stone-200">
          
          {hasPromo && reduction > 0 && (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">
              -{reduction}%
            </div>
          )}

          <img
            src={product.image_url || fallbackImage}
            alt={`Machine à café ${product.brand} ${product.model}`}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = fallbackImage;
              e.target.onerror = null; 
            }}
          />
        </div>

        {/* Bloc Texte : Équilibrage visuel */}
        <div className="space-y-1">
          {/* Marque : Plus lisible et autoritaire */}
          <p className="text-[12px] uppercase tracking-[0.2em] font-extrabold text-amber-800/80">
            {product.brand}
          </p>
          
          {/* Modèle : Humanisation des références techniques (ex: Smeg BCC13) */}
          <h3 className="font-serif text-xl md:text-2xl uppercase tracking-tighter text-[#1a1a1a] leading-tight mb-2">
            {product.model.length < 12 ? `Machine ${product.model}` : product.model}
          </h3>
          
          {/* Description : Hauteur mini pour l'alignement des prix dans la grille */}
          <p className="text-stone-400 font-light text-xs line-clamp-2 italic mb-4 min-h-[32px]">
            {product.description}
          </p>
          
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
