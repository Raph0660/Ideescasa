'use client'; // ◄ Spécifie à Next.js que ce bloc gère l'interactivité client

import { getImageProps } from '@/lib/imageService';

export default function SafeImage({ product, className }) {
  return (
    <img 
      {...getImageProps(product)} 
      className={className} 
    />
  );
}
