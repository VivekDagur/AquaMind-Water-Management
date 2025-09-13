import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import TankSetupWizard from '@/components/TankSetupWizard';

const DashboardWrapper: React.FC = () => {
  const { user, completeSetup, setDemoMode } = useAuth();

  // Show setup wizard if user hasn't completed setup
  if (user && !user.setupCompleted) {
    return (
      <TankSetupWizard
        onComplete={completeSetup}
        onSkipToDemo={setDemoMode}
      />
    );
  }

  // Show regular dashboard if setup is completed
  return <Dashboard />;
};

export default DashboardWrapper;
