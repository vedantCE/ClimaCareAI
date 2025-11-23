import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Users, Droplets, Calendar, ArrowUp, Wind } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { WeatherData } from '../types';
import { getWeather, getCurrentLocation } from '../services/weather';
import { getHospitalAI } from '../services/api';

const HospitalDashboard: React.FC = () => {
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

  // Mock data for charts
  const surgeData = [
    { day: 'Mon', actual: 320, predicted: 340 },
    { day: 'Tue', actual: 350, predicted: 380 },
    { day: 'Wed', actual: 387, predicted: 420 },
    { day: 'Thu', actual: 0, predicted: 480 },
    { day: 'Fri', actual: 0, predicted: 450 },
    { day: 'Sat', actual: 0, predicted: 390 },
    { day: 'Sun', actual: 0, predicted: 360 },
  ];

  const categoryData = [
    { category: 'Respiratory', count: 120 },
    { category: 'Cardiac', count: 85 },
    { category: 'Trauma', count: 60 },
    { category: 'Pediatric', count: 95 },
    { category: 'General', count: 140 },
  ];

  const getRiskLevel = () => {
    if (!weather) return 'Low';
    if (weather.temperature > 35 || weather.humidity > 80) return 'High';
    if (weather.temperature < 5 || weather.humidity < 30) return 'Moderate';
    return 'Low';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'destructive';
      case 'High': return 'warning';
      case 'Moderate': return 'warning';
      default: return 'success';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const riskLevel = getRiskLevel();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Hospital Operations Dashboard</h1>
              <p className="text-muted-foreground">AI-powered surge prediction and resource planning</p>
            </div>
            <Badge variant={getRiskColor(riskLevel) as any} className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4" />
              <span>{riskLevel} Risk</span>
            </Badge>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Load</p>
                  <p className="text-2xl font-bold text-foreground">387</p>
                  <p className="text-xs text-success flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +12% from yesterday
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Predicted Surge</p>
                  <p className="text-2xl font-bold text-foreground">480</p>
                  <p className="text-xs text-muted-foreground">in next 48 hours</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bed Availability</p>
                  <p className="text-2xl font-bold text-foreground">68%</p>
                  <p className="text-xs text-muted-foreground">143 beds available</p>
                </div>
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Air Quality</p>
                  <p className="text-2xl font-bold text-foreground">187</p>
                  <p className="text-xs text-warning">Moderate pollution</p>
                </div>
                <Wind className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Alert */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span>AI Surge Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Staffing</p>
                    <p className="text-sm text-muted-foreground">Increase respiratory & emergency staff by 25%</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Droplets className="w-5 h-5 text-secondary mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Supplies</p>
                    <p className="text-sm text-muted-foreground">Replenish respiratory and critical care supplies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-warning mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Operations</p>
                    <p className="text-sm text-muted-foreground">Postpone elective procedures in next 24-48 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Surge Forecast */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Patient Surge Forecast</CardTitle>
              <CardDescription>7-day prediction vs actual patient volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={surgeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stackId="1" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    stackId="2" 
                    stroke="hsl(var(--secondary))" 
                    fill="hsl(var(--secondary))" 
                    fillOpacity={0.4}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Patient Categories */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Patient Categories</CardTitle>
              <CardDescription>Current distribution by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Operational Guidance */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>AI Operational Guidance</CardTitle>
              <CardDescription>Weather-based recommendations for hospital operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-muted-foreground text-sm">
                  {aiResponse || 'Loading operational recommendations...'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;