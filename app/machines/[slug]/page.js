{/* ENRICHISSEMENT SÉMANTIQUE PAR FUSION TECH & IA */}
      <div className="max-w-6xl mx-auto px-6">
        {product?.specs && (
          <section className="mt-16 border-t border-stone-200 pt-16 text-left">
            <h3 className="font-serif text-3xl text-stone-900 mb-8 italic font-bold">
              Analyse des Caractéristiques & Verdict
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Les Points Forts */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-sm">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-emerald-800 mb-4">Les Points Forts</h4>
                {Array.isArray(product.specs?.pros) && product.specs.pros.length > 0 ? (
                  <ul className="space-y-2 text-sm text-stone-600 font-light">
                    {product.specs.pros.map((pro, i) => (
                      <li key={i}>✓ {pro}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-stone-400 italic text-sm">Aucun avantage spécifique détecté.</p>
                )}
              </div>

              {/* Les Limites */}
              <div className="bg-red-50/50 border border-red-100 p-6 rounded-sm">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-red-800 mb-4">Les Limites à prendre en compte</h4>
                {Array.isArray(product.specs?.cons) && product.specs.cons.length > 0 ? (
                  <ul className="space-y-2 text-sm text-stone-600 font-light">
                    {product.specs.cons.map((con, i) => (
                      <li key={i}>✕ {con}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-stone-400 italic text-sm">Aucune limitation majeure détectée.</p>
                )}
              </div>
            </div>

            {/* 2. TABLEAU TECHNIQUE COMPLET */}
            <div className="bg-white border border-stone-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm font-light text-stone-600">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-left font-bold text-stone-700 text-xs uppercase tracking-wider">
                    <th className="p-4">Indicateur Technique</th>
                    <th className="p-4">Spécification Nominale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {product.specs?.reservoir_eau_litres && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30 w-1/2">Capacité du réservoir</td>
                      <td className="p-4">{product.specs.reservoir_eau_litres} Litres</td>
                    </tr>
                  )}
                  {product.specs?.pression_bars && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30">Pression de la pompe</td>
                      <td className="p-4">{product.specs.pression_bars} Bars</td>
                    </tr>
                  )}
                  {product.specs?.puissance_watts && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30">Puissance nominale</td>
                      <td className="p-4">{product.specs.puissance_watts} Watts</td>
                    </tr>
                  )}
                  {product.specs?.broyeur_integre !== undefined && product.specs?.broyeur_integre !== null && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30">Broyeur à grains intégré</td>
                      <td className="p-4">{product.specs.broyeur_integre ? "Oui (Moulin intégré)" : "Non"}</td>
                    </tr>
                  )}
                  {product.specs?.capacite_grains_grammes && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30">Capacité du bac à grains</td>
                      <td className="p-4">{product.specs.capacite_grains_grammes} grammes</td>
                    </tr>
                  )}
                  {product.specs?.type_chauffe && (
                    <tr>
                      <td className="p-4 font-medium text-stone-900 bg-stone-50/30">Système de chauffe</td>
                      <td className="p-4">{product.specs.type_chauffe}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
