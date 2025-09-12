import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsumptionData } from '@/utils/mockData';

interface WaterChartProps {
  data: ConsumptionData[];
  title?: string;
  className?: string;
  height?: number;
}

// Custom tooltip component for water data
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload as { percentage: number; liters: number } | undefined;
    if (data) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground mb-1">
            {new Date(label).toLocaleString()}
          </p>
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">
              Level: {data.percentage}% ({data.liters.toLocaleString()} L)
            </p>
          </div>
        </div>
      );
    }
  }
  return null;
};

export const WaterChart: React.FC<WaterChartProps> = ({ 
  data, 
  title = "Water Level Trend", 
  className = "",
  height = 300 
}) => {
  // Format data for chart
  const chartData = data.map(item => ({
    ...item,
    time: new Date(item.timestamp).getHours() + ':' + 
          String(new Date(item.timestamp).getMinutes()).padStart(2, '0'),
    fullTime: item.timestamp
  }));

  return (
    <Card className={`animate-fade-in ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-30" 
                stroke="hsl(var(--border))"
              />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                label={{ 
                  value: 'Level (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ 
                  fill: 'hsl(var(--primary))', 
                  strokeWidth: 2, 
                  r: 4 
                }}
                activeDot={{ 
                  r: 6, 
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};