import React, { useState, useEffect } from 'react';
import { RefreshCw, LogOut, AlertTriangle } from 'lucide-react';
import { WeatherData } from '../types';
import { getWeather, getCurrentLocation } from '../services/weather';
import { getHospitalAI } from '../services/api';

interface HospitalDashboardProps {
  onLogout: () => void;
}

const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ onLogout }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const coords = await getCurrentLocation();
      const weatherData = await getWeather(coords);
      setWeather(weatherData);

      const aiData = await getHospitalAI(weatherData);
      setAiResponse(aiData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRiskColor = (response: string) => {
    if (response.includes('Critical')) return 'bg-red-100 border-red-500 text-red-800';
    if (response.includes('High')) return 'bg-orange-100 border-orange-500 text-orange-800';
    if (response.includes('Moderate')) return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    return 'bg-green-100 border-green-500 text-green-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-800">Hospital Dashboard 🏥</h1>
            <div className={`px-3 py-1 rounded-full border-2 text-sm font-medium ${getRiskColor(aiResponse)}`}>
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Risk Level
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Weather Info */}
        {weather && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Weather Conditions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{weather.temperature}°C</p>
                <p className="text-gray-600">Temperature</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{weather.humidity}%</p>
                <p className="text-gray-600">Humidity</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800">{weather.condition}</p>
                <p className="text-gray-600">Condition</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800">{weather.location}</p>
                <p className="text-gray-600">Location</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Operational Guidance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Operational Guidance</h3>
          <div className="prose max-w-none">
            <div className="whitespace-pre-line text-gray-700">
              {aiResponse || 'Loading operational recommendations...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;