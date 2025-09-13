import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Zap } from 'lucide-react';

const Login: React.FC = () => {
  const handleDemoMode = () => {
    // Simple demo mode - just redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center ocean-gradient p-4">
      <Card className="w-full max-w-md animate-scale-in aqua-shadow bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Droplets className="h-12 w-12 text-primary animate-wave" />
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold aqua-gradient bg-clip-text text-transparent">
              Welcome to AquaMind
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your water management dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button 
              onClick={handleDemoMode}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-[1.02] hover-lift" 
              size="lg"
            >
              <Zap className="mr-2 h-4 w-4" />
              Try Demo Mode
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Demo: Click above to access the dashboard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;