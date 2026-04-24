import React, { useState, useEffect } from 'react';
import { X, Check, Crown, Sparkles, Heart } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [canClose, setCanClose] = useState(true);

  if (!isOpen) return null;

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAnimation(true);
    setCanClose(false);

    // Iniciar secuencia de animación
    setTimeout(() => {
      setShowFinalMessage(true);
      setShowAnimation(false);
      
      // Bloquear cierre por 3-5 segundos como se solicitó
      setTimeout(() => {
        setCanClose(true);
      }, 4000);
    }, 1000);
  };

  const benefits = [
    'Análisis de IA ilimitado para tus comidas',
    'Estadísticas avanzadas y comparativas por semestre',
    'Recordatorios personalizados de hidratación',
    'Acceso prioritario al menú de la cafetería',
    'Insignia premium en tu perfil'
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-[3rem] shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 animate-in zoom-in-95 duration-300">
        
        {/* Botón Cerrar */}
        {canClose && (
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-wine-700 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {!showFinalMessage ? (
          <div className="p-10 md:p-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-wine-50 dark:bg-wine-900/30 rounded-2xl flex items-center justify-center text-wine-700">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tighter">Plan Premium ChatoSano</h2>
                <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Arquitectura Profesional CBT 75</p>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <p className="text-stone-600 dark:text-stone-400 font-medium">
                Lleva tu salud al siguiente nivel con nuestras herramientas avanzadas diseñadas específicamente para la comunidad del CBT 75.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-stone-700 dark:text-stone-300 font-bold text-sm">
                    <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <p className="text-stone-400 text-xs font-black uppercase tracking-widest mb-1">Inversión Mensual</p>
                <p className="text-4xl font-black text-stone-900 dark:text-white">$49.00 <span className="text-lg text-stone-400">MXN</span></p>
              </div>
              <button 
                onClick={handleSubscribe}
                className="btn-primary w-full md:w-auto px-10 py-5 flex items-center justify-center gap-3 group overflow-hidden relative"
              >
                <span className="relative z-10">Suscribirse Ahora</span>
                <Sparkles className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-wine-600 to-wine-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-14 text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-32 h-32 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600">
                <Heart className="w-16 h-16 fill-current" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-stone-900 dark:text-white tracking-tighter">¡Gracias por tu apoyo!</h3>
              <p className="text-stone-500 dark:text-stone-400 font-bold text-lg leading-relaxed max-w-md mx-auto">
                "Gracias por querer aportar a este hermoso proyecto, desafortunadamente no podemos aceptarlo al ser proyecto escolar (por ahora)."
              </p>
            </div>

            <div className="pt-6">
              {!canClose ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-1 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-wine-700 animate-progress"></div>
                  </div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Procesando gratitud...</p>
                </div>
              ) : (
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-stone-900 text-white dark:bg-white dark:text-stone-900 rounded-xl font-black text-sm hover:scale-105 transition-transform"
                >
                  Entendido
                </button>
              )}
            </div>
          </div>
        )}

        {/* Animación de Lechuga (Overlays) */}
        {showAnimation && (
          <div className="absolute inset-0 flex items-center justify-center z-[110] pointer-events-none">
            <div className="relative w-20 h-20">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="lettuce-leaf animate-lettuce" 
                  style={{ 
                    transformOrigin: 'bottom center',
                    rotate: `${i * 45}deg`,
                    animationDelay: `${i * 0.05}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 4s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default PremiumModal;