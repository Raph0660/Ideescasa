import { headers } from 'next/headers';

export default function JsonLd({ product }) {
  const headersList = headers();
  const nonce = headersList.get('x-nonce') || '';
  const huntDate = product.last_hunt_at ? new Date(product.last_hunt_at) : new Date();
  const validUntil = new Date(huntDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

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
    // Injection dynamique des étoiles dans les SERPs Google si disponibles en base
    ...(product.rating_avg && product.review_count > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": parseFloat(product.rating_avg).toFixed(1),
        "reviewCount": parseInt(product.review_count, 10),
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
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
