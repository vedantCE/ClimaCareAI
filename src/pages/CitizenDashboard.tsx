import React, { useState, useEffect } from 'react';
import { RefreshCw, MapPin, Thermometer, Droplets, Wind, Utensils, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { WeatherData, CitizenProfile } from '../types';
import { getWeather, getCurrentLocation } from '../services/weather';
import { getCitizenAI } from '../services/api';

const CitizenDashboard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const parseAIResponse = (response: string) => {
    const sections = {
      weather: '',
      health: '',
      ayurvedic: '',
      diet: '',
      alerts: ''
    };

    const lines = response.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      if (line.includes('Weather Summary')) currentSection = 'weather';
      else if (line.includes('Health Tips')) currentSection = 'health';
      else if (line.includes('Ayurvedic Tips')) currentSection = 'ayurvedic';
      else if (line.includes('Diet Plan')) currentSection = 'diet';
      else if (line.includes('Allergy & Weather Alerts')) currentSection = 'alerts';
      else if (line.trim() && currentSection) {
        sections[currentSection as keyof typeof sections] += line + '\n';
      }
    });

    return sections;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sections = parseAIResponse(aiResponse);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Personal Health Dashboard</h1>
            <p className="text-muted-foreground">Weather-aware health guidance tailored for you</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-primary" />
                <span>Current Weather</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weather && (
                <>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{weather.location}</span>
                  </div>
                  
                  <div className="text-3xl font-bold text-foreground">
                    {weather.temperature}°C
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Feels like {weather.feels_like}°C
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span>{weather.humidity}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <span className="capitalize">{weather.description}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Health Advisory */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Today's Health Advisory</CardTitle>
              <CardDescription>AI-generated recommendations based on current weather</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sections.health && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      🩺 Health Tips
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                      {sections.health}
                    </div>
                  </div>
                )}
                
                {sections.ayurvedic && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      🌿 Ayurvedic Suggestions
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                      {sections.ayurvedic}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Diet Plan */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Utensils className="w-5 h-5 text-secondary" />
                <span>Today's Diet Plan</span>
              </CardTitle>
              <CardDescription>Personalized nutrition based on weather and your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground whitespace-pre-line">
                {sections.diet || 'Loading diet recommendations...'}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span>Health Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sections.alerts ? (
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {sections.alerts}
                  </div>
                ) : (
                  <Badge variant="success" className="w-full justify-center">
                    No alerts today
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Age</span>
                  <p className="text-foreground">{profile.age}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Gender</span>
                  <p className="text-foreground">{profile.gender}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Diet</span>
                  <p className="text-foreground">{profile.food_preference}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Allergies</span>
                  <p className="text-foreground">{profile.allergies}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Conditions</span>
                  <p className="text-foreground">{profile.conditions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;