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
    password: '',
    age: 17,
    weight: 65,
    height: 183,
    sex: 'M',
    activityLevel: 'moderado',
    goal: 'mantener'
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

          <div className="p-8 bg-stone-50 dark:bg-stone-800/50 rounded-3xl space-y-8 border border-stone-100 dark:border-stone-800">
            <h3 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-wine-600 rounded-full"></div>
              Perfil Saludable
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-left">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Edad</label>
                <input 
                  type="number" 
                  name="age"
                  required 
                  value={formData.age}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div className="text-left">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Peso (kg)</label>
                <input 
                  type="number" 
                  name="weight"
                  required 
                  value={formData.weight}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div className="text-left">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Altura (cm)</label>
                <input 
                  type="number" 
                  name="height"
                  required 
                  value={formData.height}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Sexo</label>
                <select 
                  name="sex"
                  required 
                  value={formData.sex}
                  onChange={handleChange}
                  className="input-premium"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="text-left">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Actividad Física</label>
                <select 
                  name="activityLevel"
                  required 
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="input-premium"
                >
                  <option value="sedentario">Sedentario (Poca actividad)</option>
                  <option value="ligero">Ligero (1-3 días/semana)</option>
                  <option value="moderado">Moderado (3-5 días/semana)</option>
                  <option value="activo">Activo (6-7 días/semana)</option>
                  <option value="muy_activo">Muy Activo (Atleta)</option>
                </select>
              </div>
            </div>

            <div className="text-left">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block ml-2">Meta Nutricional</label>
              <select 
                name="goal"
                required 
                value={formData.goal}
                onChange={handleChange}
                className="input-premium"
              >
                <option value="perder_peso">Perder Peso</option>
                <option value="mantener">Mantener Peso</option>
                <option value="ganar_musculo">Ganar Músculo</option>
              </select>
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
