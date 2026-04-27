import React, { useEffect, useState } from 'react';
import { 
  Flame, Zap, Droplets, Crown, GraduationCap, 
  BookOpen, Clock, AlertTriangle, CheckCircle, 
  Info, TrendingUp, ChevronRight, Apple, Beef,
  Wind, Beaker, Fish
} from 'lucide-react';
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
import { Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api';
import { useAuthStore } from '../store/auth';
import { useNutritionStore } from '../store/nutrition';
import PremiumModal from '../components/PremiumModal';
import CalorieTrackerChart from '../components/CalorieTrackerChart';

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

const ProgressBar = ({ label, current, target, color, unit = 'g' }: any) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const isOver = current > target;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black text-stone-900 dark:text-white">
          {Math.round(current)}{unit} / {target}{unit}
        </span>
      </div>
      <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${isOver ? 'bg-rose-500' : color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const RecommendationCard = ({ rec }: { rec: any }) => {
  const icons: any = {
    calories: <Flame className="w-5 h-5" />,
    protein: <Beef className="w-5 h-5" />,
    carbs: <Apple className="w-5 h-5" />,
    fat: <Wind className="w-5 h-5" />,
    sugar: <AlertTriangle className="w-5 h-5" />,
    sodium: <Beaker className="w-5 h-5" />,
    fiber: <Apple className="w-5 h-5" />,
    balance: <CheckCircle className="w-5 h-5" />
  };

  const colors: any = {
    high: 'rose',
    medium: 'amber',
    low: 'emerald'
  };

  return (
    <div className={`card-premium p-6 border-l-4 border-${colors[rec.priority]}-500 bg-white dark:bg-stone-900/40`}>
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-xl bg-${colors[rec.priority]}-50 dark:bg-${colors[rec.priority]}-900/20 flex items-center justify-center text-${colors[rec.priority]}-600`}>
          {icons[rec.category] || <Info className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h5 className="font-black text-stone-900 dark:text-white text-sm mb-1">{rec.title}</h5>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium leading-relaxed mb-3">
            {rec.description}
          </p>
          <div className="space-y-1">
            {rec.suggestedActions.map((action: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-stone-600 dark:text-stone-300">
                <ChevronRight className="w-3 h-3 text-wine-500" />
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { stats, fetchStats } = useNutritionStore();
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [statsRes, profileRes] = await Promise.all([
          fetchStats(),
          api.get('/students/profile')
        ]);
        setStudentProfile(profileRes.data.data);
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        setProfileError(err.response?.data?.error || 'Error al cargar perfil');
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, [fetchStats]);

  const todayStr = new Date().toDateString();
  const todayStats = stats?.[todayStr] || { 
    calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0, fiber: 0 
  };
  const targets = studentProfile?.nutritionalTargets || {
    calories: 2000, protein: 75, carbs: 275, fat: 65, sugar: 50, sodium: 2300, fiber: 30, water: 2.5, bmi: 22, bmiCategory: 'Normal'
  };

  // Advanced Visuals Calculations
  const getWeeklyStats = () => {
    const dates = Object.keys(stats || {}).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).slice(0, 7);
    if (dates.length === 0) return null;

    const totals = dates.reduce((acc: any, date) => {
      const s = stats![date];
      return {
        calories: acc.calories + s.calories,
        protein: acc.protein + s.protein,
        carbs: acc.carbs + s.carbs,
        fat: acc.fat + s.fat,
        sugar: acc.sugar + s.sugar,
        sodium: acc.sodium + s.sodium,
        fiber: acc.fiber + s.fiber
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0, fiber: 0 });

    const averages = {
      calories: Math.round(totals.calories / dates.length),
      protein: Math.round(totals.protein / dates.length),
      carbs: Math.round(totals.carbs / dates.length),
      fat: Math.round(totals.fat / dates.length),
      sugar: Math.round(totals.sugar / dates.length),
      sodium: Math.round(totals.sodium / dates.length),
      fiber: Math.round(totals.fiber / dates.length)
    };

    // Calculate alignment score (0-100)
    const nutrients = ['calories', 'protein', 'carbs', 'fat'];
    const scores = nutrients.map(n => {
      const pct = Math.min((averages as any)[n] / (targets as any)[n], 1.2); // Cap at 120%
      return pct > 1 ? 1 - (pct - 1) : pct; // Penalize overconsumption
    });
    const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);

    // Find extremes
    const nutrientPcts = nutrients.map(n => ({
      name: n === 'calories' ? 'Calorías' : n === 'protein' ? 'Proteína' : n === 'carbs' ? 'Carbos' : 'Grasas',
      pct: (averages as any)[n] / (targets as any)[n]
    }));
    const sorted = [...nutrientPcts].sort((a, b) => b.pct - a.pct);

    return { averages, score: avgScore, highest: sorted[0], lowest: sorted[sorted.length - 1], count: dates.length };
  };

  const weeklyData = getWeeklyStats();

  const generatePDFReport = () => {
    if (!weeklyData) return;

    const doc = new jsPDF();
    const primaryColor = [127, 29, 29]; // wine-900

    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE NUTRICIONAL SEMANAL', 20, 25);
    doc.setFontSize(10);
    doc.text(`CBTis 75 - Nutrición Inteligente | Generado el ${new Date().toLocaleDateString()}`, 20, 32);

    // Student Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Información del Estudiante', 20, 55);
    doc.setFontSize(10);
    doc.text(`Nombre: ${user?.student?.firstName} ${user?.student?.lastName}`, 20, 65);
    doc.text(`Email: ${user?.student?.email}`, 20, 70);
    doc.text(`Semestre: ${user?.student?.semester}º`, 20, 75);
    doc.text(`Meta: ${user?.student?.goal?.replace('_', ' ') || 'Saludable'}`, 20, 80);
    doc.text(`IMC: ${targets.bmi} (${targets.bmiCategory})`, 20, 85);

    // Summary Table
    doc.setFontSize(14);
    doc.text('Resumen de Consumo Promedio', 20, 100);
    
    const tableData = [
      ['Nutriente', 'Promedio Diario', 'Meta Diaria', 'Estado'],
      ['Calorías', `${weeklyData.averages.calories} kcal`, `${targets.calories} kcal`, weeklyData.averages.calories > targets.calories ? 'Exceso' : 'Adecuado'],
      ['Proteína', `${weeklyData.averages.protein}g`, `${targets.protein}g`, weeklyData.averages.protein < targets.protein ? 'Bajo' : 'Adecuado'],
      ['Carbos', `${weeklyData.averages.carbs}g`, `${targets.carbs}g`, 'Adecuado'],
      ['Grasas', `${weeklyData.averages.fat}g`, `${targets.fat}g`, 'Adecuado'],
      ['Azúcares', `${weeklyData.averages.sugar}g`, `${targets.sugar}g`, weeklyData.averages.sugar > targets.sugar ? 'Alto' : 'Adecuado'],
      ['Sodio', `${weeklyData.averages.sodium}mg`, `${targets.sodium}mg`, 'Adecuado'],
      ['Fibra', `${weeklyData.averages.fiber}g`, `${targets.fiber}g`, weeklyData.averages.fiber < targets.fiber ? 'Bajo' : 'Adecuado'],
    ];

    autoTable(doc, {
      startY: 110,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: primaryColor },
      styles: { fontSize: 9 }
    });

    // Recommendations
    const finalY = (doc as any).lastAutoTable.finalY || 180;
    doc.setFontSize(14);
    doc.text('Recomendaciones de Salud', 20, finalY + 15);
    
    let currentY = finalY + 25;
    studentProfile?.omsRecommendations?.slice(0, 3).forEach((rec: any) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(rec.title, 20, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const splitDesc = doc.splitTextToSize(rec.description, 170);
      doc.text(splitDesc, 20, currentY + 5);
      currentY += (splitDesc.length * 5) + 10;
    });

    // ODS Hambre Cero Note
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(20, 260, 170, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('Este reporte apoya el ODS 2: Hambre Cero. Recuerda reducir el desperdicio de alimentos', 25, 272);

    doc.save(`Reporte_Nutricional_${user?.student?.firstName}_${new Date().toISOString().slice(0,10)}.pdf`);
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
        hoverOffset: 10
      },
    ],
  };

  if (initialLoading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-4">
      <div className="w-16 h-16 border-4 border-wine-100 border-t-wine-700 rounded-full animate-spin" />
      <p className="text-stone-400 font-black uppercase tracking-[0.3em] text-xs">Sincronizando Nutrición...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-slide-up pb-20">
      {/* Header Profile Section */}
      <div className="card-premium p-8 bg-stone-50 dark:bg-stone-900/50 border-wine-100/50">
        <div className="flex flex-col xl:flex-row gap-10 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-wine-700 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-xl transform group-hover:rotate-12 transition-transform duration-500">
                {(user?.student?.firstName?.[0] || 'U')}{(user?.student?.lastName?.[0] || '')}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white dark:border-stone-900 flex items-center justify-center text-white">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tighter">
                  {user?.student?.firstName} {user?.student?.lastName}
                </h2>
                <span className="px-3 py-1 bg-wine-50 text-wine-700 dark:bg-wine-900/30 dark:text-wine-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Estudiante CBTis 75
                </span>
              </div>
              <p className="text-stone-500 font-bold text-xs mt-1 uppercase tracking-widest">{user?.student?.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Semestre</p>
              <div className="flex items-center gap-2 text-stone-900 dark:text-white">
                <GraduationCap className="w-4 h-4 text-wine-600" />
                <span className="font-black">{user?.student?.semester}º</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">IMC</p>
              <div className="flex items-center gap-2 text-stone-900 dark:text-white">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="font-black">{targets.bmi} ({targets.bmiCategory})</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Meta</p>
              <div className="flex items-center gap-2 text-stone-900 dark:text-white">
                <Info className="w-4 h-4 text-amber-500" />
                <span className="font-black capitalize">{user?.student?.goal?.replace('_', ' ') || 'Saludable'}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-stone-800 px-6 py-4 rounded-[1.5rem] border-2 border-dashed border-wine-100 dark:border-wine-900/30 flex items-center gap-4">
              <div>
                <p className="text-[9px] font-black text-wine-700 uppercase tracking-widest">Código Parental</p>
                <p className="text-lg font-black text-stone-900 dark:text-white tracking-widest leading-none mt-1">
                  {studentProfile?.parentAccessCode || '---'}
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>

    {/* Advanced Insights Panel */}
    {weeklyData && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        <div className="card-premium p-6 bg-white dark:bg-stone-900/40 border-l-4 border-emerald-500">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Nivel General</p>
          <div className="flex items-end justify-between">
            <h4 className="text-3xl font-black text-stone-900 dark:text-white">{weeklyData.score}%</h4>
            <span className={`text-[10px] font-black px-2 py-1 rounded-md ${
              weeklyData.score > 80 ? 'bg-emerald-100 text-emerald-700' : 
              weeklyData.score > 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {weeklyData.score > 80 ? 'Excelente' : weeklyData.score > 50 ? 'Regular' : 'Mejorable'}
            </span>
          </div>
        </div>
        <div className="card-premium p-6 bg-white dark:bg-stone-900/40 border-l-4 border-wine-500">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Promedio Calórico</p>
          <div className="flex items-end justify-between">
            <h4 className="text-3xl font-black text-stone-900 dark:text-white">{weeklyData.averages.calories}</h4>
            <span className="text-[10px] font-bold text-stone-400 mb-1">kcal / día</span>
          </div>
        </div>
        <div className="card-premium p-6 bg-white dark:bg-stone-900/40 border-l-4 border-amber-500">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Nutriente más alto</p>
          <div className="flex items-end justify-between">
            <h4 className="text-xl font-black text-stone-900 dark:text-white">{weeklyData.highest.name}</h4>
            <span className="text-[10px] font-bold text-amber-600">{(weeklyData.highest.pct * 100).toFixed(0)}% meta</span>
          </div>
        </div>
        <div className="card-premium p-6 bg-white dark:bg-stone-900/40 border-l-4 border-sky-500">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Días Registrados</p>
          <div className="flex items-end justify-between">
            <h4 className="text-3xl font-black text-stone-900 dark:text-white">{weeklyData.count}</h4>
            <span className="text-[10px] font-bold text-stone-400 mb-1">esta semana</span>
          </div>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Macro & Micro Progress */}
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="card-premium p-10 bg-white dark:bg-stone-900/40">
              <h3 className="text-xl font-black text-stone-900 dark:text-white tracking-tighter mb-8 flex items-center gap-3">
                <Flame className="w-6 h-6 text-wine-600" />
                Métricas de Hoy
              </h3>
              <div className="space-y-8">
                <ProgressBar label="Calorías" current={todayStats.calories} target={targets.calories} color="bg-wine-700" unit="kcal" />
                <ProgressBar label="Proteínas" current={todayStats.protein} target={targets.protein} color="bg-emerald-500" />
                <ProgressBar label="Carbohidratos" current={todayStats.carbs} target={targets.carbs} color="bg-amber-500" />
                <ProgressBar label="Grasas" current={todayStats.fat} target={targets.fat} color="bg-rose-500" />
              </div>
            </div>

            <div className="card-premium p-10 bg-white dark:bg-stone-900/40">
              <h3 className="text-xl font-black text-stone-900 dark:text-white tracking-tighter mb-8 flex items-center gap-3">
                <Info className="w-6 h-6 text-amber-500" />
                Semáforo de Salud
              </h3>
              <div className="space-y-8">
                <ProgressBar label="Azúcares" current={todayStats.sugar} target={targets.sugar} color="bg-amber-400" />
                <ProgressBar label="Sodio" current={todayStats.sodium} target={targets.sodium} color="bg-rose-400" unit="mg" />
                <ProgressBar label="Fibra" current={todayStats.fiber} target={targets.fiber} color="bg-emerald-400" />
                
                <div className="pt-4 p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <Droplets className="w-8 h-8 text-sky-500" />
                    <div>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Hidratación Meta</p>
                      <p className="text-xl font-black text-stone-900 dark:text-white">{targets.water} Litros</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CalorieTrackerChart />

          {/* ODS Hambre Cero Section */}
          <div className="card-premium p-10 bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">Módulo Hambre Cero</h3>
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">ODS 2 - Nutrición Sostenible</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl">
                  <h4 className="font-black text-sm mb-2 uppercase tracking-tighter">Salud Global</h4>
                  <p className="text-xs text-emerald-50 leading-relaxed">Combatir la desnutrición y la obesidad simultáneamente es el reto del siglo XXI.</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl">
                  <h4 className="font-black text-sm mb-2 uppercase tracking-tighter">Sostenibilidad</h4>
                  <p className="text-xs text-emerald-50 leading-relaxed">Reduce el desperdicio. Consume productos locales y de temporada del CBTis.</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl">
                  <h4 className="font-black text-sm mb-2 uppercase tracking-tighter">Tips Económicos</h4>
                  <p className="text-xs text-emerald-50 leading-relaxed">Legumbres y frutas locales: opciones baratas y altamente nutritivas para estudiantes.</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl">
                  <h4 className="font-black text-sm mb-2 uppercase tracking-tighter">Impacto Social</h4>
                  <p className="text-xs text-emerald-50 leading-relaxed">Una buena alimentación mejora el rendimiento escolar y el futuro de nuestra comunidad.</p>
                </div>
              </div>
              <button className="px-8 py-3 bg-white text-emerald-700 rounded-xl font-black text-sm hover:bg-emerald-50 transition-colors">
                Explorar Guía ODS
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          </div>
        </div>

        {/* Right Column: Analysis & Recommendations */}
        <div className="space-y-10">
          <div className="card-premium p-10 text-center bg-white dark:bg-stone-900/40">
            <h3 className="text-xl font-black text-stone-900 dark:text-white tracking-tighter mb-10">Distribución de Hoy</h3>
            <div className="relative w-56 h-56 mx-auto mb-10">
              <Doughnut data={doughnutData} options={{ cutout: '82%', plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Macros</p>
                <p className="text-2xl font-black text-stone-900 dark:text-white">Análisis</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-widest">Proteína</span>
                </div>
                <span className="text-sm font-black text-stone-900 dark:text-white">{Math.round(todayStats.protein)}g</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                  <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-widest">Carbos</span>
                </div>
                <span className="text-sm font-black text-stone-900 dark:text-white">{Math.round(todayStats.carbs)}g</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                  <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-widest">Grasas</span>
                </div>
                <span className="text-sm font-black text-stone-900 dark:text-white">{Math.round(todayStats.fat)}g</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-stone-900 dark:text-white tracking-tighter flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-wine-600" />
              Riesgos y Consejos IA
            </h3>
            <div className="space-y-4">
              {studentProfile?.omsRecommendations?.length > 0 ? (
                studentProfile.omsRecommendations.map((rec: any, i: number) => (
                  <RecommendationCard key={i} rec={rec} />
                ))
              ) : (
                <div className="card-premium p-10 text-center border-2 border-dashed border-stone-100 dark:border-stone-800">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-black text-stone-400 uppercase tracking-widest">¡Vas por buen camino!</p>
                  <p className="text-xs text-stone-400 font-medium mt-1">Sigue registrando para más consejos.</p>
                </div>
              )}
            </div>
          </div>

          <div className="card-premium p-8 bg-wine-700 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-2 flex items-center gap-2">
                <Crown className="w-6 h-6" />
                Plan Escolar
              </h4>
              <p className="text-wine-100 text-xs mb-6 font-medium leading-relaxed">
                Accede a reportes detallados en PDF y análisis históricos semanales.
              </p>
              <button 
                onClick={generatePDFReport}
                className="w-full py-4 bg-white text-wine-700 rounded-2xl font-black text-sm hover:bg-wine-50 transition-all active:scale-95 shadow-xl"
              >
                Generar Reporte PDF
              </button>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </div>

      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
