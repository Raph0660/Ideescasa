import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata = {
  title: "Idées Casa | L'Art de l'Équipement Premium",
  description: "Expertise technique et comparateur des meilleurs équipements pour la maison. Spécialiste machines espresso haute performance.",
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-[#fdfbf7] text-[#1a1a1a]">
        <main>
          {children}
        </main>
        
        <footer className="bg-[#1a1a1a] text-white py-20 px-6 mt-24 border-t border-stone-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            
            {/* Branding & Mission */}
            <div className="space-y-4">
              <span className="font-serif text-3xl tracking-widest uppercase">Idees Casa</span>
              <p className="text-stone-400 max-w-xs font-light text-sm italic leading-relaxed">
                Le laboratoire de la maison. Analyse technique et guide d'achat indépendant sur l'équipement domestique haute performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Liens de navigation mis à jour */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Navigation</p>
                <ul className="space-y-2 text-sm font-light">
                  <li><a href="/" className="hover:text-stone-400 transition-colors">Accueil</a></li>
                  <li><a href="/sitemap.xml" className="hover:text-stone-400 transition-colors">Plan du site</a></li>
                  {/* AJOUT DES PAGES LÉGALES ICI */}
                  <li><a href="/mentions-legales" className="hover:text-stone-400 transition-colors">Mentions Légales</a></li>
                  <li><a href="/politique-confidentialite" className="hover:text-stone-400 transition-colors">Politique de Confidentialité</a></li>
                </ul>
              </div>

              {/* Mentions Légales & EEAT */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Expertise & Éthique</p>
                <ul className="space-y-2 text-sm font-light text-stone-400">
                  <li>© 2026 IdeesCasa – Rédaction & Expertise Cuisine par l'équipe IdeesCasa.</li>
                  <li className="text-[11px] leading-snug">
                    Transparence : Nos recommandations peuvent inclure des liens d'affiliation. Cela n'influence jamais nos analyses techniques.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
