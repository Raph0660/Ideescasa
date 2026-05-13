import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AffiliateButton from '@/components/AffiliateButton';
import { ArrowLeft, ShieldCheck, Gauge, Coffee, Zap } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 86400; // ISR 24h

// 1. GÉNÉRATION STATIQUE (Ce que Claude demandait)
// Next.js va pré-construire ces pages au moment du déploiement
export async function generateStaticParams() {
  const { data: products } = await supabase.from('products').select('slug').limit(20);
  return products?.map((p) => ({ slug: p.slug })) || [];
}

// 2. SEO DYNAMIQUE
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single();
  if (!product) return { title: "Machine introuvable | Idées Casa" };

  return {
    title: `${product.brand} ${product.model} : Prix et Analyse 2026`,
    description: `Découvrez la fiche technique et le meilleur prix pour la ${product.brand} ${product.model}. Expertise indépendante Idées Casa.`,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single();

  if (!product) notFound();

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
        {/* IMAGE & PRIX SECTION */}
        <div className="space-y-8">
          <div className="aspect-square bg-white border border-stone-200 p-12 flex items-center justify-center relative shadow-sm">
            {hasPromo && <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10">-{reduction}%</div>}
            <img src={product.image_url} alt={product.model} className="max-h-full object-contain mix-blend-multiply" />
          </div>

          {/* TABLEAU DE SPECS (Claude's Favorite) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-stone-100 rounded-sm">
              <div className="flex items-center gap-2 text-stone-400 mb-1"><Gauge className="w-3 h-3"/> <span className="text-[9px] uppercase font-bold tracking-widest">Pression</span></div>
              <p className="font-serif text-lg">15 Bars</p>
            </div>
            <div className="p-4 bg-white border border-stone-100 rounded-sm">
              <div className="flex items-center gap-2 text-stone-400 mb-1"><Zap className="w-3 h-3"/> <span className="text-[9px] uppercase font-bold tracking-widest">Garantie</span></div>
              <p className="font-serif text-lg">2 Ans</p>
            </div>
          </div>
        </div>

        {/* CONTENU & CTA */}
        <div className="flex flex-col justify-top pt-4">
          <p className="text-[12px] uppercase tracking-[0.3em] font-bold text-amber-800 mb-4">{product.brand}</p>
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-tighter text-stone-900 mb-8 leading-none italic">{product.model}</h1>
          
          <div className="flex items-baseline gap-4 mb-10 border-b border-stone-200 pb-10">
            <p className="font-serif text-6xl text-red-600 leading-none">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_current)}
            </p>
            {hasPromo && <p className="text-2xl text-stone-300 line-through">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_catalog)}</p>}
          </div>

          <div className="prose prose-stone mb-12">
            <p className="text-stone-600 font-light text-xl leading-relaxed italic">
              {product.description || `Cette ${product.brand} ${product.model} représente le sommet de l'extraction espresso pour les amateurs exigeants.`}
            </p>
          </div>

          <AffiliateButton url={product.source_url} merchantName={merchantName} price={product.price_current} />
          
          <div className="mt-8 flex items-center justify-center gap-6 text-stone-400 italic text-[11px]">
             <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 opacity-50"/> Expédition sécurisée</span>
             <span className="flex items-center gap-2"><Coffee className="w-4 h-4 opacity-50"/> Stock vérifié</span>
          </div>
        </div>
      </div>
    </main>
  );
}
