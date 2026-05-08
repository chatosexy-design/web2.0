import { create } from 'zustand';
import api from '../api';

interface NutritionStats {
  [date: string]: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    sodium: number;
    fiber: number;
  };
}

interface NutritionState {
  stats: NutritionStats;
  loading: boolean;
  fetchStats: () => Promise<void>;
  addLog: (log: any) => void;
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  stats: {},
  loading: false,
  fetchStats: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await api.get('/students/stats');
      set({ stats: res.data.data || {}, loading: false });
    } catch (err) {
      console.error('Error fetching nutrition stats:', err);
      set({ loading: false });
    }
  },
  addLog: (log: any) => {
    // Usar la fecha local del navegador para la clave del mapa, igual que en el Dashboard
    const dateStr = new Date().toDateString();
    const currentStats = get().stats;
    const dayStats = currentStats[dateStr] || { 
      calories: 0, 
      protein: 0, 
      carbs: 0, 
      fat: 0,
      sugar: 0,
      sodium: 0,
      fiber: 0
    };

    set({
      stats: {
        ...currentStats,
        [dateStr]: {
          calories: dayStats.calories + (Number(log.calories) || 0),
          protein: dayStats.protein + (Number(log.protein) || 0),
          carbs: dayStats.carbs + (Number(log.carbs) || 0),
          fat: dayStats.fat + (Number(log.fat) || 0),
          sugar: (dayStats.sugar || 0) + (Number(log.sugar) || 0),
          sodium: (dayStats.sodium || 0) + (Number(log.sodium) || 0),
          fiber: (dayStats.fiber || 0) + (Number(log.fiber) || 0),
        },
      },
    });
  },
}));
