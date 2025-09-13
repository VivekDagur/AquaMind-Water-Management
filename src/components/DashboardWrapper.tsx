import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import TankSetupWizard from '@/components/TankSetupWizard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DashboardWrapper: React.FC = () => {
  const { user, completeSetup, setDemoMode, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const isDemoParam = searchParams.get('demo') === 'true';
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Handle demo mode initialization
  useEffect(() => {
    if (isDemoParam && (!isAuthenticated || !user?.demoMode)) {
      // Set demo mode
      setDemoMode(true);
      // Force update the user in the context
      setInitialized(true);
      // Remove the demo param to prevent loops
      navigate('/dashboard', { replace: true });
    } else {
      setInitialized(true);
    }
  }, [isDemoParam, isAuthenticated, user?.demoMode, navigate, setDemoMode]);

  // Show loading while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // In demo mode or if setup is completed, show dashboard
  if (user?.demoMode || user?.setupCompleted) {
    return <Dashboard />;
  }

  // Handle tank setup completion
  const handleSetupComplete = async (setupData: {
    hasPhysicalTank: boolean;
    tankCount: number;
    tankType: 'residential' | 'commercial' | 'industrial' | 'community';
    location: string;
    capacity: string;
    currentLevel: string;
    sensorConnected: boolean;
    wantsDemoMode: boolean;
  }) => {
    try {
      // Create tanks in backend if not in demo mode
      if (!user?.demoMode) {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Create tanks based on setup data
          for (let i = 0; i < setupData.tankCount; i++) {
            const tankName = setupData.tankCount === 1 ? 'Main Tank' : `Tank ${i + 1}`;
            await fetch(`${API_URL}/tanks`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: tankName,
                capacity: parseFloat(setupData.capacity) || 5000,
                currentLevel: parseFloat(setupData.currentLevel) || 0,
                location: setupData.location || 'Not specified',
                tankType: setupData.tankType
              })
            });
          }
        }
      }
      
      // Complete setup in auth context
      await completeSetup(setupData);
    } catch (error) {
      console.error('Error completing setup:', error);
      // Still complete setup even if tank creation fails
      await completeSetup(setupData);
    }
  };

  // Show setup wizard for new users
  return (
    <TankSetupWizard
      onComplete={handleSetupComplete}
      onSkipToDemo={() => setDemoMode(true)}
    />
  );
};

export default DashboardWrapper;
