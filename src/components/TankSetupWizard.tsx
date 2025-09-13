import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, Home, Building, Factory } from 'lucide-react';

interface TankSetupData {
  hasPhysicalTank: boolean;
  tankCount: number;
  tankType: 'residential' | 'commercial' | 'industrial' | 'community';
  location: string;
  capacity: string;
  currentLevel: string;
  sensorConnected: boolean;
  wantsDemoMode: boolean;
}

interface TankSetupWizardProps {
  onComplete: (setupData: TankSetupData) => void;
  onSkipToDemo: () => void;
}

const TankSetupWizard: React.FC<TankSetupWizardProps> = ({ onComplete, onSkipToDemo }) => {
  const [step, setStep] = useState(1);
  const [setupData, setSetupData] = useState<TankSetupData>({
    hasPhysicalTank: false,
    tankCount: 1,
    tankType: 'residential',
    location: '',
    capacity: '',
    currentLevel: '',
    sensorConnected: false,
    wantsDemoMode: false
  });

  const updateSetupData = (updates: Partial<TankSetupData>) => {
    setSetupData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleComplete = () => {
    onComplete(setupData);
  };

  const tankTypeIcons = {
    residential: <Home className="w-6 h-6" />,
    commercial: <Building className="w-6 h-6" />,
    industrial: <Factory className="w-6 h-6" />,
    community: <Droplets className="w-6 h-6" />
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Droplets className="w-6 h-6 text-blue-500" />
                Welcome to AquaMind
              </CardTitle>
              <CardDescription>
                Let's set up your water management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Do you have a physical water tank to monitor?</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-tank"
                      checked={setupData.hasPhysicalTank}
                      onCheckedChange={(checked) => updateSetupData({ hasPhysicalTank: !!checked })}
                    />
                    <Label htmlFor="has-tank">Yes, I have a water tank to monitor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="demo-mode"
                      checked={setupData.wantsDemoMode}
                      onCheckedChange={(checked) => updateSetupData({ wantsDemoMode: !!checked })}
                    />
                    <Label htmlFor="demo-mode">No, show me a demo with sample data</Label>
                  </div>
                </div>
              </div>

              {setupData.wantsDemoMode && (
                <Alert>
                  <Droplets className="h-4 w-4" />
                  <AlertDescription>
                    Demo mode will show you how AquaMind works with sample tank data and simulated monitoring.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={setupData.wantsDemoMode ? onSkipToDemo : nextStep}
                  disabled={!setupData.hasPhysicalTank && !setupData.wantsDemoMode}
                  className="flex-1"
                >
                  {setupData.wantsDemoMode ? 'Start Demo' : 'Continue'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Tank Information</CardTitle>
              <CardDescription>Tell us about your water tank setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tank-type">What type of facility is this?</Label>
                <Select value={setupData.tankType} onValueChange={(value: 'residential' | 'commercial' | 'industrial' | 'community') => updateSetupData({ tankType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Residential Home
                      </div>
                    </SelectItem>
                    <SelectItem value="commercial">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Commercial Building
                      </div>
                    </SelectItem>
                    <SelectItem value="industrial">
                      <div className="flex items-center gap-2">
                        <Factory className="w-4 h-4" />
                        Industrial Facility
                      </div>
                    </SelectItem>
                    <SelectItem value="community">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        Community/Public
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tank-count">How many tanks do you have?</Label>
                <Select value={setupData.tankCount.toString()} onValueChange={(value) => updateSetupData({ tankCount: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} tank{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location/Address</Label>
                <Input
                  id="location"
                  placeholder="e.g., 123 Main Street, City"
                  value={setupData.location}
                  onChange={(e) => updateSetupData({ location: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Tank Specifications</CardTitle>
              <CardDescription>Help us understand your tank capacity and current status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Tank Capacity (in liters)</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="e.g., 5000"
                  value={setupData.capacity}
                  onChange={(e) => updateSetupData({ capacity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-level">Current Water Level (in liters)</Label>
                <Input
                  id="current-level"
                  type="number"
                  placeholder="e.g., 3500"
                  value={setupData.currentLevel}
                  onChange={(e) => updateSetupData({ currentLevel: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Sensor Connection</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sensor-connected"
                    checked={setupData.sensorConnected}
                    onCheckedChange={(checked) => updateSetupData({ sensorConnected: !!checked })}
                  />
                  <Label htmlFor="sensor-connected">I have IoT sensors connected to my tank</Label>
                </div>
                {!setupData.sensorConnected && (
                  <Alert>
                    <AlertDescription>
                      No problem! You can manually update tank levels or connect sensors later.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Setup Complete!</CardTitle>
              <CardDescription>Your AquaMind system is ready to go</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <h3 className="font-medium text-green-800">Your Configuration:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• {setupData.tankCount} {setupData.tankType} tank{setupData.tankCount > 1 ? 's' : ''}</li>
                  <li>• Location: {setupData.location || 'Not specified'}</li>
                  <li>• Capacity: {setupData.capacity ? `${setupData.capacity}L` : 'Not specified'}</li>
                  <li>• Current Level: {setupData.currentLevel ? `${setupData.currentLevel}L` : 'Not specified'}</li>
                  <li>• Sensors: {setupData.sensorConnected ? 'Connected' : 'Manual monitoring'}</li>
                </ul>
              </div>

              <Alert>
                <Droplets className="h-4 w-4" />
                <AlertDescription>
                  You can always modify these settings later in your dashboard preferences.
                </AlertDescription>
              </Alert>

              <Button onClick={handleComplete} className="w-full">
                Start Monitoring
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full ${
                  stepNum <= step ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Step {step} of 4
          </p>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default TankSetupWizard;
