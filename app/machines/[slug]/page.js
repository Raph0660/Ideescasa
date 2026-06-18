import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AffiliateButton from '@/components/AffiliateButton';
import { ArrowLeft, ShieldCheck, Gauge, Coffee, Zap, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getSafeImageUrl } from '@/lib/imageService';
import SafeImage from '@/components/SafeImage';
import JsonLd from '@/components/JsonLd';

// Configuration ISR : Cache Edge mis à jour toutes les 24 heures
export const revalidate = 86400; 

// 1. GENERATE STATIC PARAMS (Version sécurisée anti-crash)
export async function generateStaticParams() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('slug')
      .not('slug', 'is', null);

    if (error) throw error;

    // Filtre strict pour éliminer les types invalides ou slugs vides
    return products
      ?.filter((p) => p.slug && typeof p.slug === 'string' && p.slug.length > 0)
      .map((p) => ({ slug: p.slug })) || [];
      
  } catch (err) {
    console.error('Erreur critique dans generateStaticParams:', err);
    return []; // Retourne un tableau vide : le build ne plante pas
  }
}

// 2. GENERATE METADATA (Version blindée avec try/catch requis par Claude)
export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
      
    if (!product) return { title: "Machine introuvable | Idées Casa" };

    const currentYear = new Date().getFullYear();
    const title = `Avis ${product.brand} ${product.model} : Meilleur Prix ${currentYear}`;
    const description = product.description || `Découvrez la fiche technique, notre analysis d'expert et le meilleur prix en direct pour la machine expresso ${product.brand} ${product.model}.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.ideescasa.fr/machines/${product.slug}`,
        siteName: 'Idées Casa',
        images: product.image_url ? [{ url: product.image_url }] : [],
        locale: 'fr_FR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.image_url ? [product.image_url] : [],
      },
    };
  } catch (e) {
    console.error('generateMetadata error:', e);
    return { title: "Machine introuvable | Idées Casa" };
  }
}

