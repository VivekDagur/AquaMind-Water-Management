import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Droplets, 
  BarChart3, 
  Bell, 
  Zap, 
  CheckCircle, 
  ChevronRight,
  ArrowLeft 
} from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useToast } from '@/hooks/use-toast';

const Demo: React.FC = () => {
  const [showQuestions, setShowQuestions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLaunchAquaMind = () => {
    setShowQuestions(true);
  };

  const handleStartDemo = () => {
    // Set demo user and navigate to dashboard
    const demoUser = {
      id: 'demo-user',
      email: 'demo@aquamind.com',
      name: 'Demo User',
      role: 'user',
      setupCompleted: true,
      tankSetup: {
        hasPhysicalTank: false,
        tankCount: 3,
        tankType: 'residential',
        location: 'Demo Location',
        capacity: '5000',
        currentLevel: '3500',
        sensorConnected: true,
        wantsDemoMode: true
      }
    };
    
    localStorage.setItem('authToken', 'demo-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    toast({
      title: 'Demo Mode Activated! 🚀',
      description: 'Exploring AquaMind with sample data.',
    });
    
    navigate('/dashboard');
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Interactive Dashboard',
      description: 'Explore the full dashboard with sample data to see how AquaMind works.'
    },
    {
      icon: Zap,
      title: 'AI-Powered Analytics',
      description: 'See how our AI predicts water usage and suggests optimizations.'
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Experience how AquaMind notifies you about important water events.'
    },
    {
      icon: Droplets,
      title: 'Tank Monitoring',
      description: 'View real-time water levels and consumption patterns.'
    }
  ];

  return (
    <AnimatedBackground>
      <div className="min-h-screen bg-background/80 backdrop-blur-sm">
        {/* Demo Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <Droplets className="h-8 w-8 text-primary animate-wave" />
              <div>
                <h1 className="text-xl font-bold aqua-gradient bg-clip-text text-transparent">
                  AquaMind Demo
                </h1>
                <div className="text-xs text-muted-foreground -mt-1">
                  {showQuestions ? 'Getting Started' : 'Interactive Demo Mode'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {showQuestions ? (
                <Button 
                  onClick={() => setShowQuestions(false)}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Demo
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
              )}
              <Button 
                onClick={showQuestions ? handleStartDemo : handleLaunchAquaMind}
                className="aqua-gradient text-white"
              >
                {showQuestions ? 'Start Demo' : 'Launch AquaMind'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Demo Content */}
        <section className="py-12">
          <div className="container px-4">
            {!showQuestions ? (
              <>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold mb-4">
                    Experience AquaMind
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Explore the features of our smart water management system with sample data
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {features.map((feature, index) => (
                    <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <feature.icon className="h-6 w-6 text-primary" />
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-4 aqua-gradient bg-clip-text text-transparent">
                      Welcome to AquaMind!
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Let's get you started with smart water management
                    </p>
                  </div>

                  <Card className="p-8 bg-gradient-to-br from-background to-muted/20 border-2">
                    <div className="space-y-6">
                      <div className="text-center">
                        <Droplets className="h-20 w-20 text-primary mx-auto mb-4 animate-wave" />
                        <h2 className="text-3xl font-bold mb-2">Ready to Start?</h2>
                        <p className="text-muted-foreground mb-6 text-lg">
                          Click below to explore AquaMind with sample data and see how it can transform your water management.
                        </p>
                      </div>

                      <div className="grid gap-4">
                        <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                          <BarChart3 className="h-8 w-8 text-blue-500" />
                          <div>
                            <h3 className="font-bold text-lg">Real-time Monitoring</h3>
                            <p className="text-muted-foreground">Track water levels across all your tanks</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-6 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                          <Zap className="h-8 w-8 text-green-500" />
                          <div>
                            <h3 className="font-bold text-lg">AI Predictions</h3>
                            <p className="text-muted-foreground">Get smart forecasts and usage insights</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-6 bg-purple-50 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                          <Bell className="h-8 w-8 text-purple-500" />
                          <div>
                            <h3 className="font-bold text-lg">Smart Alerts</h3>
                            <p className="text-muted-foreground">Never run out of water unexpectedly</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-6">
                        <Link to="/signup">
                          <Button size="lg" className="aqua-gradient text-white text-lg px-8 py-4 h-auto">
                            Sign Up Now
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm pt-4">
                        {[
                          'No credit card required',
                          '14-day free trial',
                          'Cancel anytime',
                          '24/7 Support'
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold mb-4">
                    Welcome to AquaMind!
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Let's get you started with smart water management
                  </p>
                </div>

                <Card className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <Droplets className="h-16 w-16 text-primary mx-auto mb-4 animate-wave" />
                      <h2 className="text-2xl font-bold mb-2">Ready to Start?</h2>
                      <p className="text-muted-foreground mb-6">
                        Click below to explore AquaMind with sample data and see how it can transform your water management.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-blue-500" />
                        <div>
                          <h3 className="font-semibold">Real-time Monitoring</h3>
                          <p className="text-sm text-muted-foreground">Track water levels across all your tanks</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                        <Zap className="h-6 w-6 text-green-500" />
                        <div>
                          <h3 className="font-semibold">AI Predictions</h3>
                          <p className="text-sm text-muted-foreground">Get smart forecasts and usage insights</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                        <Bell className="h-6 w-6 text-purple-500" />
                        <div>
                          <h3 className="font-semibold">Smart Alerts</h3>
                          <p className="text-sm text-muted-foreground">Never run out of water unexpectedly</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      <Button 
                        onClick={handleStartDemo}
                        size="lg" 
                        className="aqua-gradient text-white w-full"
                      >
                        <Zap className="mr-2 h-5 w-5" />
                        Start Demo Experience
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>
      </div>
    </AnimatedBackground>
  );
};

export default Demo;
