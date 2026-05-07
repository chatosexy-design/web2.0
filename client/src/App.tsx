import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AIChatButton from './components/AIChatButton';
import LettuceMascot from './components/LettuceMascot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cafeteria from './pages/Cafeteria';
import Admin from './pages/Admin';
import ParentPortal from './pages/ParentPortal';
import { useAuthStore } from './store/auth';
import { Role } from './types';
import { supabase } from './lib/supabase';
import api from './api';

const PrivateRoute = ({ children, roles }: { children: React.ReactNode, roles?: Role[] }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AuthHandler: React.FC = () => {
  const { setAuth, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          // Intentar obtener el perfil del estudiante desde nuestro backend
          const res = await api.get('/students/profile', {
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          
          if (res.data.success && res.data.data) {
            const student = res.data.data;
            const userData = {
              id: session.user.id,
              email: session.user.email || '',
              role: student.role || Role.STUDENT,
              name: student.first_name + ' ' + student.last_name,
              studentId: student.id
            };
            
            setAuth(userData, session.access_token);
            
            // Si estamos en login y ya hay perfil, ir al dashboard
            if (window.location.pathname === '/login') {
              navigate('/dashboard');
            }
          }
        } catch (err: any) {
          // Si falla (404), significa que el usuario de Google no tiene perfil de estudiante aún
          if (err.response?.status === 404) {
            console.log('Perfil no encontrado, redirigiendo a registro...');
            const userData = {
              id: session.user.id,
              email: session.user.email || '',
              role: Role.STUDENT,
              name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
            };
            setAuth(userData, session.access_token);
            navigate('/register');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        logout();
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [setAuth, logout, navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthHandler />
      <div className="min-h-screen relative">
        <Navbar />
        <main className="pt-24 pb-12 px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/parent-portal" element={<ParentPortal />} />
            
            {/* Private Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute roles={[Role.STUDENT]}>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/cafeteria" element={
              <PrivateRoute>
                <Cafeteria />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute roles={[Role.ADMIN]}>
                <Admin />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <AIChatButton />
        <LettuceMascot />
      </div>
    </Router>
  );
};

export default App;
