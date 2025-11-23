// Message type for chat messages
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Theme type for dark/light mode
export type Theme = 'light' | 'dark';

// Weather data type
export interface WeatherData {
  temperature: number;
  feels_like: number;
  condition: string;
  description: string;
  humidity: number;
  location: string;
}

// Location coordinates
export interface LocationCoords {
  lat: number;
  lon: number;
}

// User roles
export type UserRole = 'citizen' | 'hospital';

// Citizen profile
export interface CitizenProfile {
  age: number;
  gender: string;
  food_preference: string;
  allergies: string;
  conditions: string;
}

// API response types
export interface ChatResponse {
  bot: string;
  status?: string;
}

export interface LoginResponse {
  role: UserRole;
  success: boolean;
}

export interface AIResponse {
  response: string;
}