import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ReportsData {
  summary: {
    totalTanks: number;
    totalCapacity: number;
    totalCurrent: number;
    efficiency: string;
    averageLevel: string;
  };
  weeklyConsumption: Array<{
    date: string;
    day: string;
    consumption: number;
  }>;
  tankPerformance: Array<{
    id: string;
    name: string;
    capacity: number;
    currentLevel: number;
    percentage: string;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    location: string;
    lastUpdated: string;
  }>;
  alerts: {
    critical: number;
    warning: number;
    normal: number;
  };
}

const ReportsPage: React.FC = () => {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchReports = useCallback(async () => {
    if (!user || user.demoMode) {
      // Demo mode data
      const demoData: ReportsData = {
        summary: {
          totalTanks: 3,
          totalCapacity: 15000,
          totalCurrent: 8500,
          efficiency: '56.7',
          averageLevel: '2833'
        },
        weeklyConsumption: [
          { date: '2024-01-08', day: 'Mon', consumption: 450 },
          { date: '2024-01-09', day: 'Tue', consumption: 520 },
          { date: '2024-01-10', day: 'Wed', consumption: 380 },
          { date: '2024-01-11', day: 'Thu', consumption: 610 },
          { date: '2024-01-12', day: 'Fri', consumption: 490 },
          { date: '2024-01-13', day: 'Sat', consumption: 320 },
          { date: '2024-01-14', day: 'Sun', consumption: 280 }
        ],
        tankPerformance: [
          {
            id: 'demo-1',
            name: 'Main Tank',
            capacity: 5000,
            currentLevel: 425,
            percentage: '8.5',
            status: 'critical',
            location: 'Building A',
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'demo-2',
            name: 'Secondary Tank',
            capacity: 5000,
            currentLevel: 1265,
            percentage: '25.3',
            status: 'warning',
            location: 'Building B',
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'demo-3',
            name: 'Backup Tank',
            capacity: 5000,
            currentLevel: 4200,
            percentage: '84.0',
            status: 'excellent',
            location: 'Building C',
            lastUpdated: new Date().toISOString()
          }
        ],
        alerts: {
          critical: 1,
          warning: 1,
          normal: 1
        }
      };
      setReportsData(demoData);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_URL}/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReportsData(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [user, API_URL]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const pieChartData = reportsData ? [
    { name: 'Critical', value: reportsData.alerts.critical, color: '#ef4444' },
    { name: 'Warning', value: reportsData.alerts.warning, color: '#f59e0b' },
    { name: 'Normal', value: reportsData.alerts.normal, color: '#10b981' }
  ] : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (!reportsData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>No reports data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your water management system</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={fetchReports} size="sm" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tanks</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.summary.totalTanks}</div>
            <p className="text-xs text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.summary.totalCapacity.toLocaleString()}L</div>
            <p className="text-xs text-muted-foreground">Maximum storage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.summary.totalCurrent.toLocaleString()}L</div>
            <p className="text-xs text-muted-foreground">Available water</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.summary.efficiency}%</div>
            <p className="text-xs text-muted-foreground">System utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Consumption Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Water Consumption</CardTitle>
            <CardDescription>Daily consumption patterns over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsData.weeklyConsumption}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}L`, 'Consumption']} />
                <Bar dataKey="consumption" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tank Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Tank Status Distribution</CardTitle>
            <CardDescription>Current status breakdown of all tanks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tank Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tank Performance Details</CardTitle>
          <CardDescription>Individual tank status and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Tank Name</th>
                  <th className="text-left py-3 px-4 font-medium">Location</th>
                  <th className="text-left py-3 px-4 font-medium">Capacity</th>
                  <th className="text-left py-3 px-4 font-medium">Current Level</th>
                  <th className="text-left py-3 px-4 font-medium">Percentage</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.tankPerformance.map((tank) => (
                  <tr key={tank.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{tank.name}</td>
                    <td className="py-3 px-4 text-gray-600">{tank.location}</td>
                    <td className="py-3 px-4">{tank.capacity.toLocaleString()}L</td>
                    <td className="py-3 px-4">{tank.currentLevel.toLocaleString()}L</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              parseFloat(tank.percentage) > 70 ? 'bg-green-500' :
                              parseFloat(tank.percentage) > 30 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(parseFloat(tank.percentage), 100)}%` }}
                          />
                        </div>
                        <span className="text-sm">{tank.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusColor(tank.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(tank.status)}
                        {tank.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(tank.lastUpdated).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Consumption Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Consumption Trend</CardTitle>
          <CardDescription>Water usage pattern over the week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportsData.weeklyConsumption}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}L`, 'Consumption']} />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
