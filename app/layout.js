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
        {/* Tu peux ajouter ici une barre de navigation commune à toutes les pages si besoin */}
        <main>
          {children}
        </main>
        
        <footer className="bg-[#1a1a1a] text-white py-20 px-6 mt-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4">
              <span className="font-serif text-3xl tracking-widest uppercase">MUTHOS</span>
              <p className="text-stone-400 max-w-xs font-light text-sm italic">
                Laboratoire indépendant d'analyse technique sur les systèmes d'extraction haute performance.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Navigation</p>
                <ul className="space-y-2 text-sm font-light">
                  <li><a href="/" className="hover:text-stone-400 transition-colors">Home</a></li>
                  <li><a href="/espresso-premium" className="hover:text-stone-400 transition-colors">Catalogue</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Légal</p>
                <ul className="space-y-2 text-sm font-light text-stone-400">
                  <li>© 2026 MUTHOS</li>
                  <li>Indépendance totale</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
