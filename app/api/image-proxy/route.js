/**
 * API Image Proxy pour Boulanger Scene7
 * Évite les problèmes CORS et les images cassées
 */
import { NextResponse } from 'next/server';

// Map des images de fallback par marque
const FALLBACK_IMAGES = {
  'Jura': 'https://res.cloudinary.com/demo/image/fetch/w_400,h_400,c_fill,q_auto/https://www.jura.com/medias/1170027.png',
  'Siemens': '/images/fallback/siemens-espresso.jpg',
  'Melitta': '/images/fallback/melitta-espresso.jpg',
  'Miele': '/images/fallback/miele-espresso.jpg',
  'Sage Appliances': '/images/fallback/sage-espresso.jpg',
  'DeLonghi': '/images/fallback/delonghi-espresso.jpg',
  'SMEG': '/images/fallback/smeg-espresso.jpg',
  'Philips': '/images/fallback/philips-espresso.jpg',
  'default': '/images/fallback/default-espresso.jpg'
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const productId = searchParams.get('productId');
    const brand = searchParams.get('brand') || 'default';

    // Cas 1 : URL fournie directement
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 5000,
        });

        if (response.ok && response.headers.get('content-type')?.includes('image')) {
          return new NextResponse(response.body, {
            headers: {
              'Content-Type': response.headers.get('content-type'),
              'Cache-Control': 'public, max-age=86400, immutable',
            },
          });
        }
      } catch (err) {
        console.error('❌ Image URL fetch failed:', imageUrl, err.message);
      }
    }

    // Cas 2 : Reconstruire à partir du productId (Boulanger)
    if (productId) {
      let imgId = productId;
      
      // Si c'est un code EAN (12-13 chiffres), ajouter le suffixe
      if (imgId.length >= 12) {
        if (!imgId.includes('_h_f_l_')) {
          imgId = imgId.split('_')[0] + '_h_f_l_0';
        }
      } else {
        // Code court = ajouter le suffixe complet
        imgId = imgId.split('_h_f_l_')[0] + '_h_f_l_0';
      }

      const reconstructedUrl = `https://boulanger.scene7.com/is/image/Boulanger/${imgId}?wid=400&hei=400&resMode=sharp2&op_usm=1.75,0.3,2,0&fmt=jpg`;

      try {
        const response = await fetch(reconstructedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 5000,
        });

        if (response.ok) {
          return new NextResponse(response.body, {
            headers: {
              'Content-Type': 'image/jpeg',
              'Cache-Control': 'public, max-age=86400, immutable',
            },
          });
        }
      } catch (err) {
        console.error('❌ Boulanger Scene7 reconstruction failed:', reconstructedUrl, err.message);
      }
    }

    // Cas 3 : Fallback par marque
    const fallbackUrl = FALLBACK_IMAGES[brand] || FALLBACK_IMAGES['default'];
    
    return NextResponse.redirect(fallbackUrl, { status: 302 });
  } catch (error) {
    console.error('❌ Image proxy error:', error);
    return NextResponse.json(
      { error: 'Image proxy failed' },
      { status: 500 }
    );
  }
}
