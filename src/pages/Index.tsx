import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

/**
 * Index page - Public landing page for AquaMind
 * Showcases features and guides users to login/signup
 */
const Index: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Monitoring',
      description: 'Track water levels, consumption, and tank health with live updates every 5 seconds.'
    },
    {
      icon: Zap,
      title: 'AI-Powered Insights',
      description: 'Predictive analytics and anomaly detection to prevent water shortages before they happen.'
    },
    {
      icon: Shield,
      title: 'Smart Alerts',
      description: 'Intelligent notifications for low levels, leaks, and maintenance requirements.'
    },
    {
      icon: Users,
      title: 'Community Management',
      description: 'Manage both personal and community water tanks from a single dashboard.'
    }
  ];

  const benefits = [
    'Prevent water shortages with 24h advance warnings',
    'Reduce water waste by up to 30% with AI optimization',
    'Monitor unlimited tanks and communities',
    'Mobile-responsive design for on-the-go management',
    'Export reports and analytics for planning'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Droplets className="h-8 w-8 text-primary animate-wave" />
            <div>
              <h1 className="text-xl font-bold aqua-gradient bg-clip-text text-transparent">
                AquaMind
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Smart Water Management
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="aqua-gradient text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 ocean-gradient">
        <div className="container px-4">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              Powered by AI
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Smart Water Tank
              <br />
              <span className="text-primary-glow">Management System</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-up">
              Monitor water levels, predict usage patterns, and prevent shortages with 
              AI-powered insights for homes and communities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-scale-in">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to manage water smartly
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From real-time monitoring to predictive analytics, AquaMind provides 
              comprehensive water management tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-muted-foreground">Uptime Guarantee</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">30%</div>
              <div className="text-muted-foreground">Water Savings</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Monitoring</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-muted-foreground">Tanks Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why choose AquaMind?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who have revolutionized their water management 
                with intelligent monitoring and predictive analytics.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/signup">
                  <Button size="lg" className="aqua-gradient text-white">
                    Get Started Today
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Card className="p-6 depth-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Tank Level Overview</h3>
                    <Badge className="bg-success text-success-foreground">Live</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {['Main Tank', 'Community Tank A', 'Backup Tank'].map((tank, i) => (
                      <div key={tank} className="flex items-center justify-between">
                        <span className="text-sm">{tank}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-1000"
                              style={{ width: `${85 - i * 20}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{85 - i * 20}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Next refill due:</span>
                      <span className="font-medium text-warning">18 hours</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t border-border">
        <div className="container px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">AquaMind</span>
          </div>
          <p className="text-muted-foreground mb-6">
            Smart water management for a sustainable future
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            © 2024 AquaMind. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;