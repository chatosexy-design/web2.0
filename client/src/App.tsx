import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const PrivateRoute = ({ children, roles }: { children: React.ReactNode, roles?: Role[] }) => {
  const { user } = useAuthStore();
  
  // LOGIN TEMPORALMENTE DESACTIVADO
  return children;

  /* Logic to be re-enabled later:
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
  */
};

const App: React.FC = () => {
  return (
    <Router>
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
