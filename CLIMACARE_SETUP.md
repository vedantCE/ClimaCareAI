# ClimaCare AI Setup Guide

## Overview
ClimaCare AI is a weather-aware healthcare chatbot that provides personalized health guidance based on current weather conditions and includes Ayurvedic lifestyle suggestions.

## Features
✅ Live weather data integration
✅ Automatic location detection
✅ Weather-aware health recommendations
✅ Ayurvedic lifestyle suggestions
✅ Clean medical-themed UI
✅ Mobile responsive design
✅ Daily health tips based on weather

## Setup Instructions

### 1. Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Get OpenWeather API Key:**
   - Visit https://openweathermap.org/api
   - Sign up for a free account
   - Get your API key

3. **Configure Environment Variables:**
   - Update `backend/.env` file:
   ```
   GOOGLE_API_KEY="your_gemini_api_key"
   OPENWEATHER_API_KEY="your_openweather_api_key"
   ```

4. **Start Backend Server:**
   ```bash
   python main.py
   ```
   Server runs on http://localhost:8000

### 2. Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm start
   ```
   App runs on http://localhost:3000

### 3. Browser Permissions

- **Location Access:** Allow location access when prompted for weather data
- **HTTPS:** For production, ensure HTTPS for geolocation API

## API Endpoints

### Backend Endpoints:
- `POST /weather` - Get weather data by coordinates
- `POST /chat` - Send message with optional weather context

### Request Examples:

**Weather Request:**
```json
{
  "lat": 40.7128,
  "lon": -74.0060
}
```

**Chat Request:**
```json
{
  "user_input": "I have a headache",
  "weather": {
    "temperature": 25,
    "humidity": 60,
    "condition": "Clear"
  },
  "location": "New York"
}
```

## Architecture

### Backend (FastAPI + LangChain + Gemini):
- Weather API integration
- AI-powered health recommendations
- Weather-aware prompt engineering

### Frontend (React + TypeScript + Tailwind):
- Weather dashboard
- Interactive chat interface
- Responsive design

## Key Components

1. **WeatherDashboard.tsx** - Main dashboard with weather and daily tips
2. **ChatPage.tsx** - Chat interface with weather context
3. **weather.ts** - Weather service and geolocation
4. **api.ts** - Backend communication

## Troubleshooting

**Common Issues:**

1. **Location not detected:**
   - Check browser permissions
   - Ensure HTTPS in production

2. **Weather API errors:**
   - Verify OpenWeather API key
   - Check API quota limits

3. **Backend connection failed:**
   - Ensure backend server is running
   - Check CORS configuration

## Production Deployment

1. **Environment Variables:**
   - Set production API keys
   - Configure CORS for production domain

2. **Build Frontend:**
   ```bash
   npm run build
   ```

3. **Deploy Backend:**
   - Use services like Railway, Heroku, or AWS
   - Ensure environment variables are set

## Security Notes

- Never commit API keys to version control
- Use environment variables for all secrets
- Implement rate limiting for production
- Validate all user inputs

## Support

For issues or questions, check:
- Backend logs for API errors
- Browser console for frontend issues
- Network tab for API call debugging