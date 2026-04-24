import React, { useEffect, useState } from 'react';
import { BarChart, Users, Database, ArrowUpRight, TrendingUp } from 'lucide-react';
import api from '../api';

const StatCard = ({ icon, label, value, trend }: any) => (
  <div className="card-premium p-8">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-wine-50 text-wine-700 rounded-2xl flex items-center justify-center dark:bg-wine-900/30">
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest dark:bg-emerald-900/30">
        {trend}
      </span>
    </div>
    <p className="text-xs font-black text-stone-400 uppercase mb-1 tracking-widest">{label}</p>
    <p className="text-3xl font-black text-stone-900 dark:text-white">{value}</p>
  </div>
);

const Admin: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-20">Cargando estadísticas...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h2 className="text-5xl font-black text-stone-900 dark:text-white tracking-tighter mb-4">Panel Administrativo</h2>
          <p className="text-stone-500 dark:text-stone-400 font-medium">Toma de decisiones basada en la salud del plantel CBT 75.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-wine-50 text-wine-700 rounded-xl font-bold text-sm dark:bg-wine-900/30">Descargar Reporte</button>
          <button className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold text-sm dark:bg-stone-800">Exportar Datos</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users />} label="Total Estudiantes" value={stats.totalStudents} trend="+5%" />
        <StatCard icon={<Database />} label="Registros de Alimentos" value={stats.totalFoodLogs} trend="+12%" />
        <StatCard icon={<TrendingUp />} label="Promedio Calorías" value="1,850 kcal" trend="-2%" />
        <StatCard icon={<BarChart />} label="Participación" value="68%" trend="+8%" />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="card-premium p-10">
          <h3 className="text-2xl font-black mb-10 flex items-center justify-between">
            Alimentos más consumidos
            <ArrowUpRight className="w-6 h-6 text-stone-300" />
          </h3>
          <div className="space-y-6">
            {stats.topDishes.map((dish: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl dark:bg-stone-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-wine-700 text-white rounded-xl flex items-center justify-center font-black">
                    {i + 1}
                  </div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 capitalize">{dish.itemName || 'Platillo'}</span>
                </div>
                <span className="font-black text-wine-700">{dish._count.dishId || dish._count} consumos</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-premium p-10">
          <h3 className="text-2xl font-black mb-10 flex items-center justify-between">
            Consumo por Semestre
            <ArrowUpRight className="w-6 h-6 text-stone-300" />
          </h3>
          <div className="space-y-6">
            {Object.entries(stats.semesterAverages || {}).map(([semester, data]: [string, any], i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between text-sm font-black text-stone-400 uppercase tracking-widest">
                  <span>{semester}º Semestre</span>
                  <span className="text-wine-700">{((data?.total || 0) / (data?.count || 1)).toFixed(0)} kcal avg</span>
                </div>
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden dark:bg-stone-900">
                  <div className="h-full bg-wine-700" style={{ width: `${Math.min(((data?.total || 0) / (data?.count || 1)) / 25, 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
