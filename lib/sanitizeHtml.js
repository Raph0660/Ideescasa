export function sanitizeHtml(rawHtml) {
  if (!rawHtml) return '';

  return rawHtml
    // 1. Sécurité : Suppression des tags dangereux
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    
    // 2. SEO : On transforme les H1 de l'IA en H2 pour ne pas détruire ton seul H1 de page
    .replace(/<h1[^>]*>/gi, '<h2 class="text-xl font-bold mt-6 mb-3">')
    .replace(/<\/h1>/gi, '</h2>')
    
    // 3. Nettoyage des attributs d'événements JS (ex: onclick, onload)
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/href="javascript:[^"]*"/gi, '');
}
