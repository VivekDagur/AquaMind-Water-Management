import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import TankSetupWizard from '@/components/TankSetupWizard';

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

  // Show setup wizard for new users
  return (
    <TankSetupWizard
      onComplete={completeSetup}
      onSkipToDemo={() => setDemoMode(true)}
    />
  );
};

export default DashboardWrapper;
