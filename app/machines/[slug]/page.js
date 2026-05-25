import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AffiliateButton from '@/components/AffiliateButton';
import { ArrowLeft, ShieldCheck, Gauge, Coffee, Zap } from 'lucide-react';
import Link from 'next/link';
import { getSafeImageUrl } from '@/lib/imageService';

export const revalidate = 86400; // ISR 24h

export async function generateStaticParams() {
  const { data: products } = await supabase.from('products').select('slug').limit(20);
  return products?.map((p) => ({ slug: p.slug })) || [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  // Récupérer le meilleur produit (par source_priority)
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .order('source_priority', { ascending: true })
    .limit(1)
    .single();
  
  if (!product) return { title: "Machine introuvable | Idées Casa" };

  return {
    title: `${product.brand} ${product.model} : Prix et Analyse 2026`,
    description: `Découvrez la fiche technique et le meilleur prix pour la ${product.brand} ${product.model}. Expertise indépendante Idées Casa.`,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  // Récupérer le meilleur produit (par source_priority)
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .order('source_priority', { ascending: true })
    .limit(1)
    .single();

  if (!product) notFound();

  // Récupérer une image sécurisée avec fallback intelligent
  const imageData = getSafeImageUrl(product);

  const hasPromo = product.price_catalog && product.price_catalog > product.price_current;
  const reduction = hasPromo ? Math.round(((product.price_catalog - product.price_current) / product.price_catalog) * 100) : 0;

  let merchantName = "notre partenaire";
  if (product.source_url?.includes('boulanger')) merchantName = "Boulanger";
  if (product.source_url?.includes('coffee-webstore')) merchantName = "Coffee Webstore";
  if (product.source_url?.includes('maxicoffee')) merchantName = "MaxiCoffee";

  return (
    <main className="min-h-screen bg-[#fdfbf7] pb-24">
      <nav className="py-6 px-6 border-b border-stone-200 sticky top-0 bg-[#fdfbf7]/90 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto text-left">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Retour aux offres
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* COLONNE GAUCHE : VISUEL D'ORIGINE */}
        <div className="space-y-8">
          <div className="bg-white border border-stone-200 p-12 aspect-square flex items-center justify-center relative shadow-sm overflow-hidden">
            {hasPromo && (
              <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10">
                -{reduction}%
              </div>
            )}
            {imageData.url ? (
              <img 
                src={imageData.url}
                alt={imageData.alt}
                className="max-h-full object-contain mix-blend-multiply"
                onError={(e) => {
                  // Fallback automatique si l'image primaire échoue
                  e.currentTarget.src = imageData.fallbackUrl;
                }}
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
              <p className="font-serif text-lg">15 Bars</p>
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
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-tighter text-stone-900 mb-8 leading-none italic">
            {product.model.length < 12 ? `Machine ${product.model}` : product.model}
          </h1>
          
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
    </main>
  );
}
