import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Droplets, 
  BarChart3, 
  Bell, 
  Zap, 
  CheckCircle, 
  ChevronRight 
} from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/hooks/useAuth';

const Demo: React.FC = () => {
  const { isAuthenticated } = useAuth();

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
                <p className="text-xs text-muted-foreground -mt-1">
                  Interactive Demo Mode
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button className="aqua-gradient text-white">
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Demo Content */}
        <section className="py-12">
          <div className="container px-4">
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

            <div className="bg-card rounded-lg border p-6 max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Ready to try AquaMind with your own data?</h2>
                <p className="text-muted-foreground mb-6">
                  Sign up now to start monitoring your water usage in real-time
                </p>
                <Link to="/signup">
                  <Button size="lg" className="aqua-gradient text-white">
                    Start Your Free Trial
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                {[
                  'No credit card required',
                  '14-day free trial',
                  'Cancel anytime',
                  '24/7 Support'
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AnimatedBackground>
  );
};

export default Demo;
