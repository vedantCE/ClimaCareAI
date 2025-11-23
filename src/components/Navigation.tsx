import React from 'react';
import { Activity, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './ui/Button';
import { UserRole } from '../types';

interface NavigationProps {
  user?: { role: UserRole } | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onSignIn, onSignOut }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleDashboardClick = () => {
    if (user) {
      navigate(`/dashboard/${user.role}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">SurgeSense</h1>
            <p className="text-xs text-muted-foreground">ClimaCare AI</p>
          </div>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => navigate('/')}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </button>
          <button
            onClick={handleDashboardClick}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname.includes('/dashboard') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground capitalize">
                {user.role} Dashboard
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onSignIn}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;