import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, Eye, EyeOff, Loader2, CheckCircle, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SubtleAnimatedBackground from '@/components/SubtleAnimatedBackground';

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
      // Call backend API for user registration
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://aquamind-backend.herokuapp.com/api'}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Account Created! 🎉',
          description: 'Welcome to AquaMind! You can now sign in.',
        });

        // Navigate to setup page for new users
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        navigate('/setup');
      } else {
        toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: data.message || 'Something went wrong. Please try again.',
        });
      }
      
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Network error. Please try again.',
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
    <SubtleAnimatedBackground intensity="medium">
      <div className="min-h-screen flex items-center justify-center ocean-gradient p-4">

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
              Create your account to start smart water management
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
              
              <div className="pt-4 border-t border-border space-y-4">
                <div className="space-y-3">
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full transition-all duration-300 hover:scale-[1.02]" 
                    size="lg"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Sign up with Google
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
                    Sign up with Facebook
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full transition-all duration-300 hover:scale-[1.02]" 
                    size="lg"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Sign up with Phone
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
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
    </SubtleAnimatedBackground>
  );
};

export default Signup;