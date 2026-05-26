import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Web Crypto API — Parfaitement compatible avec Vercel Edge
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  
  const cspHeader = [
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline';`, // Unsafe requis pour l'hydratation Next.js
    "style-src 'self' 'unsafe-inline';",
    "img-src 'self' data: blob: https:;",
    "font-src 'self' data: https:;",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co;",
    "frame-ancestors 'none';",
    "object-src 'none';",
    "upgrade-insecure-requests;",
  ].join(' ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.headers.set('Content-Security-Policy', cspHeader)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
