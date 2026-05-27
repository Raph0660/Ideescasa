import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AffiliateButton from '@/components/AffiliateButton';
import { ArrowLeft, ShieldCheck, Gauge, Coffee, Zap, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getSafeImageUrl } from '@/lib/imageService';
import SafeImage from '@/components/SafeImage';
import JsonLd from '@/components/JsonLd';

export const revalidate = 86400; // ISR 24h

export async function generateStaticParams() {
  const { data: products } = await supabase.from('products').select('slug').limit(20);
  return products?.map((p) => ({ slug: p.slug })) || [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .order('source_priority', { ascending: true })
    .limit(1)
    .single();
  
  if (!product) return { title: "Machine introuvable | Idées Casa" };

  const currentYear = new Date().getFullYear();
  const title = `Avis ${product.brand} ${product.model} : Meilleur Prix ${currentYear}`;
  const description = product.description || `Découvrez la fiche technique, notre analyse d'expert et le meilleur prix en direct pour la machine expresso ${product.brand} ${product.model}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.ideescasa.fr/machines/${product.slug}`,
      siteName: 'Idées Casa',
      images: [{ url: product.image_url }],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image_url],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .order('source_priority', { ascending: true })
    .limit(1)
    .single();

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
      {/* Injection sémantique du schéma structuré Google */}
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
        
        {/* COLONNE GAUCHE : VISUEL D'ORIGINE SÉCURISÉ */}
        <div className="space-y-8">
          <div className="bg-white border border-stone-200 p-12 aspect-square flex items-center justify-center relative shadow-sm overflow-hidden">
            {hasPromo && (
              <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10">
                -{reduction}%
              </div>
            )}
            
            {imageData.url ? (
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

        {/* COLONNE DROITE : TEXTES CORRIGÉS */}
        <div className="flex flex-col justify-top pt-4 text-left">
          <p className="text-[14px] uppercase tracking-[0.3em] font-extrabold text-amber-800 mb-4">
            {product.brand}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-tighter text-stone-900 mb-6 leading-none italic">
            {product.model.length < 12 ? `Machine ${product.model}` : product.model}
          </h1>

          {/* Affichage E-E-A-T de la fraîcheur du prix */}
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

      {/* ENRICHISSEMENT SÉMANTIQUE PAR FUSION TECH & IA */}
      <div className="max-w-6xl mx-auto px-6">
        {product.specs && (
          <section className="mt-16 border-t border-stone-200 pt-16 text-left">
            <h3 className="font-serif text-3xl text-stone-900 mb-8 italic font-bold">
              Analyse des Caractéristiques & Verdict
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Les Points Forts */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-sm">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-emerald-800 mb-4">Les Points Forts</h4>
                <ul className="space-y-2 text-sm text-stone-600 font-light">
                  {/* 1. Filtres mathématiques natifs d'origine */}
                  {product.specs.broyeur_integre && <li>✓ Broyeur de grains intégré : café d'une fraîcheur absolue à chaque tasse.</li>}
                  {product.specs.pression_bars >= 15 && <li>✓ Pression professionnelle ({product.specs.pression_bars} Bars) pour une extraction parfaite de la créma.</li>}
                  {product.specs.reservoir_eau_litres >= 1.8 && <li>✓ Excellent réservoir de {product.specs.reservoir_eau_litres}L : idéal pour une utilisation familiale ou quotidienne.</li>}
                  {product.specs.puissance_watts >= 1450 && <li>✓ Thermoblock haute performance ({product.specs.puissance_watts}W) : temps de préchauffage réduit au minimum.</li>}
                  {!product.specs.broyeur_integre && <li>✓ Format compact et entretien simplifié au quotidien (sans gestion de moulin).</li>}
                  
                  {/* 2. Injection fluide des avantages textuels extraits par Groq */}
                  {Array.isArray(product.specs.pros) && product.specs.pros.map((pro, i) => (
                    <li key={i}>✓ {pro}</li>
                  ))}
                </ul>
              </div>

              {/* Les Limites */}
              <div className="bg-red-50/50 border border-red-100 p-6 rounded-sm">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-red-800 mb-4">Les Limites à prendre en compte</h4>
                <ul className="space-y-2 text-sm text-stone-600 font-light">
                  {/* 1. Filtres mathématiques natifs d'origine */}
                  {product.specs.reservoir_eau_litres < 1.3 && <li>✕ Réservoir d'eau compact ({product.specs.reservoir_eau_litres}L) demandant des remplissages fréquents.</li>}
                  {product.specs.capacite_grains_grammes <= 200 && product.specs.broyeur_integre && <li>✕ Contenance du bac à grains limitée ({product.specs.capacite_grains_grammes}g).</li>}
                  {product.price_current > 800 && <li>✕ Investissement premium justifié par les matériaux mais ciblant les utilisateurs avertis.</li>}
                  {product.specs.pression_bars < 15 && <li>✕ Pression standard de {product.specs.pression_bars} Bars, demandant une mouture parfaitement calibrée.</li>}
                  
                  {/* 2. Injection des faiblesses sémantiques de Groq (Désamorce les boîtes vides) */}
                  {Array.isArray(product.specs.cons) && product.specs.cons.map((con, i) => (
                    <li key={i}>✕ {con}</li>
                  ))}

                  {/* 3. FILET DE SECOURS ANTI-BOÎTE-VIDE (E-E-A-T) */}
                  {(!product.specs.cons || product.specs.cons.length === 0) && 
                   !(product.specs.reservoir_eau_litres < 1.3) && 
                   !(product.specs.capacite_grains_grammes <= 200 && product.specs.broyeur_integre) && 
                   !(product.price_current > 800) && 
                   !(product.specs.pression_bars < 15) && (
                    <li>✕ Seul le positionnement tarifaire initial peut restreindre l'accès aux profils débutants.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 2. TABLEAU TECHNIQUE COMPLET */}
            <div className="bg-white border border-stone-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm font-light text-stone-600">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-left font-bold text-stone-700 text-xs uppercase tracking-wider">
                    <th className="p-4">Indicateur Technique</th>
                    <th className="p-4">Spécification Nominale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {product.specs.reservoir_eau_litres && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30 w-1/2">Capacité du réservoir</td>
                      <td className="p-4">{product.specs.reservoir_eau_litres} Litres</td>
                    </tr>
                  )}
                  {product.specs.pression_bars && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30">Pression de la pompe</td>
                      <td className="p-4">{product.specs.pression_bars} Bars</td>
                    </tr>
                  )}
                  {product.specs.puissance_watts && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30">Puissance nominale</td>
                      <td className="p-4">{product.specs.puissance_watts} Watts</td>
                    </tr>
                  )}
                  {product.specs.broyeur_integre !== undefined && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30">Broyeur à grains intégré</td>
                      <td className="p-4">{product.specs.broyeur_integre ? "Oui (Moulin intégré)" : "Non"}</td>
                    </tr>
                  )}
                  {product.specs.capacite_grains_grammes && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30">Capacité du bac à grains</td>
                      <td className="p-4">{product.specs.capacite_grains_grammes} grammes</td>
                    </tr>
                  )}
                  {product.specs.type_chauffe && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30">Système de chauffe</td>
                      <td className="p-4">{product.specs.type_chauffe}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
