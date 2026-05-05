'use client';
import { useState } from 'react';

export default function RecommendationQuiz({ products }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const filterProducts = () => {
    return products.filter(p => {
      // Logique de recommandation technique
      if (answers.usage === 'milk' && p.price_current < 1200) return false; // On élimine les petites chaudières pour le lait
      if (answers.level === 'pro' && !p.description.toLowerCase().includes('pid')) return false;
      if (answers.budget === 'low') return p.price_current < 1500;
      if (answers.budget === 'high') return p.price_current >= 1500;
      return true;
    }).slice(0, 3);
  };

  const steps = [
    {
      id: 'usage',
      q: "Quelle est votre consommation majoritaire ?",
      options: [
        { label: "Puriste Espresso", value: 'espresso', icon: '☕' },
        { label: "Boissons Lactées (Cappuccino...)", value: 'milk', icon: '🥛' }
      ]
    },
    {
      id: 'budget',
      q: "Votre enveloppe d'investissement ?",
      options: [
        { label: "Moins de 1500€", value: 'low' },
        { label: "Budget Illimité", value: 'high' }
      ]
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="bg-white border border-stone-200 p-12 max-w-4xl mx-auto my-24 shadow-sm">
      {step <= steps.length ? (
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-amber-800 font-bold mb-8 block">Diagnostic Muthos</span>
          <h2 className="font-serif text-4xl mb-12 tracking-tighter">{currentStepData.q}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentStepData.options.map(opt => (
              <button 
                key={opt.value}
                onClick={() => {
                  setAnswers({...answers, [currentStepData.id]: opt.value});
                  setStep(step + 1);
                }}
                className="border border-stone-200 py-8 px-4 hover:border-black transition-all font-serif text-xl uppercase tracking-tighter"
              >
                {opt.icon && <span className="block mb-2">{opt.icon}</span>}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="font-serif text-4xl mb-8">Le Verdict de l'Ingénieur</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filterProducts().map(p => (
              <div key={p.id} className="text-left space-y-4">
                <img src={p.image_url} className="h-40 object-contain mx-auto mix-blend-multiply" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">{p.brand}</p>
                <h3 className="font-serif text-lg leading-tight uppercase">{p.model}</h3>
                <a href={p.source_url} className="block text-center bg-black text-white py-3 text-[10px] font-bold uppercase tracking-widest">Voir l'analyse</a>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="mt-12 text-stone-400 text-[10px] uppercase tracking-widest underline">Recommencer le test</button>
        </div>
      )}
    </div>
  );
}
