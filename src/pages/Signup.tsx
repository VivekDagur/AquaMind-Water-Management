import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay (700-1000ms as requested)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: 'Account Created! 🎉',
        description: 'Welcome to AquaMind! Please log in with your new account.',
      });

      // Redirect to login page as requested (no real backend)
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please log in.',
          email: formData.email 
        } 
      });
      
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordStrength = React.useMemo(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return {
      score: strength,
      label: strength === 0 ? '' : 
             strength === 1 ? 'Weak' : 
             strength === 2 ? 'Fair' : 
             strength === 3 ? 'Good' : 'Strong'
    };
  }, [formData.password]);

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
              Join AquaMind
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your account to start monitoring water tanks
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isLoading}
                className={`transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
                  errors.name ? 'border-destructive' : ''
                }`}
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-sm text-destructive animate-slide-up">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email address</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isLoading}
                className={`transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? 'border-destructive' : ''
                }`}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-destructive animate-slide-up">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isLoading}
                  className={`transition-all duration-200 focus:ring-2 focus:ring-primary/20 pr-10 ${
                    errors.password ? 'border-destructive' : ''
                  }`}
                  autoComplete="new-password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength.score
                            ? passwordStrength.score <= 1 ? 'bg-destructive' :
                              passwordStrength.score <= 2 ? 'bg-warning' :
                              passwordStrength.score <= 3 ? 'bg-primary' : 'bg-success'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className={`text-xs ${
                      passwordStrength.score <= 1 ? 'text-destructive' :
                      passwordStrength.score <= 2 ? 'text-warning' :
                      passwordStrength.score <= 3 ? 'text-primary' : 'text-success'
                    }`}>
                      Password strength: {passwordStrength.label}
                    </p>
                  )}
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-destructive animate-slide-up">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={isLoading}
                  className={`transition-all duration-200 focus:ring-2 focus:ring-primary/20 pr-10 ${
                    errors.confirmPassword ? 'border-destructive' : ''
                  }`}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="flex items-center space-x-1 text-success text-sm animate-fade-in">
                  <CheckCircle className="h-3 w-3" />
                  <span>Passwords match</span>
                </div>
              )}
              
              {errors.confirmPassword && (
                <p className="text-sm text-destructive animate-slide-up">{errors.confirmPassword}</p>
              )}
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
                  Creating Account...
                </>
              ) : (
                <>
                  <Droplets className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>

            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;