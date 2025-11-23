import axios from 'axios';
import { WeatherData, LocationCoords } from '../types';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const weatherClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getWeather = async (coords: LocationCoords): Promise<WeatherData> => {
  try {
    const response = await weatherClient.post<WeatherData>('/weather', coords);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Failed to fetch weather data');
    }
    throw new Error('Weather service unavailable');
  }
};

export const getCurrentLocation = (): Promise<LocationCoords> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error('Location access denied'));
      },
      { timeout: 10000 }
    );
  });
};