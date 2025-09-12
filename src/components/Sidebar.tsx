import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  AlertTriangle, 
  Settings,
  Droplets,
  Users,
  TrendingUp,
  Shield,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = true, 
  onClose,
  className = ""
}) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      section: 'Main',
      items: [
        { to: '/dashboard', icon: Home, label: 'Dashboard', description: 'Overview & KPIs' },
        { to: '/reports', icon: BarChart3, label: 'Reports', description: 'Analytics & Data' },
        { 
          to: '/alerts', 
          icon: AlertTriangle, 
          label: 'Alerts', 
          description: 'Notifications',
          badge: { text: '3', variant: 'destructive' as const }
        }
      ]
    },
    ...(user?.role === 'admin' ? [{
      section: 'Administration',
      items: [
        { to: '/admin', icon: Settings, label: 'Admin Panel', description: 'System Management' }
      ]
    }] : []),
    {
      section: 'Quick Stats',
      items: [
        { icon: Droplets, label: 'Active Tanks', value: '8', color: 'text-primary' },
        { icon: Users, label: 'Communities', value: '4', color: 'text-success' },
        { icon: TrendingUp, label: 'Efficiency', value: '92%', color: 'text-primary' },
        { icon: Shield, label: 'Alerts', value: '3', color: 'text-destructive' }
      ]
    }
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-border transition-transform duration-300",
        "md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Droplets className="h-8 w-8 text-primary" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-glow rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">AquaMind</h2>
            <p className="text-xs text-muted-foreground">Smart Water Monitoring</p>
          </div>
        </div>
        
        {/* Mobile close button */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigationItems.map((section) => (
          <div key={section.section}>
            <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.section}
            </h3>
            
            <div className="space-y-1">
              {section.items.map((item) => {
                if ('to' in item) {
                  // Navigation item
                  const isActive = location.pathname === item.to;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => onClose?.()} // Close mobile sidebar on navigation
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badge.variant} 
                              className="ml-2 h-5 px-1.5 text-xs"
                            >
                              {item.badge.text}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className={cn(
                            "text-xs truncate mt-0.5",
                            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                          )}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                } else {
                  // Stat item
                  const Icon = item.icon;
                  
                  return (
                    <div 
                      key={item.label}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-sidebar-accent/50"
                    >
                      <Icon className={cn("h-5 w-5", item.color)} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-sidebar-foreground">
                            {item.label}
                          </span>
                          <span className={cn("text-sm font-bold", item.color)}>
                            {item.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer intentionally minimal to match reference UI */}
    </aside>
  );
};