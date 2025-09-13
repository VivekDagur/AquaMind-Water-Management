import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, Eye, EyeOff, Loader2, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated, setDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleDemoMode = async () => {
    setIsLoading(true);
    try {
      setDemoMode();
      toast({
        title: 'Demo Mode Activated! 🚀',
        description: 'Welcome to AquaMind demo with sample data.',
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Failed to start demo mode');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ocean-gradient p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-wave" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="w-full max-w-md animate-scale-in aqua-shadow bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Droplets className="h-12 w-12 text-primary animate-wave" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-glow rounded-full animate-pulse"></div>
            </div>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-slide-up">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@aquamind.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
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
                  Signing in...
                </>
              ) : (
                <>
                  <Droplets className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>

            <Button 
              type="button"
              onClick={handleDemoMode}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-[1.02] hover-lift" 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Demo...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Try Demo Mode
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
                  Sign up for free
                </Link>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Demo: Use any email/password to login
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;