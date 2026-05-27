import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Comparatif Machines Espresso Premium — Idées Casa';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  // On découpe le slug global (ex: "delonghi-start-vs-krups-essential")
  const rawSlugs = params.slugs.split('-vs-');
  const machineA = rawSlugs[0]?.replace(/-/g, ' ') || 'Machine A';
  const machineB = rawSlugs[1]?.replace(/-/g, ' ') || 'Machine B';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111',
          backgroundImage: 'linear-gradient(to bottom right, #1a1a1a, #0a0a0a)',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* Branding Idées Casa */}
        <div style={{ position: 'absolute', top: 50, left: 60, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 16, height: 16, backgroundColor: '#f59e0b', borderRadius: '50%', marginRight: 10 }} />
          <span style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', letterSpacing: '1px' }}>IDÉES CASA</span>
        </div>

        {/* Bloc central du Duel */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '40px' }}>
          {/* Machine A */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '42%', alignItems: 'center' }}>
            <span style={{ color: '#aaa', fontSize: 20, marginBottom: '10px', textTransform: 'uppercase' }}>Modèle A</span>
            <span style={{ color: '#fff', fontSize: 38, fontWeight: 'black', textAlign: 'center', textTransform: 'capitalize' }}>
              {machineA}
            </span>
          </div>

          {/* Badge VS */}
          <div style={{ display: 'flex', backgroundColor: '#f59e0b', borderRadius: '50%', width: '90px', height: '90px', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}>
            <span style={{ color: '#000', fontSize: 32, fontWeight: 'black', italic: true }}>VS</span>
          </div>

          {/* Machine B */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '42%', alignItems: 'center' }}>
            <span style={{ color: '#aaa', fontSize: 20, marginBottom: '10px', textTransform: 'uppercase' }}>Modèle B</span>
            <span style={{ color: '#fff', fontSize: 38, fontWeight: 'black', textAlign: 'center', textTransform: 'capitalize' }}>
              {machineB}
            </span>
          </div>
        </div>

        {/* Pied de page informatif */}
        <div style={{ position: 'absolute', bottom: 50, color: '#666', fontSize: 18 }}>
          Comparatif technique impartial — Données actualisées en mai 2026
        </div>
      </div>
    ),
    { ...size }
  );
}
