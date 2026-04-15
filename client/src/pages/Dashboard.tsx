import React, { useEffect, useState } from 'react';
import { Flame, Zap, Droplets, Crown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import api from '../api';
import { useAuthStore } from '../store/auth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/students/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const todayStr = new Date().toDateString();
  const todayStats = stats?.[todayStr] || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const lineData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Calorías',
        data: [0, 0, 0, 0, 0, 0, 0], // In a real app, populate from weekly data
        borderColor: '#722f37',
        backgroundColor: 'rgba(114, 47, 55, 0.05)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ['Proteína', 'Carbos', 'Grasas'],
    datasets: [
      {
        data: todayStats.protein + todayStats.carbs + todayStats.fat > 0 
          ? [todayStats.protein, todayStats.carbs, todayStats.fat] 
          : [33, 33, 33],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  if (loading) return <div className="text-center py-20">Cargando dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-slide-up">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-10">
          <div>
            <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter mb-2">Mi Progreso</h2>
            <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={<Flame />} label="Proteína" value={`${todayStats.protein.toFixed(0)}g`} color="wine" />
            <StatCard icon={<Zap />} label="Carbohidratos" value={`${todayStats.carbs.toFixed(0)}g`} color="amber" />
            <StatCard icon={<Droplets />} label="Grasas" value={`${todayStats.fat.toFixed(0)}g`} color="rose" />
          </div>

          <div className="card-premium p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-stone-900 dark:text-white tracking-tighter">Consumo Semanal</h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-wine-700"></div>
                <div className="w-3 h-3 rounded-full bg-stone-100 dark:bg-stone-800"></div>
              </div>
            </div>
            <div className="h-80 w-full">
              <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-10">
          <div className="card-premium p-10 text-center">
            <h3 className="text-2xl font-black text-stone-900 dark:text-white tracking-tighter mb-10">Distribución</h3>
            <div className="relative w-64 h-64 mx-auto mb-10">
              <Doughnut data={doughnutData} options={{ cutout: '85%', plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs font-black text-stone-400 uppercase">Total</p>
                <p className="text-3xl font-black text-stone-900 dark:text-white">Macros</p>
              </div>
            </div>
            <div className="space-y-4">
              <MacroLegend color="bg-emerald-500" label="Proteína" />
              <MacroLegend color="bg-amber-500" label="Carbos" />
              <MacroLegend color="bg-rose-500" label="Grasas" />
            </div>
          </div>

          <div className="card-premium p-8 bg-wine-700 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-2">Plan Premium</h4>
              <p className="text-wine-100 text-sm mb-6 font-medium">Arquitectura profesional para el CBT 75.</p>
              <button className="w-full py-3 bg-white text-wine-700 rounded-xl font-black text-sm hover:bg-wine-50 transition-colors">Ver Detalles</button>
            </div>
            <Crown className="absolute -right-8 -bottom-8 w-40 h-40 text-wine-800/50 -rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className={`card-premium p-8 border-l-8 border-${color}-700`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 bg-${color}-50 text-${color}-700 rounded-2xl flex items-center justify-center dark:bg-${color}-900/30`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Hoy</span>
    </div>
    <p className="text-xs font-black text-stone-400 uppercase mb-1">{label}</p>
    <p className="text-3xl font-black text-stone-900 dark:text-white">{value}</p>
  </div>
);

const MacroLegend = ({ color, label }: any) => (
  <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl dark:bg-stone-800/50">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-sm font-bold text-stone-600 dark:text-stone-400">{label}</span>
    </div>
    <span className="text-sm font-black text-stone-900 dark:text-white">Media</span>
  </div>
);

export default Dashboard;
