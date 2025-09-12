import React from 'react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold aqua-gradient bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            View consumption patterns and export data
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Water Usage Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Detailed consumption analysis for all tanks
              </p>
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Efficiency Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Weekly efficiency and optimization metrics
              </p>
              <Button className="w-full" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Trends
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default Reports;