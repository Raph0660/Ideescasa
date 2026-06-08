/**
 * Service de gestion des images avec fallback intelligent
 * Gère Boulanger Scene7, Coffee-Webstore, MaxiCoffee
 */

export const IMAGE_SOURCES = {
  BOULANGER: 'boulanger',
  COFFEE_WEBSTORE: 'coffee-webstore',
  MAXICOFFEE: 'maxicoffee',
};

// FIX CLAUDE : Centralisation sur notre SVG universel pour éliminer les 404
export const BRAND_FALLBACKS = {};
export const DEFAULT_FALLBACK = '/images/fallback/default.svg';

/**
 * Identifie la source de l'URL
 */
export function getImageSource(url) {
  if (!url) return null;
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('boulanger.scene7.com')) return IMAGE_SOURCES.BOULANGER;
  if (lowerUrl.includes('coffee-webstore.com')) return IMAGE_SOURCES.COFFEE_WEBSTORE;
  if (lowerUrl.includes('maxicoffee.com')) return IMAGE_SOURCES.MAXICOFFEE;
  
  return null;
}

/**
 * Extrait le productId depuis une URL Boulanger
 */
export function extractBoulangerProductId(url) {
  if (!url) return null;
  
  // Format: https://boulanger.scene7.com/is/image/Boulanger/1170027_h_f_l_0?...
  const match = url.match(/Boulanger\/([^?&]+)/);
  return match ? match[1] : null;
}

/**
 * Reconstruit une URL Boulanger à partir du productId
 */
export function reconstructBoulangerImageUrl(productId, options = {}) {
  if (!productId) return null;

  const {
    width = 800,
    height = 800,
    quality = 'sharp2',
    format = 'jpg',
  } = options;

  let imgId = productId;
  
  // Assurer le suffixe _h_f_l_0
  if (imgId.length >= 12) {
    // Code EAN long
    if (!imgId.includes('_h_f_l_')) {
      imgId = imgId.split('_')[0] + '_h_f_l_0';
    }
  } else {
    // Code court
    imgId = imgId.split('_h_f_l_')[0] + '_h_f_l_0';
  }

  return `https://boulanger.scene7.com/is/image/Boulanger/${imgId}?wid=${width}&hei=${height}&resMode=${quality}&op_usm=1.75,0.3,2,0&fmt=${format}`;
}

/**
 * Retourne une URL d'image sécurisée avec fallback
 * Priority: URL fournie > Reconstruction (si Boulanger) > Fallback défaut
 */
export function getSafeImageUrl(product) {
  const { image_url, source_url, brand, model } = product;

  // Cas 1 : URL valide et accessible
  if (image_url && image_url !== 'RECONSTRUCT' && image_url !== '') {
    const source = getImageSource(image_url);
    
    // Si Boulanger, on peut la reconstruire si elle casse
    if (source === IMAGE_SOURCES.BOULANGER) {
      const productId = extractBoulangerProductId(image_url);
      if (productId) {
        return {
          url: image_url,
          fallbackUrl: reconstructBoulangerImageUrl(productId),
          alt: `${brand} ${model}`,
        };
      }
    }
    
    // Pour Coffee-Webstore et MaxiCoffee, utiliser directement
    return {
      url: image_url,
      fallbackUrl: DEFAULT_FALLBACK,
      alt: `${brand} ${model}`,
    };
  }

  // Cas 2 : Reconstruction depuis source_url (Boulanger)
  if (source_url?.includes('boulanger.com')) {
    const refMatch = source_url.match(/ref\/(\d+)/);
    if (refMatch) {
      const productId = refMatch[1];
      const reconstructedUrl = reconstructBoulangerImageUrl(productId);
      
      return {
        url: reconstructedUrl,
        fallbackUrl: DEFAULT_FALLBACK,
        alt: `${brand} ${model}`,
      };
    }
  }

  // Cas 3 : Fallback par défaut
  return {
    url: DEFAULT_FALLBACK,
    fallbackUrl: DEFAULT_FALLBACK,
    alt: `${brand} ${model}`,
  };
}

/**
 * Composant NextImage-ready avec gestion du fallback
 */
export function getImageProps(product) {
  const imageData = getSafeImageUrl(product);
  
  return {
    src: imageData.url,
    alt: imageData.alt,
    onError: (e) => {
      // Fallback si l'image primaire échoue
      e.currentTarget.src = imageData.fallbackUrl;
    },
  };
}
