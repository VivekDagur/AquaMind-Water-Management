import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  Smartphone, 
  Monitor,
  TrendingUp,
  Activity,
  MousePointer,
  MessageSquare,
  BarChart3,
  Download,
  Droplets
} from 'lucide-react';
import { getDemoAnalytics, trackDemoInteraction } from '@/utils/analytics';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const updateAnalytics = () => {
      const data = getDemoAnalytics();
      setAnalytics(data);
    };

    updateAnalytics();
    const interval = setInterval(updateAnalytics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleExportData = () => {
    trackDemoInteraction('export_analytics');
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `aquamind-analytics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!analytics) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse" />
            <p>Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sessionDurationMinutes = Math.floor(analytics.session_duration / (1000 * 60));
  const sessionDurationSeconds = Math.floor((analytics.session_duration % (1000 * 60)) / 1000);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Live Analytics Header */}
      <Alert className="border-green-200 bg-green-50">
        <Activity className={`h-4 w-4 text-green-600 ${isLive ? 'animate-pulse' : ''}`} />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <span>
              <strong>🔴 LIVE Analytics Dashboard</strong> - Real-time visitor tracking for hackathon demo
            </span>
            <Badge className="bg-green-100 text-green-800">
              {isLive ? 'LIVE' : 'OFFLINE'}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Session Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Session Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sessionDurationMinutes}m {sessionDurationSeconds}s
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Started: {new Date(analytics.session_start).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-green-500" />
              Total Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analytics.total_events}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              User engagement events
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Monitor className="w-4 h-4 text-purple-500" />
              Device Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-600">
              {analytics.user_info.viewport_size}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {analytics.user_info.platform}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-yellow-500" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-yellow-600">
              {analytics.user_info.timezone.split('/')[1] || 'Unknown'}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {analytics.user_info.language}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Event Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Event Types Breakdown
            </CardTitle>
            <CardDescription>
              Distribution of user interactions during this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.events_by_type).map(([type, count]: [string, any]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {type === 'tank_event' && <Droplets className="w-4 h-4 text-blue-500" />}
                    {type === 'chat_event' && <MessageSquare className="w-4 h-4 text-green-500" />}
                    {type === 'demo_interaction' && <MousePointer className="w-4 h-4 text-purple-500" />}
                    <span className="text-sm font-medium capitalize">
                      {type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{count}</Badge>
                    <div className="w-20">
                      <Progress 
                        value={(count / analytics.total_events) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Last 10 user interactions in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analytics.recent_events.slice().reverse().map((event: any, index: number) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{event.action || event.type}</div>
                    <div className="text-gray-600">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                    {event.message && (
                      <div className="text-gray-500 truncate">
                        {event.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Details for Judges */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Hackathon Judge Analytics
          </CardTitle>
          <CardDescription className="text-blue-600">
            Real-time visitor tracking and behavior analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">Visitor Information:</h4>
              <div className="text-sm space-y-1">
                <div><strong>Browser:</strong> {analytics.user_info.user_agent.split(' ')[0]}</div>
                <div><strong>Screen:</strong> {analytics.user_info.screen_resolution}</div>
                <div><strong>Viewport:</strong> {analytics.user_info.viewport_size}</div>
                <div><strong>Platform:</strong> {analytics.user_info.platform}</div>
                <div><strong>Language:</strong> {analytics.user_info.language}</div>
                <div><strong>Timezone:</strong> {analytics.user_info.timezone}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">Data Collection:</h4>
              <div className="text-sm space-y-1">
                <div>✅ Real-time event tracking</div>
                <div>✅ User interaction logging</div>
                <div>✅ Session duration monitoring</div>
                <div>✅ Device fingerprinting</div>
                <div>✅ Performance metrics</div>
                <div>✅ Geographic data (timezone)</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={handleExportData}
              variant="outline" 
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Analytics Data
            </Button>
            <Button 
              onClick={() => setIsLive(!isLive)}
              variant="outline" 
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <Activity className="w-4 h-4 mr-2" />
              {isLive ? 'Pause' : 'Resume'} Live Tracking
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Storage Information */}
      <Alert>
        <Globe className="h-4 w-4" />
        <AlertDescription>
          <strong>Where is this data stored?</strong><br/>
          • <strong>Google Analytics 4:</strong> Visitor behavior, page views, events (cloud-based)<br/>
          • <strong>Local Storage:</strong> Demo interactions, session data (browser-based)<br/>
          • <strong>MongoDB Atlas:</strong> User accounts, tank data, chat history (cloud database)<br/>
          • <strong>Railway/Netlify:</strong> Application logs, deployment metrics (hosting platforms)<br/>
          • <strong>Real-time:</strong> All interactions are tracked live during this demo session
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AnalyticsDashboard;
