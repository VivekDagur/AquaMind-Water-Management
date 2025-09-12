import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplets, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Tank } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface TankCardProps {
  tank: Tank;
  onRefill?: (tankId: string) => void;
  className?: string;
}

export const TankCard: React.FC<TankCardProps> = ({ 
  tank, 
  onRefill,
  className = ""
}) => {
  const percentage = (tank.current_liters / tank.capacity_liters) * 100;
  
  // Status colors and icons
  const getStatusConfig = (status: Tank['status']) => {
    switch (status) {
      case 'critical':
        return {
          color: 'bg-destructive text-destructive-foreground',
          icon: XCircle,
          textColor: 'text-destructive'
        };
      case 'low':
        return {
          color: 'bg-warning text-warning-foreground',
          icon: AlertTriangle,
          textColor: 'text-warning'
        };
      case 'healthy':
        return {
          color: 'bg-success text-success-foreground',
          icon: CheckCircle,
          textColor: 'text-success'
        };
      case 'maintenance':
        return {
          color: 'bg-secondary text-secondary-foreground',
          icon: AlertTriangle,
          textColor: 'text-muted-foreground'
        };
    }
  };

  const statusConfig = getStatusConfig(tank.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
      "border-l-4",
      tank.status === 'critical' ? "border-l-destructive" :
      tank.status === 'low' ? "border-l-warning" :
      tank.status === 'healthy' ? "border-l-success" : "border-l-muted",
      className
    )}>
      {/* Animated water level indicator */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-primary/10 transition-all duration-1000 ease-out"
        style={{ height: `${Math.max(2, percentage)}%` }}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
          style={{
            background: `linear-gradient(to top, 
              hsl(var(--primary) / 0.2) 0%, 
              hsl(var(--primary) / 0.1) 50%, 
              transparent 100%)`
          }}
        />
      </div>

      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {tank.is_community ? (
                <Users className="w-5 h-5 text-primary" />
              ) : (
                <Droplets className="w-5 h-5 text-primary" />
              )}
              {tank.name}
            </CardTitle>
            {tank.owner && (
              <p className="text-sm text-muted-foreground mt-1">
                Owner: {tank.owner}
              </p>
            )}
            {tank.location && (
              <p className="text-xs text-muted-foreground">
                📍 {tank.location}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={statusConfig.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {tank.status}
            </Badge>
            {tank.is_community && (
              <Badge variant="outline" className="text-xs">
                Community
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {/* Water level progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Water Level</span>
            <span className={cn(
              "font-semibold",
              percentage <= 20 ? "text-destructive" :
              percentage <= 40 ? "text-warning" : "text-success"
            )}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000 ease-out rounded-full",
                percentage <= 20 ? "bg-destructive" :
                percentage <= 40 ? "bg-warning" : "bg-primary"
              )}
              style={{ width: `${Math.max(2, percentage)}%` }}
            />
          </div>
        </div>

        {/* Tank metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Current</p>
            <p className="font-semibold">
              {tank.current_liters.toLocaleString()} L
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Capacity</p>
            <p className="font-semibold">
              {tank.capacity_liters.toLocaleString()} L
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Daily Usage</p>
            <p className="font-semibold">
              {Math.round(tank.avg_consumption_lph * 24)} L
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Refill</p>
            <p className="font-semibold">
              {new Date(tank.last_refill_iso).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Time to empty prediction */}
        {tank.current_liters > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Est. time to empty: {' '}
              <span className={cn(
                "font-medium",
                statusConfig.textColor
              )}>
                {Math.round(tank.current_liters / tank.avg_consumption_lph)} hours
              </span>
            </p>
          </div>
        )}

        {/* Action button */}
        {onRefill && (tank.status === 'critical' || tank.status === 'low') && (
          <Button 
            onClick={() => onRefill(tank.tank_id)}
            className="w-full mt-4 aqua-gradient text-white hover:opacity-90"
            size="sm"
          >
            <Droplets className="w-4 h-4 mr-2" />
            Refill Tank
          </Button>
        )}
      </CardContent>
    </Card>
  );
};