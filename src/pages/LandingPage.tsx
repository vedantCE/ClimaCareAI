import React from 'react';
import { Activity, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: 'Surge Forecasting',
      description: 'AI-powered predictions of patient surges based on weather patterns and historical data.',
    },
    {
      icon: Activity,
      title: 'Smart Resource Planning',
      description: 'Optimize hospital resources and staff allocation with intelligent recommendations.',
    },
    {
      icon: Shield,
      title: 'Preventive Health',
      description: 'Personalized health guidance for citizens based on real-time weather conditions.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Activity className="w-4 h-4 mr-2" />
              AI-Powered Healthcare Prediction
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Predict Patient Surges
              </span>
              <br />
              Before They Happen
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              SurgeSense combines weather data with AI to help hospitals prepare for patient surges 
              while providing citizens with personalized health guidance based on environmental conditions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="gradient-primary text-white border-0 hover:opacity-90"
              >
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Intelligent Healthcare Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform leverages advanced AI and real-time weather data to transform 
              healthcare planning and personal wellness.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto text-center gradient-primary text-white border-0">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl md:text-4xl text-white">
                Ready to Transform Healthcare?
              </CardTitle>
              <CardDescription className="text-xl text-white/90">
                Join hospitals and citizens already using SurgeSense for smarter health decisions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/login')}
                className="bg-white text-primary hover:bg-white/90 border-white"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;