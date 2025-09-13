import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Droplets, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  BarChart3,
  Download,
  Calendar,
  Bell
} from 'lucide-react';

interface WaterUsageReport {
  id: string;
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
  totalUsage: number;
  communityUsage: number;
  individualUsage: number;
  efficiency: number;
  savings: number;
  recommendations: string[];
}

interface CommunityStats {
  totalMembers: number;
  activeTanks: number;
  communityTanks: number;
  individualTanks: number;
  totalCapacity: number;
  currentUsage: number;
  efficiency: number;
}

const WaterUsageReports: React.FC = () => {
  const [reports, setReports] = useState<WaterUsageReport[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalMembers: 24,
    activeTanks: 8,
    communityTanks: 3,
    individualTanks: 5,
    totalCapacity: 25000,
    currentUsage: 18750,
    efficiency: 89
  });

  // Generate sample reports
  useEffect(() => {
    const sampleReports: WaterUsageReport[] = [
      {
        id: '1',
        period: 'weekly',
        date: '2024-09-08',
        totalUsage: 1250,
        communityUsage: 750,
        individualUsage: 500,
        efficiency: 92,
        savings: 180,
        recommendations: [
          'Community Tank Alpha shows 15% higher usage - investigate potential leak',
          'Individual tanks performing well with 92% efficiency',
          'Consider staggered refill schedule to optimize water pressure'
        ]
      },
      {
        id: '2',
        period: 'monthly',
        date: '2024-08-31',
        totalUsage: 5200,
        communityUsage: 3200,
        individualUsage: 2000,
        efficiency: 88,
        savings: 650,
        recommendations: [
          'Monthly efficiency improved by 4% compared to previous month',
          'Community consumption within normal range',
          'Individual tank optimization saved 650L this month'
        ]
      }
    ];
    setReports(sampleReports);
  }, []);

  const handleExportReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      // Simulate CSV export
      const csvContent = `Period,Date,Total Usage,Community Usage,Individual Usage,Efficiency,Savings
${report.period},${report.date},${report.totalUsage},${report.communityUsage},${report.individualUsage},${report.efficiency}%,${report.savings}L`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aquamind-report-${report.date}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Community Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Community Overview
          </CardTitle>
          <CardDescription>
            Real-time community water management statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{communityStats.totalMembers}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{communityStats.activeTanks}</div>
              <div className="text-sm text-gray-600">Active Tanks</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{communityStats.communityTanks}</div>
              <div className="text-sm text-gray-600">Community Tanks</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{communityStats.efficiency}%</div>
              <div className="text-sm text-gray-600">Efficiency</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Community Water Usage</span>
              <span>{communityStats.currentUsage.toLocaleString()}L / {communityStats.totalCapacity.toLocaleString()}L</span>
            </div>
            <Progress value={(communityStats.currentUsage / communityStats.totalCapacity) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Usage Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Water Usage Reports</h2>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Generate New Report
          </Button>
        </div>

        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    {report.period.charAt(0).toUpperCase() + report.period.slice(1)} Report
                  </CardTitle>
                  <CardDescription>
                    Generated on {new Date(report.date).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant={report.efficiency >= 90 ? "default" : "secondary"}>
                  {report.efficiency}% Efficiency
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">{report.totalUsage}L</div>
                  <div className="text-xs text-gray-600">Total Usage</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">{report.communityUsage}L</div>
                  <div className="text-xs text-gray-600">Community</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-semibold text-purple-600">{report.individualUsage}L</div>
                  <div className="text-xs text-gray-600">Individual</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-semibold text-orange-600">{report.savings}L</div>
                  <div className="text-xs text-gray-600">Saved</div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">AI Recommendations:</h4>
                {report.recommendations.map((rec, index) => (
                  <Alert key={index} className="border-blue-200 bg-blue-50">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      {rec}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportReport(report.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Calendar className="w-6 h-6 mb-2 text-blue-500" />
              <span className="text-sm">Schedule Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <TrendingUp className="w-6 h-6 mb-2 text-green-500" />
              <span className="text-sm">View Trends</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="w-6 h-6 mb-2 text-purple-500" />
              <span className="text-sm">Export All Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterUsageReports;
