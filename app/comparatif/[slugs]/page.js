import { supabase } from '@/lib/supabase';
import { notFound, permanentRedirect } from 'next/navigation';
import { ArrowLeft, Scale, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { headers } from 'next/headers';

export const revalidate = 86400; // ISR 24h

// TÂCHE 8 : PHRASES SÉMANTIQUES BASÉES SUR LES VRAIES CLÉS N8N (ANTI-THIN CONTENT)
function buildComparisonInsights(pA, pB) {
  const insights = [];
  
  // 1. Comparaison Réservoir d'eau
  if (pA.specs?.reservoir_eau_litres && pB.specs?.reservoir_eau_litres) {
    const diff = Math.abs(pA.specs.reservoir_eau_litres - pB.specs.reservoir_eau_litres).toFixed(1);
    if (parseFloat(diff) > 0) {
      const master = pA.specs.reservoir_eau_litres > pB.specs.reservoir_eau_litres ? pA : pB;
      insights.push(`Côté autonomie, la ${master.brand} ${master.model} se distingue avec un réservoir plus généreux (écart de ${diff} litres).`);
    }
  }
  
  // 2. Comparaison Présence d'un Broyeur de grains
  if (pA.specs?.broyeur_integre !== undefined && pB.specs?.broyeur_integre !== undefined) {
    if (pA.specs.broyeur_integre !== pB.specs.broyeur_integre) {
      const withGrinder = pA.specs.broyeur_integre ? pA : pB;
      insights.push(`Différence majeure de conception : la ${withGrinder.brand} ${withGrinder.model} intègre un broyeur de grains, idéal pour la fraîcheur du café, contrairement à sa rivale.`);
    }
  }

  // 3. Comparaison Capacité du bac à grains (si les deux ont un broyeur)
  if (pA.specs?.capacite_grains_grammes && pB.specs?.capacite_grains_grammes) {
    const diffGrains = Math.abs(pA.specs.capacite_grains_grammes - pB.specs.capacite_grains_grammes);
    if (diffGrains > 0) {
      const master = pA.specs.capacite_grains_grammes > pB.specs.capacite_grains_grammes ? pA : pB;
      // FIX CLAUDE : Remplacement de "offers" par "offre"
      insights.push(`Le réservoir à grains de la ${master.brand} ${master.model} offre une meilleure capacité avec une réserve supérieure de ${diffGrains} grammes.`);
    }
  }

  // 4. Comparaison Puissance Électrique
  if (pA.specs?.puissance_watts && pB.specs?.puissance_watts) {
    if (pA.specs.puissance_watts !== pB.specs.puissance_watts) {
      const master = pA.specs.puissance_watts > pB.specs.puissance_watts ? pA : pB;
      insights.push(`Sur le plan thermique, la ${master.brand} ${master.model} développe une puissance supérieure (${master.specs?.puissance_watts}W) garantissant une montée en température rapide.`);
    }
  }

  // 5. Comparaison de la Pression de la pompe
  if (pA.specs?.pression_bars && pB.specs?.pression_bars) {
    if (pA.specs.pression_bars !== pB.specs.pression_bars) {
      const master = pA.specs.pression_bars > pB.specs.pression_bars ? pA : pB;
      insights.push(`La pompe de la ${master.brand} ${master.model} affiche une pression nominale plus élevée avec ${master.specs?.pression_bars} Bars.`);
    }
  }

  // 6. Comparaison Économique (Prix actuel)
  if (pA.price_current && pB.price_current) {
    const diffPrice = Math.abs(pA.price_current - pB.price_current);
    if (diffPrice > 0) {
      const cheaper = pA.price_current < pB.price_current ? pA : pB;
      insights.push(`Financièrement, l'option la plus accessible au budget est la ${cheaper.brand} ${cheaper.model}, offrant une économie immédiate de ${diffPrice}€.`);
    }
  }

  return insights;
}

// SEO : METADATA DYNAMIQUES
export async function generateMetadata({ params }) {
  const { slugs } = await params;
  if (!slugs.includes('-vs-')) return { title: "Comparateur Premium | Idées Casa" };

  const [slugA, slugB] = slugs.split('-vs-');
  const { data: products } = await supabase.from('best_products').select('brand, model').in('slug', [slugA, slugB]);

  if (!products || products.length < 2) return { title: "Match Indisponible | Idées Casa" };

  const title = `Comparatif ${products[0].brand} ${products[0].model} vs ${products[1].brand} ${products[1].model} : Lequel Choisir ?`;
  const description = `Duel technique et comparateur de prix en temps réel : ${products[0].brand} ${products[0].model} ou ${products[1].brand} ${products[1].model}. Découvrez le verdict de nos experts.`;

  return { title, description };
}

export default async function ComparisonPage({ params }) {
  const { slugs } = await params;
  if (!slugs.includes('-vs-')) notFound();

  const [slugA, slugB] = slugs.split('-vs-');

  // TÂCHE 7 : REDIRECTION INTERNE 301 POUR L'ORDRE ALPHABÉTIQUE
  const [canonicalA, canonicalB] = [slugA, slugB].sort();
  if (slugA !== canonicalA || slugB !== canonicalB) {
    permanentRedirect(`/comparatif/${canonicalA}-vs-${canonicalB}`);
  }

  // Lecture de la vue SQL consolidée
  const { data: rawProducts } = await supabase.from('best_products').select('*').in('slug', [slugA, slugB]);

  const productA = rawProducts?.find(p => p.slug === slugA);
  const productB = rawProducts?.find(p => p.slug === slugB);

  if (!productA || !productB) notFound();

  const insights = buildComparisonInsights(productA, productB);

  // Détection des promos pour l'UI et le Schéma
  const hasPromoA = productA.price_catalog && productA.price_catalog > productA.price_current;
  const reductionA = hasPromoA ? Math.round(((productA.price_catalog - productA.price_current) / productA.price_catalog) * 100) : 0;

  const hasPromoB = productB.price_catalog && productB.price_catalog > productB.price_current;
  const reductionB = hasPromoB ? Math.round(((productB.price_catalog - productB.price_current) / productB.price_catalog) * 100) : 0;

  // DOUBLE SCHÉMA JSON-LD
  const nonce = headers().get('x-nonce') || '';
  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `${productA.brand} ${productA.model}`,
      "image": productA.image_url,
      "brand": { "@type": "Brand", "name": productA.brand },
      "offers": {
        "@type": "Offer",
        "price": productA.price_current,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": `https://www.ideescasa.fr/machines/${productA.slug}`,
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": productA.price_catalog,
          "priceCurrency": "EUR",
          "valueAddedTaxIncluded": true
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `${productB.brand} ${productB.model}`,
      "image": productB.image_url,
      "brand": { "@type": "Brand", "name": productB.brand },
      "offers": {
        "@type": "Offer",
        "price": productB.price_current,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": `https://www.ideescasa.fr/machines/${productB.slug}`,
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": productB.price_catalog,
          "priceCurrency": "EUR",
          "valueAddedTaxIncluded": true
        }
      }
    }
  ];

  return (
    <main className="min-h-screen bg-[#fdfbf7] pb-24 text-left">
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />

      <nav className="py-6 px-6 border-b border-stone-200 bg-[#fdfbf7]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Retour au laboratoire
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-amber-800 bg-amber-50 px-3 py-1 mb-4">
            <Scale className="w-3 h-3" /> Analyse Technique Face à Face
          </span>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-stone-900 leading-tight mb-4 italic">
            {productA.brand} <span className="uppercase not-italic font-sans font-bold text-stone-400 text-2xl">{productA.model}</span> <br className="md:hidden" /> vs <br className="md:hidden" /> {productB.brand} <span className="uppercase not-italic font-sans font-bold text-stone-400 text-2xl">{productB.model}</span>
          </h1>
        </div>

        {/* GRILLE DUEL SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* MACHINE A */}
          <div className="bg-white border border-stone-200 p-8 shadow-sm flex flex-col justify-between relative">
            {/* FIX CLAUDE : Affichage propre de la réduction sans template literal cassé */}
            {hasPromoA && (
              <span className="absolute top-4 left-4 bg-red-600 text-white font-sans font-bold text-[9px] px-2 py-0.5 uppercase tracking-widest z-10">-{reductionA}%</span>
            )}
            <div>
              <div className="aspect-square flex items-center justify-center p-6 bg-stone-50 mb-6 overflow-hidden">
                <SafeImage src={productA.image_url} alt={`${productA.brand} ${productA.model}`} className="max-h-64 object-contain mix-blend-multiply" />
              </div>
              <p className="text-xs uppercase tracking-widest text-amber-800 font-bold mb-1">{productA.brand}</p>
              <h2 className="font-serif text-2xl text-stone-900 mb-4 font-bold">{productA.model}</h2>
              <div className="flex items-baseline gap-3 mb-6">
                <p className="font-serif text-4xl font-bold text-red-600">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(productA.price_current)}
                </p>
                {hasPromoA && (
                  <p className="text-lg text-stone-300 line-through">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(productA.price_catalog)}
                  </p>
                )}
              </div>
            </div>
            <Link href={`/machines/${productA.slug}`} className="block text-center bg-[#1a1a1a] text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-stone-800 transition-colors">
              Fiche & Prix d'achat
            </Link>
          </div>

          {/* MACHINE B */}
          <div className="bg-white border border-stone-200 p-8 shadow-sm flex flex-col justify-between relative">
            {/* FIX CLAUDE : Affichage propre de la réduction sans template literal cassé */}
            {hasPromoB && (
              <span className="absolute top-4 left-4 bg-red-600 text-white font-sans font-bold text-[9px] px-2 py-0.5 uppercase tracking-widest z-10">-{reductionB}%</span>
            )}
            <div>
              <div className="aspect-square flex items-center justify-center p-6 bg-stone-50 mb-6 overflow-hidden">
                <SafeImage src={productB.image_url} alt={`${productB.brand} ${productB.model}`} className="max-h-64 object-contain mix-blend-multiply" />
              </div>
              <p className="text-xs uppercase tracking-widest text-amber-800 font-bold mb-1">{productB.brand}</p>
              <h2 className="font-serif text-2xl text-stone-900 mb-4 font-bold">{productB.model}</h2>
              <div className="flex items-baseline gap-3 mb-6">
                <p className="font-serif text-4xl font-bold text-red-600">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(productB.price_current)}
                </p>
                {hasPromoB && (
                  <p className="text-lg text-stone-300 line-through">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(productB.price_catalog)}
                  </p>
                )}
              </div>
            </div>
            <Link href={`/machines/${productB.slug}`} className="block text-center bg-[#1a1a1a] text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-stone-800 transition-colors">
              Fiche & Prix d'achat
            </Link>
          </div>
        </div>

        {/* TÂCHE 8 : DENSITÉ SÉMANTIQUE AUTOMATIQUE */}
        {insights.length > 0 ? (
          <div className="bg-stone-50 border border-stone-200 p-8 md:p-12 mb-12 rounded-sm">
            <h3 className="font-serif text-2xl text-stone-900 mb-6 italic font-bold">L'Analyse Comparative de la Rédaction</h3>
            <ul className="space-y-4">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3 text-stone-600 leading-relaxed font-light text-base">
                  <Check className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-stone-50 border border-stone-100 p-6 text-center text-stone-400 italic text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 opacity-40" /> Les fiches techniques détaillées de ces deux modèles coïncident. Consultez les rapports individuels pour affiner votre choix.
          </div>
        )}
      </div>
    </main>
  );
}
