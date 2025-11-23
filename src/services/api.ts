import axios from 'axios';
import { WeatherData, LoginResponse, AIResponse, CitizenProfile } from '../types';

// Get backend URL from environment variable or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// API response interface
export interface ChatApiResponse {
  bot: string;
}

// Authentication
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};

// Citizen AI
export const getCitizenAI = async (weather: WeatherData, profile: CitizenProfile): Promise<string> => {
  try {
    const response = await apiClient.post<AIResponse>('/citizen/ai', {
      weather,
      profile,
    });
    return response.data.response;
  } catch (error) {
    throw new Error('Failed to get AI response');
  }
};

// Hospital AI
export const getHospitalAI = async (weather: WeatherData): Promise<string> => {
  try {
    const response = await apiClient.post<AIResponse>('/hospital/ai', {
      weather,
    });
    return response.data.response;
  } catch (error) {
    throw new Error('Failed to get AI response');
  }
};

// Send message to backend with optional weather data
export const sendMessage = async (
  message: string, 
  weather?: WeatherData, 
  location?: string
): Promise<string> => {
  try {
    const response = await apiClient.post<ChatApiResponse>('/chat', {
      user_input: message,
      weather,
      location,
    });
    
    return response.data.bot;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Backend server is not running. Please start the server at http://localhost:8000');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error occurred. Please try again.');
      }
      if (error.response?.status === 422) {
        throw new Error('Invalid request format.');
      }
    }
    throw new Error('Failed to send message. Please check your connection and try again.');
  }
};