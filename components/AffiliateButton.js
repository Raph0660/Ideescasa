'use client';

import React from 'react';

export default function AffiliateButton({ url, merchantName = "le marchand", price }) {
  if (!url) return null;

  return (
    <a 
      href={url}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="block w-full bg-red-600 hover:bg-red-700 text-white text-center font-bold uppercase tracking-widest py-4 px-6 transition-colors duration-300"
    >
      Voir l'offre chez {merchantName} {price ? `à ${price}€` : ''}
    </a>
  );
}
