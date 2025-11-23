import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini with LangChain
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("ERROR: GOOGLE_API_KEY not found in environment variables")

model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    temperature=0.7
)

class ChatRequest(BaseModel):
    user_input: str
    weather: Optional[Dict[str, Any]] = None
    location: Optional[str] = None

class WeatherRequest(BaseModel):
    lat: float
    lon: float

class LoginRequest(BaseModel):
    username: str
    password: str

class CitizenProfile(BaseModel):
    age: int
    gender: str
    food_preference: str
    allergies: str
    conditions: str

class CitizenAIRequest(BaseModel):
    weather: Dict[str, Any]
    profile: CitizenProfile

class HospitalAIRequest(BaseModel):
    weather: Dict[str, Any]

# Dummy credentials
USERS = {
    "citizen": {"password": "1234", "role": "citizen"},
    "hospital": {"password": "9999", "role": "hospital"}
}

def create_citizen_prompt(weather: Dict, profile: CitizenProfile) -> str:
    return f"""You are ClimaCare AI. Generate weather-based health guidance for a citizen.
    
    Weather: {weather['temperature']}°C, {weather['condition']}, {weather['humidity']}% humidity in {weather['location']}
    Profile: Age {profile.age}, {profile.gender}, {profile.food_preference}, Allergies: {profile.allergies}, Conditions: {profile.conditions}
    
    Format response EXACTLY as:
    
    ### 🌦️ Weather Summary
    - Location: {weather['location']}
    - Temp: {weather['temperature']}°C (feels like {weather['feels_like']}°C)
    - Condition: {weather['condition']}
    - Humidity: {weather['humidity']}%
    
    ### 🩺 Health Tips
    - [Weather-based health tip 1]
    - [Weather-based health tip 2]
    - [Weather-based health tip 3]
    
    ### 🌿 Ayurvedic Tips
    - [Mild ayurvedic suggestion 1]
    - [Mild ayurvedic suggestion 2]
    
    ### 🍽️ Today's Diet Plan
    - [Diet recommendation based on weather and profile]
    - [Food to avoid based on weather]
    - [Hydration advice]
    
    ### ⚠️ Allergy & Weather Alerts
    - [Alert based on weather and user conditions]
    
    Keep all advice safe, no medicines or diagnoses."""

def create_hospital_prompt(weather: Dict) -> str:
    return f"""You are ClimaCare AI for hospitals. Generate operational guidance based on weather.
    
    Weather: {weather['temperature']}°C, {weather['condition']}, {weather['humidity']}% humidity in {weather['location']}
    
    Format response EXACTLY as:
    
    ### ⚕️ Weather Risk Overview
    Severity: [Low/Moderate/High/Critical]
    
    ### 🧪 Predicted Patient Surges
    - Respiratory cases: [prediction]
    - Viral fever: [prediction]
    - Heatstroke: [prediction]
    - Accidents: [prediction]
    
    ### 🧑‍⚕️ Staff Planning
    - Doctors needed: [number]
    - Specialist departments: [departments]
    - Nurses required: [number]
    - Emergency team: [readiness level]
    
    ### 💊 Medicine & Supply Recommendations
    - ORS: [quantity level]
    - Masks: [quantity level]
    - Nebulizers: [quantity level]
    - IV fluids: [quantity level]
    
    ### 🛏️ ICU & Bed Forecast
    - Predicted occupancy: [percentage]
    - Extra beds needed: [number]
    
    ### 🚑 Emergency Readiness
    - Ambulance standby: [level]
    - Respiratory equipment: [status]
    - Power backup: [status]
    
    Base all predictions strictly on weather conditions."""

def create_weather_prompt(user_input: str, weather: Optional[Dict], location: Optional[str]) -> str:
    base_prompt = """You are ClimaCare AI 🌡️, a weather-aware health assistant. Provide personalized health guidance.
    
Rules:
    - Maximum 4-5 sentences
    - Use relevant emojis (🌡️☀️🌧️❄️💧🌬️💪🥗🧘♀️)
    - Include mild Ayurvedic suggestions (warm water, ginger, turmeric, kadha)
    - NO medicines or diagnoses
    - Be friendly and professional
    - End with: "Stay healthy! 🌟"""
    
    if weather and location:
        temp = weather.get('temperature', 'N/A')
        feels_like = weather.get('feels_like', 'N/A')
        condition = weather.get('condition', 'N/A')
        humidity = weather.get('humidity', 'N/A')
        
        weather_context = f"""
        
Current weather in {location}:
        - Temperature: {temp}°C (feels like {feels_like}°C)
        - Condition: {condition}
        - Humidity: {humidity}%
        
        Consider this weather data in your health advice."""
        
        return f"{base_prompt}{weather_context}\n\nQuestion: {user_input}\n\nPersonalized advice:"
    
    return f"{base_prompt}\n\nQuestion: {user_input}\n\nHealth advice:"

@app.post("/login")
async def login(request: LoginRequest):
    user = USERS.get(request.username)
    if user and user["password"] == request.password:
        return {"role": user["role"], "success": True}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/citizen/ai")
async def citizen_ai(request: CitizenAIRequest):
    try:
        prompt = create_citizen_prompt(request.weather, request.profile)
        message = HumanMessage(content=prompt)
        response = model.invoke([message])
        return {"response": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/hospital/ai")
async def hospital_ai(request: HospitalAIRequest):
    try:
        prompt = create_hospital_prompt(request.weather)
        message = HumanMessage(content=prompt)
        response = model.invoke([message])
        return {"response": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/weather")
async def get_weather(request: WeatherRequest):
    try:
        api_key = os.getenv("OPENWEATHER_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Weather API key not configured")
        
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={request.lat}&lon={request.lon}&appid={api_key}&units=metric"
        response = requests.get(url)
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch weather data")
        
        data = response.json()
        
        return {
            "temperature": round(data["main"]["temp"]),
            "feels_like": round(data["main"]["feels_like"]),
            "condition": data["weather"][0]["main"],
            "description": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "location": data["name"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        prompt = create_weather_prompt(request.user_input, request.weather, request.location)
        
        message = HumanMessage(content=prompt)
        response = model.invoke([message])
        
        if not response.content:
            return {"bot": "I'm having trouble generating a response. Please try again."}
            
        return {"bot": response.content}
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"bot": f"Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)