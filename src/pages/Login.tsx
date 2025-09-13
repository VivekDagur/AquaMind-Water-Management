import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, Eye, EyeOff, Loader2, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call backend API for authentication
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://aquamind-backend.herokuapp.com/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: 'Login Successful! 🎉',
          description: `Welcome back, ${data.user.name}!`,
        });

        // Check if user needs setup
        if (!data.user.setupCompleted) {
          navigate('/setup');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    // Set demo user in localStorage and navigate to dashboard
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
    
    // Navigate to dashboard (demo mode skips setup)
    navigate('/dashboard');
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

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="login-email">Email address</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  disabled={isLoading}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 pr-10"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full aqua-gradient text-white hover:opacity-90 transition-all duration-300 hover:scale-[1.02]" 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Droplets className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>

            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button 
                type="button"
                onClick={handleDemoMode}
                variant="outline"
                className="w-full transition-all duration-300 hover:scale-[1.02]" 
                size="lg"
              >
                Try Demo Mode
              </Button>
              
              <div className="space-y-3">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full transition-all duration-300 hover:scale-[1.02]" 
                  size="lg"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full transition-all duration-300 hover:scale-[1.02]" 
                  size="lg"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full transition-all duration-300 hover:scale-[1.02]" 
                  size="lg"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Continue with Phone
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;