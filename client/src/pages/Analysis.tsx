import React, { useState } from 'react';
import { Search, Zap, CheckCircle } from 'lucide-react';
import api from '../api';

const Analysis: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [refinedQuery, setRefinedQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);
    setRefinedQuery('');
    try {
      const res = await api.post('/nutrition/analyze', { query });
      setResult(res.data.data);
      // Opcional: El backend podría devolver la query refinada para mostrarla
      if (res.data.refinedQuery) {
        setRefinedQuery(res.data.refinedQuery);
      }
    } catch (err) {
      console.error(err);
      alert('No pudimos analizar esa combinación. Intenta ser más específico con los ingredientes principales (ej: "Hamburguesa doble y refresco").');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-slide-up">
      <div className="text-center">
        <h2 className="text-5xl font-black text-stone-900 dark:text-white tracking-tighter mb-4">Analizador Inteligente</h2>
        <p className="text-stone-500 dark:text-stone-400 font-medium">Describe tu comida de forma natural y deja que la IA haga el resto.</p>
      </div>

      <div className="space-y-4">
        <div className="card-premium p-2 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Ej: 2 tacos de carne con queso y una coca de 600ml..." 
              className="w-full pl-16 pr-6 py-5 bg-transparent border-none focus:ring-0 text-lg font-bold text-stone-800 dark:text-white placeholder:text-stone-300"
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary px-8 py-4"
          >
            {loading ? 'Analizando...' : 'Analizar'}
          </button>
        </div>
        {refinedQuery && (
          <p className="text-center text-xs font-bold text-stone-400 uppercase tracking-widest animate-fade-in">
            Interpretado como: <span className="text-wine-700">{refinedQuery}</span>
          </p>
        )}
      </div>

      {result && (
        <div className="card-premium p-10 max-w-4xl mx-auto overflow-hidden relative animate-slide-up">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-stone-100 rounded-[2rem] flex items-center justify-center text-wine-700 shadow-inner dark:bg-stone-800">
                  <Zap className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-stone-900 dark:text-white capitalize">{result.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 bg-wine-50 text-wine-700 rounded-full text-[10px] font-black uppercase tracking-widest dark:bg-wine-900/30">Análisis IA</span>
                    <span className="px-3 py-1 bg-sano-50 text-sano-700 rounded-full text-[10px] font-black uppercase tracking-widest dark:bg-sano-900/30">Basado en tu entrada</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <NutrientBox label="Calorías" value={result.calories.toFixed(0)} unit="kcal" />
                <NutrientBox label="Proteína" value={result.protein.toFixed(1)} unit="g" color="text-emerald-600" />
              </div>
            </div>

            <div className="w-full md:w-80 space-y-6">
              <ProgressBar label="Grasas" value={result.fat} color="rose" />
              <ProgressBar label="Carbohidratos" value={result.carbs} color="amber" />
              <div className="p-6 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center gap-3 font-bold border border-emerald-100">
                <CheckCircle className="w-5 h-5" /> ¡Análisis completado!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NutrientBox = ({ label, value, unit, color = 'text-wine-700' }: any) => (
  <div className="p-6 bg-stone-50 rounded-3xl dark:bg-stone-800/50">
    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-4xl font-black ${color}`}>{value} <span className="text-sm font-bold text-stone-400">{unit}</span></p>
  </div>
);

const ProgressBar = ({ label, value, color }: any) => (
  <div className="p-6 bg-white border border-stone-100 rounded-3xl dark:bg-stone-800 dark:border-stone-700 shadow-sm">
    <div className="flex justify-between mb-3">
      <span className="text-xs font-bold text-stone-400 uppercase">{label}</span>
      <span className={`text-sm font-black text-${color}-500`}>{value.toFixed(1)}g</span>
    </div>
    <div className="h-2 bg-stone-100 rounded-full overflow-hidden dark:bg-stone-900">
      <div className={`h-full bg-${color}-500`} style={{ width: `${Math.min(value * 5, 100)}%` }}></div>
    </div>
  </div>
);

export default Analysis;
