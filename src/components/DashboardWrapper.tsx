import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import TankSetupWizard from '@/components/TankSetupWizard';

const DashboardWrapper: React.FC = () => {
  const { user, completeSetup, setDemoMode } = useAuth();
  const [searchParams] = useSearchParams();
  const isDemoParam = searchParams.get('demo') === 'true';

  // Enable demo mode if demo parameter is in URL
  useEffect(() => {
    if (isDemoParam && !user?.demoMode) {
      setDemoMode(true);
    }
  }, [isDemoParam, setDemoMode, user?.demoMode]);

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
