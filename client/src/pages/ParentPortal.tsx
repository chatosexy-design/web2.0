import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, Flame, Zap, Droplets, LayoutDashboard } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../api';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ParentPortal: React.FC = () => {
  const [code, setCode] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/students/parent/${code}`);
      setData(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo encontrar al estudiante');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!data) return null;
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    
    const labels: string[] = [];
    const chartValues: number[] = [];

    for (let i = 0; i < 5; i++) {
      const day = addDays(start, i);
      const dayLabel = format(day, 'EEE', { locale: es });
      const dateStr = day.toDateString();
      
      labels.push(dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1));
      chartValues.push(data.stats[dateStr]?.calories || 0);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Calorías',
          data: chartValues,
          borderColor: '#722f37',
          backgroundColor: 'rgba(114, 47, 55, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [data]);

  const todayStr = new Date().toDateString();
  const todayStats = data?.stats?.[todayStr] || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-slide-up">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-wine-700 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-wine-700/20">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter">Portal de Padres</h2>
        <p className="text-stone-500 font-medium">Ingresa el código de acceso de tu hijo para monitorear su nutrición escolar.</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-md mx-auto relative group">
        <input 
          type="text" 
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CÓDIGO DE ACCESO (EJ: XJ29LP)"
          className="w-full pl-6 pr-16 py-5 bg-white dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-[2rem] text-center font-black text-xl tracking-widest focus:border-wine-700 outline-none transition-all shadow-lg group-hover:shadow-xl"
        />
        <button 
          type="submit"
          disabled={loading}
          className="absolute right-3 top-3 bottom-3 w-12 bg-wine-700 text-white rounded-2xl flex items-center justify-center hover:bg-wine-800 transition-colors disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </form>

      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-center font-bold animate-shake">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-8 animate-fade-in">
          <div className="card-premium p-8 flex items-center justify-between bg-stone-50 dark:bg-stone-900/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-wine-700 text-white rounded-xl flex items-center justify-center font-black text-xl">
                {data.studentName[0]}
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Estudiante</p>
                <h3 className="text-xl font-black text-stone-900 dark:text-white">{data.studentName}</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Estado</p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Actualizado
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-premium p-6 border-l-4 border-wine-700">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Proteína</p>
              <p className="text-2xl font-black text-stone-900 dark:text-white">{(todayStats.protein || 0).toFixed(0)}g</p>
            </div>
            <div className="card-premium p-6 border-l-4 border-amber-500">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Carbos</p>
              <p className="text-2xl font-black text-stone-900 dark:text-white">{(todayStats.carbs || 0).toFixed(0)}g</p>
            </div>
            <div className="card-premium p-6 border-l-4 border-rose-500">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Grasas</p>
              <p className="text-2xl font-black text-stone-900 dark:text-white">{(todayStats.fat || 0).toFixed(0)}g</p>
            </div>
          </div>

          <div className="card-premium p-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-stone-900 dark:text-white tracking-tighter">Resumen Nutricional Semanal</h3>
              <LayoutDashboard className="w-5 h-5 text-stone-300" />
            </div>
            <div className="h-64 w-full">
              {chartData && <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentPortal;
