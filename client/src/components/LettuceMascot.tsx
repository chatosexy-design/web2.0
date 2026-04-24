import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Heart, Brain, Info, AlertTriangle, Smile, Meh, Frown } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import api from '../api';
import lettieImg from './img/gato.jpg';

const LettuceMascot: React.FC = () => {
  const { user } = useAuthStore();
  const [position, setPosition] = useState({ x: 50, y: 80 });
  const [expression, setExpression] = useState<'happy' | 'neutral' | 'angry'>('neutral');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string, sender: 'mascot' | 'user' }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [omsRecs, setOmsRecs] = useState<any[]>([]);

  // Cargar estadísticas nutricionales para determinar la expresión
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resProfile = await api.get('/students/profile');
        const recommendations = resProfile.data?.data?.omsRecommendations || [];
        setOmsRecs(recommendations);

        const resStats = await api.get('/students/stats');
        const remoteStats = resStats.data?.data || {};
        const todayStr = new Date().toDateString();
        const today = remoteStats[todayStr] || { calories: 0, protein: 0, carbs: 0, fat: 0 };
        
        // Asegurar que los valores sean números
        const normalizedToday = {
          calories: Number(today.calories) || 0,
          protein: Number(today.protein) || 0,
          carbs: Number(today.carbs) || 0,
          fat: Number(today.fat) || 0
        };
        setStats(normalizedToday);

        // Determinar expresión basada en prioridades de la OMS
        const hasHighPriority = recommendations.some((r: any) => r.priority === 'high');
        const hasMediumPriority = recommendations.some((r: any) => r.priority === 'medium');

        if (normalizedToday.calories === 0) {
          setExpression('neutral');
        } else if (hasHighPriority) {
          setExpression('angry');
        } else if (hasMediumPriority) {
          setExpression('neutral');
        } else {
          setExpression('happy');
        }
      } catch (err) {
        console.error('Error fetching mascot stats:', err);
      }
    };

    if (user) {
      fetchStats();
      const interval = setInterval(fetchStats, 60000); // Actualizar cada minuto
      return () => clearInterval(interval);
    }
  }, [user]);

  // Movimiento automático de la lechuga
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (!isOpen) {
        setPosition(prev => ({
          x: Math.max(5, Math.min(90, prev.x + (Math.random() * 10 - 5))),
          y: Math.max(10, Math.min(90, prev.y + (Math.random() * 10 - 5)))
        }));
      }
    }, 5000);

    return () => clearInterval(moveInterval);
  }, [isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const initialMessage = getInitialMessage();
      setMessages([{ text: initialMessage, sender: 'mascot' }]);
    }
  };

  const getInitialMessage = () => {
    if (expression === 'happy') return "¡Te ves genial hoy! Tu alimentación está muy equilibrada. ¿Quieres algún consejo para mantenerte así?";
    if (expression === 'angry') return "¡Oye! He notado que hoy tu alimentación no ha sido la mejor. Demasiadas grasas o calorías. ¡Hablemos de cómo mejorar!";
    return "¡Hola! Soy tu lechuga asistente. Hoy tu alimentación ha sido regular. ¿En qué puedo ayudarte?";
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim().toLowerCase();
    setMessages(prev => [...prev, { text: input.trim(), sender: 'user' }]);
    setInput('');
    setLoading(true);

    // Lógica de respuesta basada en recomendaciones OMS
    setTimeout(() => {
      let response = "";
      
      const adviceRequested = userText.includes('consejo') || userText.includes('ayuda') || userText.includes('mejorar') || userText.includes('oms');
      const nutritionRequested = userText.includes('comer') || userText.includes('dieta') || userText.includes('salud');

      if (adviceRequested || nutritionRequested) {
        if (omsRecs.length > 0) {
          const rec = omsRecs[0]; // Tomar la recomendación más prioritaria
          response = `Según los lineamientos de la OMS: ${rec.title}. ${rec.description} Te sugiero: ${rec.suggestedActions.join(', ')}.`;
        } else if (expression === 'happy') {
          response = "¡Tu alimentación es ejemplar según la OMS! Mantén el consumo de frutas y verduras (mínimo 400g al día) y sigue hidratándote bien.";
        } else {
          response = "La OMS recomienda una dieta equilibrada con menos del 30% de grasas y menos del 10% de azúcares libres. ¡Cuida esas proporciones!";
        }
      } else if (userText.includes('hola') || userText.includes('quien eres')) {
        response = "¡Hola! Soy Lettie. Analizo tus métricas usando los estándares de la OMS para ayudarte a estar sano. ¿En qué puedo apoyarte hoy?";
      } else {
        response = "Interesante. Recuerda que la OMS sugiere realizar al menos 150 minutos de actividad física a la semana además de comer bien. ¿Quieres ver tus recomendaciones?";
      }

      setMessages(prev => [...prev, { text: response, sender: 'mascot' }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Mascota Flotante */}
      <div 
        className="fixed z-[150] cursor-pointer transition-all duration-1000 ease-in-out hover:scale-110"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
        onClick={handleOpenChat}
      >
        <div className="relative group">
          {/* Lettie the Avocado Cat Mascot */}
          <div className="relative w-24 h-32 animate-bounce-slow">
            {/* Main Image Container */}
            <div className={`relative w-full h-full rounded-[40%_40%_20%_20%] overflow-hidden border-4 transition-colors duration-500 shadow-2xl ${
               expression === 'happy' ? 'border-emerald-400' : 
               expression === 'angry' ? 'border-rose-400' : 'border-amber-400'
             }`}>
               <img 
                 src={lettieImg} 
                 alt="Lettie Mascot"
                 className="w-full h-full object-cover"
               />
               
               {/* Expression Overlay (Subtle glow) */}
              <div className={`absolute inset-0 mix-blend-overlay opacity-30 ${
                expression === 'happy' ? 'bg-emerald-400' : 
                expression === 'angry' ? 'bg-rose-400' : 'bg-amber-400'
              }`}></div>
            </div>

            {/* Floating indicator for expression */}
            <div className="absolute -top-2 -right-2 bg-white dark:bg-stone-800 rounded-full p-1 shadow-lg border border-stone-100 dark:border-stone-700">
              {expression === 'happy' && <Smile className="w-4 h-4 text-emerald-500" />}
              {expression === 'neutral' && <Meh className="w-4 h-4 text-amber-500" />}
              {expression === 'angry' && <Frown className="w-4 h-4 text-rose-500" />}
            </div>
          </div>
          
          {/* Tooltip de estado */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-stone-800 px-3 py-1 rounded-full shadow-md border border-stone-100 dark:border-stone-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">
              {expression === 'happy' ? '¡Todo perfecto!' : 
               expression === 'angry' ? '¡Cuidado!' : 'Alimentación regular'}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Chat de la Mascota */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100 dark:border-stone-800 flex flex-col h-[600px] animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className={`p-6 flex items-center justify-between ${
              expression === 'happy' ? 'bg-emerald-500' : 
              expression === 'angry' ? 'bg-rose-500' : 'bg-amber-500'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  {expression === 'happy' ? <Smile className="text-white w-7 h-7" /> : 
                   expression === 'angry' ? <AlertTriangle className="text-white w-7 h-7" /> : 
                   <Info className="text-white w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-tighter">Lettie la Lechuga</h3>
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Tu Guía Nutricional</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/50 dark:bg-stone-900/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${
                    msg.sender === 'user' 
                      ? 'bg-wine-700 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-sm border border-stone-100 dark:border-stone-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-stone-800 p-4 rounded-3xl rounded-tl-none animate-pulse">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-stone-300 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-stone-300 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-stone-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-stone-100 dark:border-stone-800">
              <div className="flex gap-3">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Pregúntale algo a Lettie..."
                  className="flex-1 bg-stone-50 dark:bg-stone-800 border-none rounded-2xl px-5 py-4 text-sm font-bold text-stone-800 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-wine-700 transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || loading}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                    expression === 'happy' ? 'bg-emerald-500 shadow-emerald-500/20' : 
                    expression === 'angry' ? 'bg-rose-500 shadow-rose-500/20' : 
                    'bg-amber-500 shadow-amber-500/20'
                  }`}
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 12s linear infinite;
        }
      `}</style>
    </>
  );
};

export default LettuceMascot;