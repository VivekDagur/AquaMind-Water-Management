import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  Zap, 
  DollarSign, 
  Leaf,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import { demoKPIs, demoInsights, demoAnalytics } from './EnhancedDemoData';

interface HackathonDemoEnhancerProps {
  className?: string;
}

const HackathonDemoEnhancer: React.FC<HackathonDemoEnhancerProps> = ({ className }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedValues, setAnimatedValues] = useState({
    efficiency: 0,
    waterSaved: 0,
    costSavings: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animate values for demo effect
    const animationTimer = setTimeout(() => {
      setAnimatedValues({
        efficiency: demoKPIs.efficiency,
        waterSaved: demoKPIs.waterSaved,
        costSavings: demoKPIs.costSavings
      });
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(animationTimer);
    };
  }, []);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyBadgeColor = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-100 text-green-800';
    if (efficiency >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Real-time Demo Banner */}
      <Alert className="border-blue-200 bg-blue-50">
        <BarChart3 className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>🚀 Live Demo Mode Active</strong> - Showcasing real-time water management with AI-powered insights
          <span className="ml-4 text-sm">
            Last Updated: {currentTime.toLocaleTimeString()}
          </span>
        </AlertDescription>
      </Alert>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              System Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {animatedValues.efficiency}%
            </div>
            <Progress value={animatedValues.efficiency} className="mt-2" />
            <Badge className={`mt-2 ${getEfficiencyBadgeColor(animatedValues.efficiency)}`}>
              Excellent Performance
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-500" />
              Water Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {animatedValues.waterSaved.toLocaleString()}L
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15% this month
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">
              Environmental Impact
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-yellow-500" />
              Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${animatedValues.costSavings}
            </div>
            <div className="flex items-center text-sm text-yellow-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              22% ROI
            </div>
            <Badge className="mt-2 bg-yellow-100 text-yellow-800">
              Monthly Savings
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              AI Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {demoKPIs.predictedDaysRemaining} days
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Until next maintenance
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">
              ML Powered
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-500" />
            AI-Powered Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Machine learning analysis of your water usage patterns and optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {demoInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  insight.impact === 'High' ? 'bg-red-500' : 
                  insight.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {insight.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Target className="w-3 h-3 mr-1" />
                    Impact: {insight.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Real-time Usage Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Peak Usage Hours</span>
                <Badge variant="outline">Live Data</Badge>
              </div>
              {demoAnalytics.peakUsageHours.map((hour, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">{hour}</span>
                  <div className="flex items-center text-blue-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    High Activity
                  </div>
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Today's Consumption</span>
                  <span className="text-green-600 font-bold">
                    {demoAnalytics.averageDailyConsumption}L
                  </span>
                </div>
                <Progress value={75} className="mt-2" />
                <p className="text-xs text-green-600 mt-1">25% below target - Excellent!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Financial Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">Monthly Bill</div>
                  <div className="text-xl font-bold text-blue-600">
                    ${demoAnalytics.costAnalysis.monthlyBill}
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">Yearly Savings</div>
                  <div className="text-xl font-bold text-green-600">
                    ${demoAnalytics.costAnalysis.savingsFromOptimization}
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ROI from AquaMind</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {demoAnalytics.costAnalysis.roi}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Return on investment within 6 months
                </div>
              </div>

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Carbon Footprint Reduced:</strong> {demoKPIs.carbonFootprintReduced} kg CO2 equivalent this month
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Controls for Judges */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Hackathon Demo Controls
          </CardTitle>
          <CardDescription className="text-blue-600">
            Interactive features for judges to explore AquaMind's capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              <TrendingUp className="w-4 h-4 mr-2" />
              Simulate Water Crisis
            </Button>
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
              <Leaf className="w-4 h-4 mr-2" />
              Show Optimization Results
            </Button>
            <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
              <Zap className="w-4 h-4 mr-2" />
              AI Prediction Demo
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-800 mb-2">Key Demo Highlights:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Real-time IoT sensor data simulation</li>
              <li>• AI-powered predictive analytics</li>
              <li>• 30% water waste reduction achieved</li>
              <li>• $1,250+ annual cost savings demonstrated</li>
              <li>• Carbon footprint reduction tracking</li>
              <li>• Smart alert system with ML insights</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HackathonDemoEnhancer;
