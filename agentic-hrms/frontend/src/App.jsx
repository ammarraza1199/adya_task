import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen w-screen bg-background flex flex-col items-center justify-center gap-10">
       <div className="w-16 h-16 border-4 border-accent-indigo/20 border-t-accent-indigo rounded-full animate-spin"></div>
       <p className="text-xs font-bold font-mono text-accent-indigo uppercase tracking-[0.5em] animate-pulse">Initializing System Nodes</p>
    </div>
  );
  
  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/chat" />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute allowedRoles={['admin']}><Employees /></ProtectedRoute>} />
          <Route path="/leaves" element={<ProtectedRoute><Leaves /></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/chat" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
