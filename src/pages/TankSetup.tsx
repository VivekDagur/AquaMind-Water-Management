import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, MapPin, Gauge, Users, Home, Building, Factory, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/AnimatedBackground';

const TankSetup: React.FC = () => {
  const [formData, setFormData] = useState({
    hasPhysicalTank: true,
    tankCount: '1',
    tankType: 'residential',
    location: '',
    capacity: '',
    currentLevel: '',
    sensorConnected: false,
    tankName: '',
    unitType: 'liters'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.hasPhysicalTank) {
      if (!formData.capacity) {
        newErrors.capacity = 'Tank capacity is required';
      }
      if (!formData.currentLevel) {
        newErrors.currentLevel = 'Current water level is required';
      }
      if (!formData.tankName.trim()) {
        newErrors.tankName = 'Tank name is required';
      }
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
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('authToken');

      // Save tank setup to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://aquamind-backend.herokuapp.com/api'}/tanks/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData
        }),
      });

      if (response.ok) {
        // Update user setup status
        const updatedUser = { ...user, setupCompleted: true, tankSetup: formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast({
          title: 'Tank Setup Complete! 🎉',
          description: 'Your water management system is now configured.',
        });

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        const data = await response.json();
        toast({
          variant: 'destructive',
          title: 'Setup Failed',
          description: data.message || 'Something went wrong. Please try again.',
        });
      }
      
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Setup Failed',
        description: 'Network error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const tankTypeIcons = {
    residential: Home,
    community: Users,
    commercial: Building,
    industrial: Factory
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen bg-background/80 backdrop-blur-sm py-12">
        <div className="container px-4 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Droplets className="h-16 w-16 text-primary mx-auto mb-4 animate-wave" />
            <h1 className="text-4xl font-bold mb-4">
              Set Up Your Water System
            </h1>
            <p className="text-xl text-muted-foreground">
              Configure your tanks to start smart water monitoring
            </p>
          </div>

          <Card className="aqua-shadow bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Tank Configuration
              </CardTitle>
              <CardDescription>
                Tell us about your water storage system
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Physical Tank Check */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPhysicalTank"
                    checked={formData.hasPhysicalTank}
                    onCheckedChange={(checked) => handleInputChange('hasPhysicalTank', checked as boolean)}
                  />
                  <Label htmlFor="hasPhysicalTank" className="text-sm font-medium">
                    I have a physical water tank to monitor
                  </Label>
                </div>

                {/* Tank Type */}
                <div className="space-y-2">
                  <Label>Tank Type</Label>
                  <Select value={formData.tankType} onValueChange={(value) => handleInputChange('tankType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tank type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          Residential
                        </div>
                      </SelectItem>
                      <SelectItem value="community">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Community
                        </div>
                      </SelectItem>
                      <SelectItem value="commercial">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Commercial
                        </div>
                      </SelectItem>
                      <SelectItem value="industrial">
                        <div className="flex items-center gap-2">
                          <Factory className="h-4 w-4" />
                          Industrial
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g., Mumbai, Maharashtra"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`pl-10 ${errors.location ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location}</p>
                  )}
                </div>

                {formData.hasPhysicalTank && (
                  <>
                    {/* Tank Name */}
                    <div className="space-y-2">
                      <Label htmlFor="tankName">Tank Name</Label>
                      <Input
                        id="tankName"
                        placeholder="e.g., Main Tank, Rooftop Tank"
                        value={formData.tankName}
                        onChange={(e) => handleInputChange('tankName', e.target.value)}
                        className={errors.tankName ? 'border-destructive' : ''}
                        disabled={isLoading}
                      />
                      {errors.tankName && (
                        <p className="text-sm text-destructive">{errors.tankName}</p>
                      )}
                    </div>

                    {/* Tank Count */}
                    <div className="space-y-2">
                      <Label>Number of Tanks</Label>
                      <Select value={formData.tankCount} onValueChange={(value) => handleInputChange('tankCount', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Tank{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Capacity and Unit */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Tank Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          placeholder="5000"
                          value={formData.capacity}
                          onChange={(e) => handleInputChange('capacity', e.target.value)}
                          className={errors.capacity ? 'border-destructive' : ''}
                          disabled={isLoading}
                        />
                        {errors.capacity && (
                          <p className="text-sm text-destructive">{errors.capacity}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select value={formData.unitType} onValueChange={(value) => handleInputChange('unitType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="liters">Liters</SelectItem>
                            <SelectItem value="gallons">Gallons</SelectItem>
                            <SelectItem value="cubic_meters">Cubic Meters</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Current Level */}
                    <div className="space-y-2">
                      <Label htmlFor="currentLevel">Current Water Level ({formData.unitType})</Label>
                      <Input
                        id="currentLevel"
                        type="number"
                        placeholder="3500"
                        value={formData.currentLevel}
                        onChange={(e) => handleInputChange('currentLevel', e.target.value)}
                        className={errors.currentLevel ? 'border-destructive' : ''}
                        disabled={isLoading}
                      />
                      {errors.currentLevel && (
                        <p className="text-sm text-destructive">{errors.currentLevel}</p>
                      )}
                    </div>

                    {/* Sensor Connection */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sensorConnected"
                        checked={formData.sensorConnected}
                        onCheckedChange={(checked) => handleInputChange('sensorConnected', checked as boolean)}
                      />
                      <Label htmlFor="sensorConnected" className="text-sm">
                        I have IoT sensors connected to my tank
                      </Label>
                    </div>

                    {!formData.sensorConnected && (
                      <Alert>
                        <AlertDescription>
                          Don't worry! You can still use AquaMind with manual updates. 
                          We'll help you track usage patterns and provide smart recommendations.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full aqua-gradient text-white hover:opacity-90 transition-all duration-300 hover:scale-[1.02]" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting Up...
                    </>
                  ) : (
                    <>
                      <Droplets className="mr-2 h-4 w-4" />
                      Complete Setup
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default TankSetup;