// 3. COMPOSANT DE PAGE PRINCIPAL
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

      <nav className="py-6 px-6 border-b border-stone-200 sticky top-0 bg-[#fdfbf7]/90 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto text-left">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Retour aux offres
          </Link>
        </div>
      </nav>

      {/* BLOC PRINCIPAL PRODUIT */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* COLONNE GAUCHE : VISUEL */}
        <div className="space-y-8">
          <div className="bg-white border border-stone-200 p-12 aspect-square flex items-center justify-center relative shadow-sm overflow-hidden">
            {hasPromo && (
              <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10">
                -{reduction}%
              </div>
            )}
            
            {imageData?.url ? (
              <SafeImage 
                src={imageData.url}
                alt={imageData.alt}
                fallbackUrl={imageData.fallbackUrl}
                className="max-h-full object-contain mix-blend-multiply"
              />
            ) : (
              <div className="text-stone-300 italic">Image en cours de traitement</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-stone-100 rounded-sm">
              <div className="flex items-center gap-2 text-stone-400 mb-1">
                <Gauge className="w-3 h-3"/> 
                <span className="text-[9px] uppercase font-bold tracking-widest">Pression</span>
              </div>
              <p className="font-serif text-lg">
                {product.specs?.pression_bars ? `${product.specs.pression_bars} Bars` : '15 Bars'}
              </p>
            </div>
            <div className="p-4 bg-white border border-stone-100 rounded-sm">
              <div className="flex items-center gap-2 text-stone-400 mb-1">
                <Zap className="w-3 h-3"/> 
                <span className="text-[9px] uppercase font-bold tracking-widest">Garantie</span>
              </div>
              <p className="font-serif text-lg">2 Ans</p>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : CONTENU TEXTE */}
        <div className="flex flex-col justify-top pt-4 text-left">
          <p className="text-[14px] uppercase tracking-[0.3em] font-extrabold text-amber-800 mb-4">
            {product.brand}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-tighter text-stone-900 mb-6 leading-none italic">
            {product.model.length < 12 ? `Machine ${product.model}` : product.model}
          </h1>

          {lastUpdate && (
            <div className="flex items-center gap-1.5 text-stone-400 text-[11px] mb-6 italic">
              <Calendar className="w-3 h-3 text-stone-300" />
              <time dateTime={product.last_hunt_at}>Tarif relevé le {lastUpdate}</time>
            </div>
          )}
          
          <div className="flex items-baseline gap-4 mb-10 border-b border-stone-200 pb-10">
            <p className="font-serif text-6xl text-red-600 leading-none">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_current)}
            </p>
            {hasPromo && (
              <p className="text-2xl text-stone-300 line-through">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_catalog)}
              </p>
            )}
          </div>

          <div className="mb-12">
            <p className="text-stone-600 font-light text-xl leading-relaxed italic">
              {product.description || `La machine ${product.brand} ${product.model} est une référence sélectionnée par nos experts pour sa fiabilité et sa qualité d'extraction thermique.`}
            </p>
          </div>

          <AffiliateButton url={product.source_url} merchantName={merchantName} price={product.price_current} />
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-stone-400 italic text-[11px]">
             <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 opacity-50"/> Expédition sécurisée</span>
             <span className="flex items-center gap-2"><Coffee className="w-4 h-4 opacity-50"/> Stock vérifié par robot</span>
          </div>
        </div>
      </div>

      {/* ENRICHISSEMENT SÉMANTIQUE (Version finale sans fallbacks) */}
      <div className="max-w-6xl mx-auto px-6">
        {product?.specs && (
          <section className="mt-16 border-t border-stone-200 pt-16 text-left">
            <h3 className="font-serif text-3xl text-stone-900 mb-8 italic font-bold">Analyse des Caractéristiques & Verdict</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              
              {/* Points Forts */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-sm">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-emerald-800 mb-4">Les Points Forts</h4>
                {(() => {
                  const pros = product.specs?.pros;
                  return Array.isArray(pros) && pros.length > 0 ? (
                    <ul className="space-y-2 text-sm text-stone-600 font-light">
                      {pros.map((pro, i) => <li key={i}>✓ {pro}</li>)}
                    </ul>
                  ) : <p className="text-stone-400 italic text-sm">Aucun avantage spécifique détecté.</p>;
                })()}
              </div>

              {/* Limites */}
              <div className="bg-red-50/50 border border-red-100 p-6 rounded-sm">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-red-800 mb-4">Les Limites à prendre en compte</h4>
                {(() => {
                  const cons = product.specs?.cons;
                  return Array.isArray(cons) && cons.length > 0 ? (
                    <ul className="space-y-2 text-sm text-stone-600 font-light">
                      {cons.map((con, i) => <li key={i}>✕ {con}</li>)}
                    </ul>
                  ) : <p className="text-stone-400 italic text-sm">Aucune limitation majeure détectée.</p>;
                })()}
              </div>

            </div>

            {/* TABLEAU TECHNIQUE */}
            <div className="bg-white border border-stone-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm font-light text-stone-600">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-left font-bold text-stone-700 text-xs uppercase tracking-wider">
                    <th className="p-4">Indicateur Technique</th>
                    <th className="p-4">Spécification Nominale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {product.specs?.reservoir_eau_litres && <tr><td className="p-4 font-medium text-stone-900 bg-stone-50/30 w-1/2">Capacité réservoir</td><td className="p-4">{product.specs.reservoir_eau_litres} Litres</td></tr>}
                  {product.specs?.pression_bars && <tr><td className="p-4 font-medium text-stone-900 bg-stone-50/30">Pression</td><td className="p-4">{product.specs.pression_bars} Bars</td></tr>}
                  {product.specs?.puissance_watts && <tr><td className="p-4 font-medium text-stone-900 bg-stone-50/30">Puissance</td><td className="p-4">{product.specs.puissance_watts} Watts</td></tr>}
                  {(product.specs?.broyeur_integre === true || product.specs?.broyeur_integre === false) && <tr><td className="p-4 font-medium text-stone-900 bg-stone-50/30">Broyeur intégré</td><td className="p-4">{product.specs.broyeur_integre ? "Oui" : "Non"}</td></tr>}
                  {product.specs?.capacite_grains_grammes && <tr><td className="p-4 font-medium text-stone-900 bg-stone-50/30">Capacité du bac à grains</td><td className="p-4">{product.specs.capacite_grains_grammes} grammes</td></tr>}
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
