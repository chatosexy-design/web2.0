import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, GraduationCap, BookOpen, Clock, ArrowRight } from 'lucide-react';
import api from '../api';
import { useAuthStore } from '../store/auth';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    semester: '',
    email: '',
    specialty: '',
    shift: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        setAuth(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up py-10">
      <div className="card-premium p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-wine-50 rounded-3xl flex items-center justify-center text-wine-700 mx-auto mb-8 dark:bg-wine-900/30">
          <UserPlus className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter mb-4">Registro Estudiantil</h2>
        <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] mb-10">Completa tus datos generales</p>
        
        {error && <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Nombre(s)</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                <input 
                  type="text" 
                  name="firstName"
                  required 
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan" 
                  className="input-premium pl-16"
                />
              </div>
            </div>
            <div className="text-left">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Apellido(s)</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                <input 
                  type="text" 
                  name="lastName"
                  required 
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Pérez" 
                  className="input-premium pl-16"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Semestre</label>
              <div className="relative">
                <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                <select 
                  name="semester"
                  required 
                  value={formData.semester}
                  onChange={handleChange}
                  className="input-premium pl-16 appearance-none"
                >
                  <option value="">Seleccionar...</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(s => (
                    <option key={s} value={s}>{s}º Semestre</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-left">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Especialidad</label>
              <div className="relative">
                <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                <input 
                  type="text" 
                  name="specialty"
                  required 
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Sistemas Computacionales" 
                  className="input-premium pl-16"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Turno</label>
              <div className="relative">
                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                <select 
                  name="shift"
                  required 
                  value={formData.shift}
                  onChange={handleChange}
                  className="input-premium pl-16 appearance-none"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Matutino">Matutino</option>
                  <option value="Vespertino">Vespertino</option>
                  <option value="Mixto">Mixto</option>
                </select>
              </div>
            </div>
            <div className="text-left">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                <input 
                  type="email" 
                  name="email"
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com" 
                  className="input-premium pl-16"
                />
              </div>
            </div>
          </div>

          <div className="text-left">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
              <input 
                type="password" 
                name="password"
                required 
                value={formData.password}
                onChange={handleChange}
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
            {loading ? 'Creando cuenta...' : <>Registrar Estudiante <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
        
        <p className="mt-8 text-sm font-medium text-stone-400">
          ¿Ya tienes cuenta? <Link to="/login" className="text-wine-700 font-black hover:underline">Entra aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
