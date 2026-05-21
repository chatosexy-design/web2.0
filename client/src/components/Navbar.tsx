import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Apple, User, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { Role } from '../types';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Inicio", roles: [] },
    { to: "/dashboard", label: "Dashboard", roles: [Role.STUDENT] },
    { to: "/cafeteria", label: "Menú", roles: [] },
    { to: "/parent-portal", label: "Padres", roles: [] },
    { to: "/admin", label: "Panel Admin", roles: [Role.ADMIN] },
  ];

  const filteredLinks = navLinks.filter(link => 
    link.roles.length === 0 || (user && link.roles.includes(user.role))
  );

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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {filteredLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`text-sm font-medium transition-colors ${
                link.to === "/" ? "text-wine-700 font-bold" : "text-stone-600 dark:text-stone-400 hover:text-wine-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-stone-700 dark:text-stone-300 hover:text-wine-700 transition-colors">Entrar</Link>
              <Link to="/register" className="px-6 py-2.5 bg-wine-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-wine-700/20 hover:scale-105 transition-transform">Registro</Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-stone-200 dark:border-stone-800">
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

          {/* Mobile Menu Button */}
          <button 
            className="p-2 md:hidden text-stone-600 dark:text-stone-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 animate-in slide-in-from-top duration-300">
          <div className="px-6 py-8 space-y-6">
            {filteredLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-bold text-stone-900 dark:text-white hover:text-wine-700"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-6 border-t border-stone-100 dark:border-stone-800 space-y-4">
              {!user ? (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-4 text-stone-900 dark:text-white font-bold"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-4 bg-wine-700 text-white font-bold rounded-2xl"
                  >
                    Crear Cuenta
                  </Link>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl">
                    <div className="w-12 h-12 bg-wine-100 rounded-xl flex items-center justify-center text-wine-700 font-bold">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-stone-900 dark:text-white uppercase tracking-tighter">{user.name}</p>
                      <p className="text-xs text-stone-500">{user.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }}
                    className="w-full py-4 text-wine-600 font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
