import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import api from '../api';
import { useAuthStore } from '../store/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setAuth(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-slide-up">
      <div className="card-premium p-12 text-center">
        <div className="w-20 h-20 bg-wine-50 rounded-3xl flex items-center justify-center text-wine-700 mx-auto mb-8 dark:bg-wine-900/30">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter mb-4">Bienvenido</h2>
        <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] mb-10">Inicia sesión para continuar</p>
        
        {error && <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com" 
                className="input-premium pl-16"
              />
            </div>
          </div>
          <div className="text-left">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="input-premium pl-16"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-5 flex items-center justify-center gap-3"
          >
            {loading ? 'Cargando...' : <>Entrar al Sistema <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
        
        <p className="mt-8 text-sm font-medium text-stone-400">
          ¿No tienes cuenta? <Link to="/register" className="text-wine-700 font-black hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
