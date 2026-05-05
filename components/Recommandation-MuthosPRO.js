'use client';
import { useState } from 'react';

export default function RecommandationExpertPRO({ products }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const filterProducts = () => {
    return products.filter(p => {
      const s = p.specs || {};
      // 1. Filtrage par Budget
      if (answers.budget === 'entry' && p.price_current > 1200) return false;
      if (answers.budget === 'high' && p.price_current <= 1200) return false;
      
      // 2. Filtrage par Usage (Chaudière)
      if (answers.usage === 'milk' && s.boiler_type === 'Single') return false;
      
      // 3. Filtrage par Niveau (PID)
      if (answers.level === 'expert' && s.pid === false) return false;

      return true;
    }).slice(0, 3);
  };

  const steps = [
    {
      id: 'usage',
      q: "Quel est votre profil de dégustation ?",
      options: [
        { label: "Puriste Espresso (Noir)", value: 'espresso', icon: '☕' },
        { label: "Adepte Lacté (Cappuccino)", value: 'milk', icon: '🥛' }
      ]
    },
    {
      id: 'budget',
      q: "Quel investissement envisagez-vous ?",
      options: [
        { label: "600€ - 1200€ (Sérieux)", value: 'entry' },
        { label: "Plus de 1200€ (Expert)", value: 'high' }
      ]
    },
    {
      id: 'level',
      q: "Niveau de contrôle souhaité ?",
      options: [
        { label: "Simplicité & Stabilité", value: 'simple' },
        { label: "Maîtrise Totale (PID/Profil)", value: 'expert' }
      ]
    }
  ];

  if (step > steps.length) {
    const recommended = filterProducts();
    return (
      <div className="bg-white border-2 border-[#1a1a1a] p-12 max-w-4xl mx-auto my-12">
        <h2 className="font-serif text-3xl mb-8 uppercase text-center tracking-tighter">Le Verdict du Laboratoire</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommended.length > 0 ? recommended.map(p => (
            <div key={p.id} className="text-center group">
              <img src={p.image_url} className="h-40 object-contain mx-auto mb-4 mix-blend-multiply transition-transform group-hover:scale-105" />
              <p className="text-[9px] font-bold uppercase text-amber-800">{p.brand}</p>
              <h3 className="font-serif text-sm h-12 overflow-hidden mb-4">{p.model}</h3>
              <a href={p.source_url} target="_blank" className="inline-block bg-[#1a1a1a] text-white px-4 py-2 text-[9px] font-bold uppercase tracking-widest">Analyse</a>
            </div>
          )) : (
             <p className="col-span-3 text-center italic text-stone-500">Aucune machine ne correspond exactement à ces critères exigeants. Essayez d'élargir votre budget.</p>
          )}
        </div>
        <button onClick={() => setStep(1)} className="block mx-auto mt-12 text-[10px] uppercase font-bold border-b border-black">Recommencer le diagnostic</button>
      </div>
    );
  }

  const current = steps[step - 1];
  return (
    <div className="bg-stone-50 border border-stone-200 p-12 max-w-4xl mx-auto my-12 text-center">
      <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-4 block">Étape {step}/{steps.length}</span>
      <h2 className="font-serif text-4xl mb-12 tracking-tighter text-[#1a1a1a]">{current.q}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {current.options.map(opt => (
          <button 
            key={opt.value}
            onClick={() => { setAnswers({...answers, [current.id]: opt.value}); setStep(step+1); }}
            className="bg-white border border-stone-200 py-8 px-6 hover:border-black transition-all font-serif text-xl uppercase"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
