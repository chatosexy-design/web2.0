import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Zap, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="animate-slide-up text-center lg:text-left">
          <span className="inline-block px-4 py-1.5 bg-wine-50 text-wine-700 rounded-full text-xs font-black tracking-widest uppercase mb-6 dark:bg-wine-900/30">Salud Inteligente</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-stone-900 dark:text-white tracking-tighter leading-[0.95] mb-8">
            Come mejor, <br className="hidden sm:block" /> vive <span className="text-wine-700">increíble.</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-500 dark:text-stone-400 font-medium mb-10 lg:mb-12 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Arquitectura moderna para el CBTIS 75. Análisis nutricional con IA, seguimiento de hábitos y asesoramiento inteligente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/register" className="btn-primary px-8 lg:px-10 py-4 lg:py-5 flex items-center justify-center gap-3 text-lg shadow-xl shadow-wine-700/20">
              Empezar Ahora <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/cafeteria" className="px-8 lg:px-10 py-4 lg:py-5 bg-white border-2 border-stone-100 text-stone-900 rounded-2xl font-black text-lg hover:bg-stone-50 transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-white flex items-center justify-center gap-3 shadow-sm">
              Ver Menú <Utensils className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-12 lg:mt-16 flex flex-col sm:flex-row items-center gap-4 lg:gap-8 justify-center lg:justify-start">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 lg:w-12 h-10 lg:h-12 rounded-full border-4 border-white bg-stone-200 dark:border-stone-900 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-xs lg:text-sm font-bold text-stone-400">+2k estudiantes confían en nosotros</p>
          </div>
        </div>
        
        <div className="relative animate-float mt-10 lg:mt-0 px-4 sm:px-0">
          <div className="absolute -top-10 lg:-top-20 -right-10 lg:-right-20 w-64 lg:w-96 h-64 lg:h-96 bg-wine-100 rounded-full blur-[80px] lg:blur-[120px] dark:bg-wine-900/20"></div>
          <div className="relative card-premium p-3 lg:p-4 lg:rotate-3 hover:rotate-0 transition-transform duration-700">
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000" 
              className="rounded-[2rem] lg:rounded-[2.5rem] w-full shadow-2xl" 
              alt="healthy food"
            />
            <div className="absolute -bottom-6 lg:-bottom-10 -left-6 lg:-left-10 card-premium p-4 lg:p-6 shadow-2xl scale-90 lg:scale-100">
              <div className="flex items-center gap-4">
                <div className="w-10 lg:w-12 h-10 lg:h-12 bg-emerald-500 rounded-xl lg:rounded-2xl flex items-center justify-center text-white">
                  <Zap className="w-5 lg:w-6 h-5 lg:h-6" />
                </div>
                <div>
                  <p className="text-[9px] lg:text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">Meta Diaria</p>
                  <p className="text-base lg:text-lg font-black text-stone-900 dark:text-white mt-1">¡85% Completado!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="mt-20 lg:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        <div className="card-premium p-10">
          <div className="w-14 h-14 bg-wine-50 text-wine-700 rounded-2xl flex items-center justify-center mb-8 dark:bg-wine-900/30">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black mb-4">Análisis IA</h3>
          <p className="text-stone-500 dark:text-stone-400 font-medium leading-relaxed">Estimación automática de macros y calorías con solo escribir el nombre del alimento.</p>
        </div>
        <div className="card-premium p-10">
          <div className="w-14 h-14 bg-sano-50 text-sano-700 rounded-2xl flex items-center justify-center mb-8 dark:bg-sano-900/30">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black mb-4">Cafetería Digital</h3>
          <p className="text-stone-500 dark:text-stone-400 font-medium leading-relaxed">Menú interactivo con información nutricional completa calculada por nuestra IA.</p>
        </div>
        <div className="card-premium p-10">
          <div className="w-14 h-14 bg-stone-100 text-stone-700 rounded-2xl flex items-center justify-center mb-8 dark:bg-stone-800">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black mb-4">Panel Admin</h3>
          <p className="text-stone-500 dark:text-stone-400 font-medium leading-relaxed">Toma de decisiones basada en datos reales sobre la alimentación del plantel.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
