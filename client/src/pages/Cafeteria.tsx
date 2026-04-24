import React, { useEffect, useState } from 'react';
import { Utensils, Plus, Edit2, Trash2, Zap } from 'lucide-react';
import api from '../api';
import { useAuthStore } from '../store/auth';
import { useNutritionStore } from '../store/nutrition';
import { Role } from '../types';
import type { Dish } from '../types';

const Cafeteria: React.FC = () => {
  const { user } = useAuthStore();
  const { addLog } = useNutritionStore();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', price: 0, autoMacros: true });
  const [consumingId, setConsumingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const isStaff = user?.role === Role.CAFETERIA || user?.role === Role.ADMIN;
  const dishesByCategory = dishes.reduce<Record<string, Dish[]>>((acc, dish) => {
    const category = dish.category || 'Otros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(dish);
    return acc;
  }, {});

  const fetchDishes = async () => {
    try {
      const res = await api.get('/cafeteria');
      setDishes(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/cafeteria', newDish);
      setShowModal(false);
      fetchDishes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConsume = async (dish: Dish) => {
    try {
      setConsumingId(dish.id);

      // Save to backend
      const res = await api.post('/students/log-ia', { 
        query: dish.name,
        mealType: 'almuerzo' // Default for cafeteria consumption
      });

      // Update store in real-time
      addLog(res.data.data);

      setFeedbackMessage(`${dish.name} se agregó al historial y dashboard.`);

      window.setTimeout(() => {
        setFeedbackMessage('');
      }, 2500);
    } catch (error) {
      console.error('Error al guardar el consumo del platillo:', error);
      setFeedbackMessage('No se pudo registrar el platillo.');
    } finally {
      setConsumingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h2 className="text-5xl font-black text-stone-900 dark:text-white tracking-tighter mb-4">Menú de Cafetería</h2>
          <p className="text-stone-500 dark:text-stone-400 font-medium">Alimentos saludables listos para consumir en el CBT 75.</p>
          {feedbackMessage && (
            <p className="mt-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">{feedbackMessage}</p>
          )}
        </div>
        
        {isStaff && (
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary px-8 py-4 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nuevo Platillo
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20">Cargando menú...</div>
      ) : (
        <div className="space-y-12">
          {Object.entries(dishesByCategory).map(([category, categoryDishes]) => (
            <section key={category} className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-wine-700 uppercase tracking-[0.3em] mb-2">
                    Menu Escolar
                  </p>
                  <h3 className="text-3xl font-black text-stone-900 dark:text-white">{category}</h3>
                </div>
                <span className="px-4 py-2 rounded-full bg-stone-100 text-stone-500 text-xs font-black uppercase tracking-widest dark:bg-stone-800 dark:text-stone-300">
                  {categoryDishes.length} opciones
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryDishes.map((dish) => (
                  <div key={dish.id} className="card-premium p-8 group cursor-pointer">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform dark:bg-stone-800">
                        <Utensils className="w-8 h-8 text-wine-700" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-wine-700 dark:text-wine-400">${dish.price}</span>
                        {isStaff && (
                          <div className="flex gap-2 mt-2">
                            <button className="p-2 hover:bg-stone-100 rounded-lg dark:hover:bg-stone-800"><Edit2 className="w-4 h-4 text-stone-400" /></button>
                            <button className="p-2 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-900/30"><Trash2 className="w-4 h-4 text-rose-400" /></button>
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">{dish.name}</h4>
                    <p className="text-sm text-stone-500 mb-4 font-medium">{dish.description || 'Sin descripción'}</p>
                    <div className="mb-8">
                      <span className="inline-flex px-3 py-1 rounded-full bg-wine-50 text-wine-700 text-[10px] font-black uppercase tracking-widest dark:bg-wine-900/30">
                        {dish.category || 'Otros'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-stone-100 dark:border-stone-800">
                      <span className="text-xs font-black text-stone-400 uppercase tracking-widest">{dish.calories} kcal</span>
                      <button
                        onClick={() => handleConsume(dish)}
                        disabled={consumingId === dish.id}
                        className="px-6 py-2 bg-sano-50 text-sano-700 rounded-xl text-xs font-bold hover:bg-sano-600 hover:text-white transition-all disabled:opacity-60"
                      >
                        {consumingId === dish.id ? 'Agregando...' : 'Consumir'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Modal logic omitted for brevity, but UI ready */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="card-premium p-10 max-w-md w-full animate-slide-up">
            <h3 className="text-3xl font-black mb-6">Nuevo Platillo</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="text-left">
                <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Nombre</label>
                <input 
                  type="text" 
                  required 
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  placeholder="Ej: Enchiladas Verdes" 
                  className="input-premium"
                />
              </div>
              <div className="text-left">
                <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Precio</label>
                <input 
                  type="number" 
                  required 
                  value={newDish.price}
                  onChange={(e) => setNewDish({ ...newDish, price: Number(e.target.value) })}
                  placeholder="45" 
                  className="input-premium"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-wine-50 rounded-2xl dark:bg-wine-900/30">
                <Zap className="w-5 h-5 text-wine-700" />
                <span className="text-sm font-bold text-wine-700">Calcular macros con IA automáticamente</span>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-stone-400">Cancelar</button>
                <button type="submit" className="flex-1 btn-primary py-4">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cafeteria;
