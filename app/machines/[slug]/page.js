import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AffiliateButton from '@/components/AffiliateButton';
import { ArrowLeft, ShieldCheck, Gauge, Coffee, Zap, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getSafeImageUrl } from '@/lib/imageService';
import SafeImage from '@/components/SafeImage';
import JsonLd from '@/components/JsonLd';

// FORCE LE MODE DYNAMIQUE POUR ÉVITER LES ERREURS DE BUILD STATIQUE
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  
  if (!product) return { title: "Machine introuvable | Idées Casa" };

  const currentYear = new Date().getFullYear();
  const title = `Avis ${product.brand} ${product.model} : Meilleur Prix ${currentYear}`;
  
  return {
    title,
    openGraph: { title, images: [{ url: product.image_url }] },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!product) notFound();

  const imageData = getSafeImageUrl(product);
  const hasPromo = product.price_catalog && product.price_catalog > product.price_current;
  const reduction = hasPromo ? Math.round(((product.price_catalog - product.price_current) / product.price_catalog) * 100) : 0;

  let merchantName = "notre partenaire";
  if (product.source_url?.includes('boulanger')) merchantName = "Boulanger";
  if (product.source_url?.includes('coffee-webstore')) merchantName = "Coffee Webstore";
  if (product.source_url?.includes('maxicoffee')) merchantName = "MaxiCoffee";

  const lastUpdate = product.last_hunt_at ? new Date(product.last_hunt_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <main className="min-h-screen bg-[#fdfbf7] pb-24">
      <JsonLd product={product} />
      {/* ... [Garde tout ton JSX de header ici, je ne le répète pas pour alléger] ... */}
      
      {/* ENRICHISSEMENT SÉMANTIQUE */}
      <div className="max-w-6xl mx-auto px-6">
        {product?.specs && (
          <section className="mt-16 border-t border-stone-200 pt-16 text-left">
            <h3 className="font-serif text-3xl text-stone-900 mb-8 italic font-bold">Analyse des Caractéristiques & Verdict</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-sm">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-emerald-800 mb-4">Les Points Forts</h4>
                {(() => {
                  const pros = product.specs?.pros;
                  return Array.isArray(pros) && pros.length > 0 ? (
                    <ul className="space-y-2 text-sm text-stone-600 font-light">{pros.map((pro, i) => <li key={i}>✓ {pro}</li>)}</ul>
                  ) : <p className="text-stone-400 italic text-sm">Aucun avantage spécifique détecté.</p>;
                })()}
              </div>
              <div className="bg-red-50/50 border border-red-100 p-6 rounded-sm">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-red-800 mb-4">Les Limites</h4>
                {(() => {
                  const cons = product.specs?.cons;
                  return Array.isArray(cons) && cons.length > 0 ? (
                    <ul className="space-y-2 text-sm text-stone-600 font-light">{cons.map((con, i) => <li key={i}>✕ {con}</li>)}</ul>
                  ) : <p className="text-stone-400 italic text-sm">Aucune limitation majeure détectée.</p>;
                })()}
              </div>
            </div>
            {/* TABLEAU TECHNIQUE */}
            <div className="bg-white border border-stone-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm font-light text-stone-600">
                <tbody className="divide-y divide-stone-100">
                  {product.specs?.reservoir_eau_litres && <tr><td className="p-4 font-medium text-stone-900 bg-stone-50/30 w-1/2">Capacité réservoir</td><td className="p-4">{product.specs.reservoir_eau_litres} Litres</td></tr>}
                  {product.specs?.pression_bars && <tr><td className="p-4 font-medium text-stone-900 bg-stone-50/30">Pression</td><td className="p-4">{product.specs.pression_bars} Bars</td></tr>}
                  {product.specs?.puissance_watts && <tr><td className="p-4 font-medium text-stone-900 bg-stone-50/30">Puissance</td><td className="p-4">{product.specs.puissance_watts} Watts</td></tr>}
                  {(product.specs?.broyeur_integre === true || product.specs?.broyeur_integre === false) && <tr><td className="p-4 font-medium text-stone-900 bg-stone-50/30">Broyeur intégré</td><td className="p-4">{product.specs.broyeur_integre ? "Oui" : "Non"}</td></tr>}
                  {product.specs?.type_chauffe && <tr><td className="p-4 font-medium text-stone-900 bg-stone-50/30">Système de chauffe</td><td className="p-4">{product.specs.type_chauffe}</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
