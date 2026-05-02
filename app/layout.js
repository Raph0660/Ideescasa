import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata = {
  title: 'MUTHOS — L\'Ingénierie de l\'Espresso d\'Exception',
  description: 'Analyses techniques approfondies des machines espresso semi-professionnelles. La Marzocco, Rocket, Lelit, ECM : verdict ingénierie sans compromis.',
  keywords: 'machine espresso, La Marzocco, Rocket Espresso, Lelit, ECM, machine café professionnelle, espresso semi-pro',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#fdfbf7] text-gray-900 font-sans antialiased">
        <header className="sticky top-0 z-50 bg-[#fdfbf7]/95 backdrop-blur-sm border-b border-gray-200">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-serif text-2xl tracking-tight">
              MUTHOS
            </a>
            <div className="flex gap-8 text-sm">
              <a href="/espresso-premium" className="hover:text-amber-700 transition-colors">
                Espresso Premium
              </a>
              <a href="/le-verdict" className="hover:text-amber-700 transition-colors">
                Le Verdict
              </a>
            </div>
          </nav>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="border-t border-gray-200 mt-24 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
            <p className="font-serif mb-2">MUTHOS</p>
            <p>L'ingénierie des rituels d'exception — Espresso Premium</p>
            <p className="mt-4 text-xs">
              Les liens présents sur ce site sont des liens d'affiliation. 
              En cas d'achat, nous percevons une commission sans surcoût pour vous.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
