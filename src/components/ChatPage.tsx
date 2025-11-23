import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Message, WeatherData, Theme } from '../types';
import { sendMessage } from '../services/api';
import { getWeather, getCurrentLocation } from '../services/weather';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

interface ChatPageProps {
  onBack: () => void;
  theme: Theme;
}

const ChatPage: React.FC<ChatPageProps> = ({ onBack, theme }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const coords = await getCurrentLocation();
        const weatherData = await getWeather(coords);
        setWeather(weatherData);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const botReply = await sendMessage(text, weather || undefined, weather?.location);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botReply,
        sender: 'bot',
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 800);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              ClimaCare AI Chat
            </h1>
            {weather && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {weather.location} • {weather.temperature}°C • {weather.condition}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <ChatWindow messages={messages} isTyping={isTyping} onSendMessage={handleSendMessage} />

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping} />
    </div>
  );
};

export default ChatPage;