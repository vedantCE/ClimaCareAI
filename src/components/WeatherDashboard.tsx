import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, Thermometer, MapPin } from 'lucide-react';
import { WeatherData } from '../types';
import { getWeather, getCurrentLocation } from '../services/weather';
import { sendMessage } from '../services/api';

interface WeatherDashboardProps {
  onChatClick: () => void;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ onChatClick }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [dailyTip, setDailyTip] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'snow': return <Snowflake className="w-8 h-8 text-blue-300" />;
      case 'clouds': return <Cloud className="w-8 h-8 text-gray-500" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const fetchWeatherAndTip = async () => {
    try {
      setLoading(true);
      const coords = await getCurrentLocation();
      const weatherData = await getWeather(coords);
      setWeather(weatherData);

      // Generate daily tip
      const tip = await sendMessage(
        "Give me a daily health tip based on current weather",
        weatherData,
        weatherData.location
      );
      setDailyTip(tip);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherAndTip();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchWeatherAndTip}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            ClimaCare AI 🌡️
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your weather-aware health companion
          </p>
        </div>

        {/* Weather & Tip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weather Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Current Weather
              </h2>
              {weather && getWeatherIcon(weather.condition)}
            </div>
            
            {weather && (
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{weather.location}</span>
                </div>
                
                <div className="flex items-center text-2xl font-bold text-gray-800 dark:text-white">
                  <Thermometer className="w-6 h-6 mr-2 text-red-500" />
                  <span>{weather.temperature}°C</span>
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (feels like {weather.feels_like}°C)
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Humidity: {weather.humidity}%</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Wind className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="capitalize">{weather.description}</span>
                </div>
              </div>
            )}
          </div>

          {/* Daily Tip Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Today's Health Tip 💡
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {dailyTip || 'Loading personalized tip...'}
            </div>
          </div>
        </div>

        {/* Chat Button */}
        <div className="text-center">
          <button
            onClick={onChatClick}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200"
          >
            Ask ClimaCare AI Anything 💬
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;