import { headers } from 'next/headers';

export default function JsonLd({ product }) {
  const headersList = headers();
  const nonce = headersList.get('x-nonce') || '';

  // Calcul automatique : Offre valide pendant 30 jours après la dernière mise à jour du robot
  const huntDate = product.last_hunt_at ? new Date(product.last_hunt_at) : new Date();
  const validUntil = new Date(huntDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const jsonSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${product.brand} ${product.model}`,
    "description": product.description || `Analyse technique approfondie et comparatif de prix pour la machine expresso ${product.brand} ${product.model}.`,
    "image": product.image_url,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "price": product.price_current,
      "priceCurrency": "EUR",
      "priceValidUntil": validUntil,
      "availability": "https://schema.org/InStock",
      "url": `https://www.ideescasa.fr/machines/${product.slug}`
    }
  };

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonSchema) }}
    />
  );
}
