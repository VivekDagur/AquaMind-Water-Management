import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  Filter,
  Search,
  TrendingUp,
  Wrench,
  X,
  Bell,
  Archive
} from 'lucide-react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { mockAlerts, type Alert } from '@/utils/mockData';
import { getSensorInstance } from '@/utils/sensors';
import { useToast } from '@/hooks/use-toast';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<Alert['severity'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('active');
  const { toast } = useToast();

  // Listen for new alerts from sensor simulation
  useEffect(() => {
    try {
      const sensorInstance = getSensorInstance();
      
      const unsubscribe = sensorInstance.onAlert((newAlert) => {
        setAlerts(prev => [newAlert, ...prev]);
      });

      return unsubscribe;
    } catch (error) {
      // Sensor not initialized yet, that's okay
    }
  }, []);

  // Filter alerts based on search and filters
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.tank_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && !alert.resolved) ||
                         (filterStatus === 'resolved' && alert.resolved);
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Alert statistics
  const alertStats = {
    total: alerts.length,
    active: alerts.filter(a => !a.resolved).length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
    resolved: alerts.filter(a => a.resolved).length
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    
    toast({
      title: 'Alert Resolved',
      description: 'Alert has been marked as resolved.',
    });
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    toast({
      title: 'Alert Deleted',
      description: 'Alert has been removed from the system.',
    });
  };

  const getSeverityConfig = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'bg-destructive text-destructive-foreground',
          icon: AlertTriangle,
          textColor: 'text-destructive'
        };
      case 'high':
        return {
          color: 'bg-destructive text-destructive-foreground',
          icon: AlertTriangle,
          textColor: 'text-destructive'
        };
      case 'medium':
        return {
          color: 'bg-warning text-warning-foreground',
          icon: AlertTriangle,
          textColor: 'text-warning'
        };
      case 'low':
        return {
          color: 'bg-muted text-muted-foreground',
          icon: Clock,
          textColor: 'text-muted-foreground'
        };
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'level': return Droplets;
      case 'usage': return TrendingUp;
      case 'prediction': return Clock;
      case 'maintenance': return Wrench;
      default: return AlertTriangle;
    }
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold aqua-gradient bg-clip-text text-transparent">
              Alert Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage water system alerts and notifications
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="animate-pulse">
              <Bell className="w-3 h-3 mr-1" />
              {alertStats.active} Active
            </Badge>
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{alertStats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{alertStats.active}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{alertStats.critical}</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{alertStats.resolved}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search alerts by message or tank ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Severity Filter */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as Alert['severity'] | 'all')}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'resolved')}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="active">Active Alerts</option>
                <option value="resolved">Resolved Alerts</option>
                <option value="all">All Alerts</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Alerts ({filteredAlerts.length})
            </h2>
            {filteredAlerts.length > 0 && (
              <Button variant="outline" size="sm">
                <Archive className="w-4 h-4 mr-2" />
                Archive All Resolved
              </Button>
            )}
          </div>
          
          {filteredAlerts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No alerts found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterSeverity !== 'all' || filterStatus !== 'active' 
                    ? 'Try adjusting your filters or search terms.'
                    : 'All systems are running smoothly!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert, index) => {
                const severityConfig = getSeverityConfig(alert.severity);
                const TypeIcon = getTypeIcon(alert.type);
                const SeverityIcon = severityConfig.icon;
                
                return (
                  <Card 
                    key={alert.id} 
                    className={`transition-all duration-300 hover:shadow-md animate-slide-up ${
                      alert.resolved ? 'opacity-70' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between space-x-4">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            alert.resolved ? 'bg-success/10' : 'bg-muted'
                          }`}>
                            {alert.resolved ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <TypeIcon className={`w-5 h-5 ${severityConfig.textColor}`} />
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge className={severityConfig.color}>
                                <SeverityIcon className="w-3 h-3 mr-1" />
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {alert.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Tank: {alert.tank_id}
                              </span>
                            </div>
                            
                            <p className={`font-medium ${alert.resolved ? 'line-through text-muted-foreground' : ''}`}>
                              {alert.message}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                              {alert.resolved && (
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Resolved
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          {!alert.resolved ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id)}
                              className="text-success border-success hover:bg-success/10"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Resolve
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default Alerts;