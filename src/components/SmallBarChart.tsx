import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface SimplePoint {
  label: string;
  value: number;
}

interface SmallBarChartProps {
  data: SimplePoint[];
  title: string;
  height?: number;
  className?: string;
}

const SmallBarChart: React.FC<SmallBarChartProps> = ({
  data,
  title,
  height = 260,
  className,
}) => {
  const safeData =
    data && data.length > 0 ? data : [{ label: "No Data", value: 0 }];

  // normalized compact card styling will be applied by parent container

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent style={{ height: `${height}px` }} className="pt-0">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={safeData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="value" name="Usage" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SmallBarChart;
