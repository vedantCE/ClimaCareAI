import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Theme, UserRole } from './types';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import HospitalDashboard from './pages/HospitalDashboard';

function App() {
  const [user, setUser] = useState<{ role: UserRole } | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    setUser({ role });
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const handleSignIn = () => {
    // This will be handled by navigation to login page
  };

  return (
    <Router>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? 'hsl(var(--card))' : 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
        
        <Navigation 
          user={user} 
          onSignIn={handleSignIn} 
          onSignOut={handleSignOut} 
        />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to={`/dashboard/${user.role}`} replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/dashboard/citizen" 
            element={
              user?.role === 'citizen' ? (
                <CitizenDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/dashboard/hospital" 
            element={
              user?.role === 'hospital' ? (
                <HospitalDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;