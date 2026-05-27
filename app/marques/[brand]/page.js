import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Coffee, ChevronRight } from 'lucide-react';
import { getSafeImageUrl } from '@/lib/imageService';
import SafeImage from '@/components/SafeImage';

export const revalidate = 86400; // Recalcul du cache toutes les 24h (ISR)

// 1. OPTIMISATION : Pré-rendu des marques les plus populaires pour booster le TTFB
export async function generateStaticParams() {
  const { data: products } = await supabase.from('products').select('brand').limit(30);
  const uniqueBrands = [...new Set(products?.map((p) => p.brand.toLowerCase()))];
  return uniqueBrands.map((brand) => ({ brand }));
}

// 2. SEO DYNAMIQUE PAR MARQUE
export async function generateMetadata({ params }) {
  const { brand } = await params;
  // On capitalise proprement la marque pour le titre (ex: jura -> Jura)
  const formattedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);
  const currentYear = new Date().getFullYear();

  const title = `Meilleure Machine Expresso ${formattedBrand} : Comparatif Prix ${currentYear}`;
  const description = `Découvrez notre sélection indépendante des meilleures machines à café grains et expresso de la marque ${formattedBrand}. Fiches techniques, prix bas et avis d'experts.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.ideescasa.fr/marques/${brand}`,
      siteName: 'Idées Casa',
      locale: 'fr_FR',
      type: 'website',
    },
  };
}

// 3. COMPOSANT PAGE PRINCIPALE
export default async function BrandPage({ params }) {
  const { brand } = await params;

  // Récupération de toutes les machines uniques de cette marque via la vue de confiance
  const { data: products, error } = await supabase
    .from('best_products')
    .select('*')
    .ilike('brand', brand) // .ilike permet d'être insensible à la casse (anti-bug 404)
    .order('price_current', { ascending: true });

  if (error || !products || products.length === 0) {
    notFound();
  }

  // On récupère le vrai nom de la marque stocké en base pour l'affichage propre
  const displayBrand = products[0].brand;

  return (
    <main className="min-h-screen bg-[#fdfbf7] pb-24">
      {/* Barre de navigation */}
      <nav className="py-6 px-6 border-b border-stone-200 sticky top-0 bg-[#fdfbf7]/90 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Retour Accueil
          </Link>
          <span className="font-serif tracking-widest text-xs opacity-60 uppercase">
            Sélection par Marque
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-16 text-left">
        {/* En-tête de la marque */}
        <header className="mb-16 border-b border-stone-200 pb-10">
          <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-widest mb-3">
            <Coffee className="w-3 h-3 text-amber-700" />
            <span>Expertise Café & Spécialité</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-stone-900 uppercase italic tracking-tight font-bold">
            Gamme {displayBrand}
          </h1>
          <p className="text-stone-600 font-light text-lg max-w-2xl mt-4 leading-relaxed">
            Analyses indépendantes, fiches techniques complètes et suivi des prix en temps réel pour l'ensemble du catalogue de machines expresso <strong className="font-normal text-stone-900">{displayBrand}</strong>.
          </p>
        </header>

        {/* Grille de produits programmatiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const imageData = getSafeImageUrl(product);
            const hasPromo = product.price_catalog && product.price_catalog > product.price_current;

            return (
              <div key={product.id} className="bg-white border border-stone-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative">
                {hasPromo && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white font-sans font-bold text-[9px] px-2 py-0.5 uppercase tracking-wider z-10">
                    Offre
                  </span>
                )}
                
                {/* Zone Image */}
                <div className="p-8 aspect-square flex items-center justify-center border-b border-stone-100 bg-white">
                  <SafeImage
                    src={imageData.url}
                    alt={imageData.alt}
                    fallbackUrl={imageData.fallbackUrl}
                    className="max-h-48 object-contain mix-blend-multiply"
                  />
                </div>

                {/* Contenu de la carte */}
                <div className="p-6 flex flex-col flex-grow text-left">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-amber-800 mb-1">
                    {product.brand}
                  </span>
                  <h2 className="font-serif text-xl text-stone-900 mb-4 line-clamp-1">
                    {product.model}
                  </h2>
                  
                  {/* Tarifs */}
                  <div className="mt-auto pt-4 border-t border-stone-100 flex items-baseline gap-3">
                    <span className="font-serif text-2xl font-bold text-stone-900">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_current)}
                    </span>
                    {hasPromo && (
                      <span className="text-sm text-stone-300 line-through">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(product.price_catalog)}
                      </span>
                    )}
                  </div>

                  {/* Bouton d'action vers la fiche produit */}
                  <Link 
                    href={`/machines/${product.slug}`}
                    className="mt-4 w-full py-3 bg-stone-50 border border-stone-200 text-center text-[10px] uppercase font-bold tracking-widest text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all flex items-center justify-center gap-1"
                  >
                    Voir l'analyse technique <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
