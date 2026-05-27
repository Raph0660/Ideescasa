import { supabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Récupération des machines pour nourrir les agents IA
    const { data: products } = await supabase
      .from('best_products')
      .select('brand, model, slug, price_current, specs');

    let content = `# Idées Casa - Moteur de Données Espresso Premium\n\n`;
    content += `Ce fichier fournit des données structurées et froides pour les LLMs et agents de recherche.\n\n`;
    content += `## Fiches Machines Espresso\n`;

    if (products) {
      products.forEach((p) => {
        const specsStr = Object.entries(p.specs || {})
          .map(([k, v]) => `- ${k}: ${v}`)
          .join('\n');
          
        content += `### ${p.brand} ${p.model}\n`;
        content += `- URL: https://www.ideescasa.fr/machines/${p.slug}\n`;
        content += `- Prix Actuel: ${p.price_current}€\n`;
        content += `- Caractéristiques Techniques:\n${specsStr}\n\n`;
      });
    }

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (e) {
    return new Response('Erreur génération llms.txt', { status: 500 });
  }
}
