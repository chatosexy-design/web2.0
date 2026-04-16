import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Apple, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { Role } from '../types';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-wine-700 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <Apple className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tighter text-stone-900 dark:text-white uppercase">
            CBT75<span className="text-wine-700">SANO</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-bold text-wine-700">Inicio</Link>
          {user?.role === Role.STUDENT && (
            <Link to="/dashboard" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-wine-700 transition-colors">Dashboard</Link>
          )}
          <Link to="/cafeteria" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-wine-700 transition-colors">Menú</Link>
          {user?.role === Role.ADMIN && (
            <Link to="/admin" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-wine-700 transition-colors font-bold">Panel Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-stone-700 dark:text-stone-300 hover:text-wine-700 transition-colors">Entrar</Link>
              <Link to="/register" className="px-6 py-2.5 bg-wine-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-wine-700/20 hover:scale-105 transition-transform">Registro</Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-stone-200 dark:border-stone-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-stone-900 dark:text-white uppercase tracking-tighter">{user.name || 'Usuario'}</p>
                <button onClick={() => { logout(); navigate('/'); }} className="text-[10px] font-bold text-wine-600 hover:underline uppercase flex items-center gap-1">
                  <LogOut className="w-3 h-3" /> Salir
                </button>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-wine-100 to-wine-200 rounded-xl flex items-center justify-center text-wine-700 font-bold border-2 border-white dark:border-stone-800">
                <User className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
