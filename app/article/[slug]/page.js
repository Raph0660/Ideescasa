import Link from 'next/link';
import { Clock, ArrowLeft, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { headers } from 'next/headers';

export const revalidate = 3600;

// 1. SEO DYNAMIQUE (Aligné sur la colonne title)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: article } = await supabase
    .from('articles')
    .select('title, meta_description') // ◄ CORRIGÉ
    .eq('slug', slug)
    .single();

  if (!article) return { title: "Analyse introuvable | Idées Casa" };

  return {
    title: `${article.title} | Expertise Idées Casa`, // ◄ CORRIGÉ
    description: article.meta_description || `Analyse technique, tests et verdict indépendant de nos experts sur : ${article.title}.`, // ◄ CORRIGÉ
  };
}

// 2. COMPOSANT PAGE PRINCIPAL
export default async function ArticlePage({ params }) {
  const { slug } = await params; 
  
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-stone-400 italic">
        Cette expertise est en cours de finalisation par nos rédacteurs...
      </div>
    );
  }

  // SÉCURITÉ & NETTOYAGE
  const textWithNoMuthos = article.content.replaceAll(/Muthos/gi, 'Idées Casa');
  const cleanContent = sanitizeHtml(textWithNoMuthos);

  const readTime = Math.max(1, Math.ceil(cleanContent.split(/\s+/).length / 200));
  const publishDate = article.created_at ? new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  // TÂCHE 9 : JSON-LD NEWSARTICLE AVEC NONCE ET TITRE ALIGNÉ
  const nonce = headers().get('x-nonce') || '';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title, // ◄ CORRIGÉ
    "description": article.meta_description || `Expertise approfondie sur ${article.title}`, // ◄ CORRIGÉ
    "datePublished": article.created_at,
    "dateModified": article.updated_at || article.created_at,
    "author": {
      "@type": "Organization",
      "name": "Idées Casa",
      "url": "https://www.ideescasa.fr"
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] text-[#1c1917] pb-24 border-t-[12px] border-[#1c1917]">
      {/* Script Googlebot Discover */}
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="py-6 px-6 border-b border-stone-200 sticky top-0 bg-[#fdfbf7]/90 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Retour Accueil
          </Link>
          <span className="font-serif tracking-widest text-sm opacity-80 underline underline-offset-4 decoration-stone-200 uppercase">
            Le Lab Idées Casa
          </span>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 mt-16 md:mt-24">
        <header className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a48437] mb-8">
            <span>Expertise Maison & Cuisine</span>
            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
            <span className="text-stone-500 font-normal flex items-center gap-1">
              <Clock className="w-3 h-3"/> {readTime} min de lecture
            </span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl mb-6 leading-tight uppercase tracking-tight text-stone-900 italic">
            {article.title} {/* ◄ CORRIGÉ */}
          </h1>

          {publishDate && (
            <div className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-8 italic">
              <Calendar className="w-3 h-3 text-stone-300" />
              <span>Mis à jour le {publishDate}</span>
            </div>
          )}

          <div className="w-24 h-px bg-stone-300 mx-auto"></div>
        </header>

        {/* RENDU HISTORIQUE CONSERVÉ À 100% AVEC TES STYLES DE LETTRINE */}
        <div 
          className="font-light leading-relaxed text-[18px] md:text-[20px] text-stone-800 space-y-6
          [&>p:first-of-type::first-letter]:float-left [&>p:first-of-type::first-letter]:text-7xl 
          [&>p:first-of-type::first-letter]:pr-3 [&>p:first-of-type::first-letter]:font-serif 
          [&>p:first-of-type::first-letter]:text-stone-900
          [&>h2]:text-3xl [&>h2]:font-serif [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:text-stone-900 [&>h2]:uppercase [&>h2]:tracking-tight
          [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6"
          dangerouslySetInnerHTML={{ __html: cleanContent }} 
        />

        <footer className="mt-24 pt-12 border-t border-stone-200 text-center">
          <p className="text-stone-400 text-sm mb-8 italic">
            Analyse rédigée par l'équipe éditoriale d'Idées Casa. <br/>
            Expertise indépendante garantie.
          </p>
          <Link href="/" className="inline-block px-10 py-4 border border-stone-900 text-[10px] uppercase font-bold tracking-widest hover:bg-stone-900 hover:text-white transition-all">
            Consulter les guides d'achat
          </Link>
        </footer>
      </article>
    </main>
  );
}
