import React, { useEffect, useMemo } from 'react';
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
import { useNutritionStore } from '../store/nutrition';
import { format, startOfWeek, addDays, isWeekend } from 'date-fns';
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

const CalorieTrackerChart: React.FC = () => {
  const { stats } = useNutritionStore();
  
  const isWeekendNow = isWeekend(new Date());

  const chartData = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
    
    const labels: string[] = [];
    const data: number[] = [];

    // Get Mon to Fri
    for (let i = 0; i < 5; i++) {
      const day = addDays(start, i);
      const dayLabel = format(day, 'EEE', { locale: es });
      const dateStr = day.toDateString();
      
      labels.push(dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1));
      data.push(stats[dateStr]?.calories || 0);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Calorías',
          data: data,
          borderColor: '#722f37', // Wine color from design
          backgroundColor: 'rgba(114, 47, 55, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#722f37',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [stats]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1c1917',
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 14, weight: 'black' as const },
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y} kcal`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 10,
            weight: 'bold' as const,
          },
          color: '#a8a29e',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
            weight: 'bold' as const,
          },
          color: '#a8a29e',
        },
      },
    },
  };

  if (isWeekendNow) {
    return null; // Hidden during weekends
  }

  return (
    <div className="card-premium p-10 animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black text-stone-900 dark:text-white tracking-tighter">Consumo Semanal</h3>
          <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Lunes a Viernes</p>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-wine-700 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-stone-100 dark:bg-stone-800"></div>
        </div>
      </div>
      <div className="h-80 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CalorieTrackerChart;
