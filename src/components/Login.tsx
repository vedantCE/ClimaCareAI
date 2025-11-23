import React, { useState } from 'react';
import { User, Building2 } from 'lucide-react';
import { UserRole } from '../types';
import { login } from '../services/api';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await login(username, password);
      onLogin(response.role);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            ClimaCare AI 🌡️
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Weather-aware healthcare system
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('citizen', '1234')}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            <User className="w-5 h-5" />
            <span>Citizen Login</span>
          </button>

          <button
            onClick={() => handleLogin('hospital', '9999')}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            <Building2 className="w-5 h-5" />
            <span>Hospital Login</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Demo Credentials:</p>
          <p>Citizen: citizen / 1234</p>
          <p>Hospital: hospital / 9999</p>
        </div>
      </div>
    </div>
  );
};

export default Login;