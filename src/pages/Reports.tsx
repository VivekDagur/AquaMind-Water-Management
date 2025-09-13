import React from 'react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import WaterUsageReports from '@/components/WaterUsageReports';

const Reports: React.FC = () => {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold aqua-gradient bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive water usage reports with AI recommendations
          </p>
        </div>

        <WaterUsageReports />
      </div>
    </ProtectedLayout>
  );
};

export default Reports;