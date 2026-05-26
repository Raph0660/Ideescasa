import { supabase } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Coffee, Scale, Check } from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';

export const revalidate = 86400; // ISR 24h

// 1. GÉNÉRATION DE PHRASES COMPARATIVES AUTOMATIQUES (TÂCHE 8)
function buildComparisonInsights(pA, pB) {
  const insights = [];
  
  // Comparaison Réservoir
  if (pA.specs?.reservoir_eau_litres && pB.specs?.reservoir_eau_litres) {
    const diff = Math.abs(pA.specs.reservoir_eau_litres - pB.specs.reservoir_eau_litres).toFixed(1);
    if (parseFloat(diff) > 0) {
      const master = pA.specs.reservoir_eau_litres > pB.specs.reservoir_eau_litres ? pA : pB;
      insights.push(`Côté autonomie, la ${master.brand} ${master.model} se distingue avec un réservoir plus généreux (écart de ${diff} litres).`);
    }
  }
  
  // Comparaison Broyeur intégré
  if (pA.specs?.broyeur_integre !== undefined && pB.specs?.broyeur_integre !== undefined) {
    if (pA.specs.broyeur_integre !== pB.specs.broyeur_integre) {
      const withGrinder = pA.specs.broyeur_integre ? pA : pB;
      insights.push(`Différence majeure de conception : la ${withGrinder.brand} ${withGrinder.model} intègre un broyeur de grains de café, offrant une fraîcheur d'extraction supérieure.`);
    }
  }

  // Comparaison Puissance
  if (pA.specs?.puissance_watts && pb.specs?.puissance_watts) {
    if (pA.specs.puissance_watts !== pB.specs.puissance_watts) {
      const master = pA.specs.puissance_watts > pB.specs.puissance_watts ? pA : pB;
      insights.push(`Sur le plan thermique, la ${master.brand} ${master.model} développe une puissance supérieure (${master.specs.puissance_watts}W) pour stabiliser la température.`);
    }
  }

  // Comparaison Financière
  if (pA.price_current && pB.price_current) {
    const diffPrice = Math.abs(pA.price_current - pB.price_current);
    if (diffPrice > 0) {
      const cheaper = pA.price_current < pB.price_current ? pA : pB;
      insights.push(`Financièrement, l'option la plus compétitive est la ${cheaper.brand} ${cheaper.model}, affichant un avantage économique de ${diffPrice}€.`);
    }
  }

  return insights;
}

// 2. SEO & METADATA DYNAMIQUES
export async function generateMetadata({ params }) {
  const { slugs } = await params;
  if (!slugs.includes('-vs-')) return { title: "Comparateur | Idées Casa" };

  const [slugA, slugB] = slugs.split('-vs-');
  const { data: products } = await supabase.from('best_products').select('brand, model').in('slug', [slugA, slugB]);

  if (!products || products.length < 2) return { title: "Comparatif indisponible" };

  const title = `Comparatif ${products[0].brand} ${products[0].model} vs ${products[1].brand} ${products[1].model} : Lequel Choisir en 2026 ?`;
  return {
    title,
    description: `Analyse technique comparative, specs et meilleur prix en direct pour choisir entre la ${products[0].brand} ${products[0].model} et la ${products[1].brand} ${products[1].model}.`,
  };
}

// 3. PAGE PRINCIPALE
export default async function ComparisonPage({ params }) {
  const { slugs } = await params;

  // Sécurité anti-URL malformée
  if (!slugs.includes('-vs-')) notFound();

  const [slugA, slugB] = slugs.split('-vs-');

  // TÂCHE 7 : REDIRECTION 301 STRICTE POUR FORCER L'ORDRE ALPHABÉTIQUE
  const [canonicalA, canonicalB] = [slugA, slugB].sort();
  if (slugA !== canonicalA || slugB !== canonicalB) {
    redirect(`/comparatif/${canonicalA}-vs-${canonicalB}`, 'permanent');
  }

  // Récupération depuis la vue nettoyée Supabase
  const { data: rawProducts } = await supabase
    .from('best_products')
    .select('*')
    .in('slug', [slugA, slugB]);

  const productA = rawProducts?.find(p => p.slug === slugA);
  const productB = rawProducts?.find(p => p.slug === slugB);

  if (!productA || !productB) notFound();

  const insights = buildComparisonInsights(productA, productB);

  return (
    <main className="min-h-screen bg-[#fdfbf7] pb-24 text-left">
      <nav className="py-6 px-6 border-b border-stone-200 bg-[#fdfbf7]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Retour à l'accueil
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        {/* En-tête */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-amber-800 bg-amber-50 px-3 py-1 mb-4">
            <Scale className="w-3 h-3" /> Duel Technique 2026
          </span>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-stone-900 leading-none mb-4 italic">
            {productA.brand} {productA.model} <span className="text-stone-300 not-italic font-sans text-2xl md:text-3xl block my-2">vs</span> {productB.brand} {productB.model}
          </h1>
        </div>

        {/* GRILLE DUEL SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* COLONNE MACHINE A */}
          <div className="bg-white border border-stone-200 p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="aspect-square flex items-center justify-center p-6 bg-stone-50 mb-6 overflow-hidden">
                <SafeImage src={productA.image_url} alt={`${productA.brand} ${productA.model}`} className="max-h-64 object-contain mix-blend-multiply" />
              </div>
              <p className="text-xs uppercase tracking-widest text-amber-800 font-bold mb-1">{productA.brand}</p>
              <h2 className="font-serif text-2xl text-stone-900 mb-4">{productA.model}</h2>
              <p className="font-serif text-4xl text-red-600 mb-6">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(productA.price_current)}
              </p>
            </div>
            <Link href={`/machines/${productA.slug}`} className="block text-center bg-[#1a1a1a] text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-stone-800 transition-colors">
              Voir la fiche complète
            </Link>
          </div>

          {/* COLONNE MACHINE B */}
          <div className="bg-white border border-stone-200 p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="aspect-square flex items-center justify-center p-6 bg-stone-50 mb-6 overflow-hidden">
                <SafeImage src={productB.image_url} alt={`${productB.brand} ${productB.model}`} className="max-h-64 object-contain mix-blend-multiply" />
              </div>
              <p className="text-xs uppercase tracking-widest text-amber-800 font-bold mb-1">{productB.brand}</p>
              <h2 className="font-serif text-2xl text-stone-900 mb-4">{productB.model}</h2>
              <p className="font-serif text-4xl text-red-600 mb-6">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(productB.price_current)}
              </p>
            </div>
            <Link href={`/machines/${productB.slug}`} className="block text-center bg-[#1a1a1a] text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-stone-800 transition-colors">
              Voir la fiche complète
            </Link>
          </div>
        </div>

        {/* TÂCHE 8 : TEXTE D'ANALYSE SÉMANTIQUE AUTOMATIQUE (E-E-A-T) */}
        {insights.length > 0 && (
          <div className="bg-stone-50 border border-stone-200 p-8 md:p-12 mb-16 rounded-sm">
            <h3 className="font-serif text-2xl text-stone-900 mb-6 italic">L'Analyse Comparative de la Rédac'</h3>
            <ul className="space-y-4">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3 text-stone-600 leading-relaxed font-light">
                  <Check className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
