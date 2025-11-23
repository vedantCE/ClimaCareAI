import React, { useState, useEffect } from 'react';
import { RefreshCw, MessageCircle, LogOut } from 'lucide-react';
import { WeatherData, CitizenProfile } from '../types';
import { getWeather, getCurrentLocation } from '../services/weather';
import { getCitizenAI } from '../services/api';

interface CitizenDashboardProps {
  onLogout: () => void;
  onChatClick: () => void;
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ onLogout, onChatClick }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Demo profile
  const profile: CitizenProfile = {
    age: 30,
    gender: 'Male',
    food_preference: 'Vegetarian',
    allergies: 'Dust, Pollen',
    conditions: 'Mild Asthma'
  };

  const fetchData = async () => {
    try {
      const coords = await getCurrentLocation();
      const weatherData = await getWeather(coords);
      setWeather(weatherData);

      const aiData = await getCitizenAI(weatherData, profile);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Citizen Dashboard 👤</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onChatClick}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask ClimaCare AI</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* AI Response */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-line text-gray-700">
              {aiResponse || 'Loading personalized recommendations...'}
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Age:</span>
              <p className="text-gray-800">{profile.age}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Gender:</span>
              <p className="text-gray-800">{profile.gender}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Diet:</span>
              <p className="text-gray-800">{profile.food_preference}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Allergies:</span>
              <p className="text-gray-800">{profile.allergies}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Conditions:</span>
              <p className="text-gray-800">{profile.conditions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;