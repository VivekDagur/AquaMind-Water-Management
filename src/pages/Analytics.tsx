import React from 'react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Globe } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-500" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time visitor tracking and user behavior analysis for hackathon demonstration
            </p>
          </div>
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            🔴 LIVE TRACKING
          </Badge>
        </div>

        {/* Key Features for Judges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Visitor Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Real-time monitoring of website visitors, session duration, and user interactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Behavior Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track user clicks, form submissions, AI chat usage, and feature engagement
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-500" />
                Data Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Device info, location data, performance metrics, and comprehensive analytics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Storage Information */}
        <Alert className="border-blue-200 bg-blue-50">
          <Globe className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>📊 Where Your Website Data is Stored:</strong><br/>
            <div className="mt-2 space-y-1 text-sm">
              <div>• <strong>Google Analytics 4:</strong> Visitor behavior, page views, conversion tracking (cloud-based)</div>
              <div>• <strong>Browser Local Storage:</strong> Demo interactions, session data (client-side)</div>
              <div>• <strong>MongoDB Atlas:</strong> User accounts, tank data, chat conversations (cloud database)</div>
              <div>• <strong>Railway Logs:</strong> Backend API requests, server performance (hosting platform)</div>
              <div>• <strong>Netlify Analytics:</strong> Frontend deployment metrics, CDN performance (hosting platform)</div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Main Analytics Dashboard */}
        <AnalyticsDashboard />

        {/* Additional Information for Judges */}
        <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Hackathon Demo - Analytics Capabilities
            </CardTitle>
            <CardDescription className="text-yellow-600">
              Comprehensive data collection and analysis features demonstrated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-yellow-800 mb-3">Real-time Tracking:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>✅ Live visitor sessions</li>
                  <li>✅ User interaction events</li>
                  <li>✅ AI chat conversations</li>
                  <li>✅ Tank monitoring activities</li>
                  <li>✅ Form submissions & onboarding</li>
                  <li>✅ Performance metrics</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-yellow-800 mb-3">Data Analytics:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>📊 Session duration tracking</li>
                  <li>📊 Device & browser fingerprinting</li>
                  <li>📊 Geographic location data</li>
                  <li>📊 User behavior patterns</li>
                  <li>📊 Feature usage statistics</li>
                  <li>📊 Exportable data reports</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-700">
                <strong>🎯 For Judges:</strong> This analytics system demonstrates enterprise-level data collection 
                capabilities that would be essential for a production water management platform. All visitor 
                interactions are tracked in real-time, providing valuable insights for business intelligence 
                and user experience optimization.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
};

export default Analytics;
