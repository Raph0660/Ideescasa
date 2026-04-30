import { supabase } from '../lib/supabase'

export const revalidate = 3600;

export default async function Page() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')

  if (error) return <div className="p-20 text-red-500 font-serif">Erreur de liaison : {error.message}</div>

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans selection:bg-[#eaddca]">
      {/* HEADER ÉLÉGANT */}
      <header className="pt-20 pb-12 flex flex-col items-center px-6 border-b border-stone-200">
        <span className="text-[10px] uppercase tracking-[0.3em] mb-8 opacity-50 font-medium">
          Le Laboratoire d'expertise des machines de légende
        </span>
        <h1 className="font-serif text-5xl md:text-7xl tracking-tight text-center mb-6">
          MUTHOS
        </h1>
        <div className="h-px w-12 bg-black mb-6"></div>
        <p className="max-w-xl text-center text-stone-500 leading-relaxed font-light italic">
          Sélection rigoureuse des systèmes technologiques à haute performance pour une vie sans compromis.
        </p>
      </header>

      {/* GRILLE DE SÉLECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {products?.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <article className="relative overflow-hidden bg-white border border-stone-100 p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-stone-200/50">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#a48437] font-bold mb-2">
                      Expert Verdict — 9.8/10
                    </p>
                    <h2 className="font-serif text-3xl mb-1 tracking-tight uppercase">{product.brand}</h2>
                    <p className="text-stone-400 italic font-serif">{product.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl tracking-tighter">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price_current)}
                    </p>
                  </div>
                </div>

                <div className="aspect-video bg-[#f2f0eb] mb-8 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-700 ease-in-out">
                   <span className="text-stone-300 font-serif italic">[ Visualisation Système ]</span>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-8">
                  <span className="text-[10px] uppercase tracking-widest opacity-40">Stock Prioritaire</span>
                  <button className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-black pb-1 hover:opacity-50 transition-opacity">
                    Acquérir l'équipement →
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* SI VIDE */}
        {products?.length === 0 && (
          <div className="text-center py-20 opacity-30 italic font-serif">
            Le catalogue est en cours de mise à jour par l'IA...
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-stone-200 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] opacity-30">
          MUTHOS © 2026 — Excellence & Expertise
        </p>
      </footer>
    </main>
  )
}
