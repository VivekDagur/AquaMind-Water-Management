// Mock data for AquaMind water tank monitoring system

export interface Tank {
  tank_id: string;
  name: string;
  owner: string | null; // null for community tanks
  capacity_liters: number;
  current_liters: number;
  last_refill_iso: string;
  avg_consumption_lph: number; // liters per hour
  is_community: boolean;
  location?: string;
  status: 'healthy' | 'low' | 'critical' | 'maintenance';
}

export interface Alert {
  id: string;
  tank_id: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  type: 'usage' | 'level' | 'maintenance' | 'prediction';
  resolved: boolean;
}

export interface ConsumptionData {
  timestamp: string;
  tank_id: string;
  liters: number;
  percentage: number;
}

// Mock tanks data (5-8 tanks as requested)
export const mockTanks: Tank[] = [
  {
    tank_id: 'tank-001',
    name: 'Main Residential Tank',
    owner: 'Smith Family',
    capacity_liters: 5000,
    current_liters: 4200,
    last_refill_iso: '2024-08-30T08:30:00Z',
    avg_consumption_lph: 12.5,
    is_community: false,
    location: '123 Oak Street',
    status: 'healthy'
  },
  {
    tank_id: 'tank-002',
    name: 'Community Tank Alpha',
    owner: null,
    capacity_liters: 15000,
    current_liters: 8500,
    last_refill_iso: '2024-08-28T06:00:00Z',
    avg_consumption_lph: 45.8,
    is_community: true,
    location: 'Riverside Community Center',
    status: 'low'
  },
  {
    tank_id: 'tank-003',
    name: 'Johnson Residence',
    owner: 'Johnson Family',
    capacity_liters: 3500,
    current_liters: 2800,
    last_refill_iso: '2024-09-01T14:20:00Z',
    avg_consumption_lph: 8.2,
    is_community: false,
    location: '456 Pine Avenue',
    status: 'healthy'
  },
  {
    tank_id: 'tank-004',
    name: 'Community Tank Beta',
    owner: null,
    capacity_liters: 20000,
    current_liters: 3200,
    last_refill_iso: '2024-08-25T09:15:00Z',
    avg_consumption_lph: 52.3,
    is_community: true,
    location: 'Downtown District',
    status: 'critical'
  },
  {
    tank_id: 'tank-005',
    name: 'Garcia Family Tank',
    owner: 'Garcia Family',
    capacity_liters: 4000,
    current_liters: 1200,
    last_refill_iso: '2024-08-29T11:45:00Z',
    avg_consumption_lph: 15.7,
    is_community: false,
    location: '789 Maple Drive',
    status: 'low'
  },
  {
    tank_id: 'tank-006',
    name: 'School District Tank',
    owner: null,
    capacity_liters: 12000,
    current_liters: 9600,
    last_refill_iso: '2024-09-01T07:30:00Z',
    avg_consumption_lph: 28.4,
    is_community: true,
    location: 'Central Elementary School',
    status: 'healthy'
  },
  {
    tank_id: 'tank-007',
    name: 'Brown Household',
    owner: 'Brown Family',
    capacity_liters: 2800,
    current_liters: 2450,
    last_refill_iso: '2024-08-31T16:00:00Z',
    avg_consumption_lph: 6.8,
    is_community: false,
    location: '321 Cedar Lane',
    status: 'healthy'
  },
  {
    tank_id: 'tank-008',
    name: 'Industrial Complex Tank',
    owner: null,
    capacity_liters: 25000,
    current_liters: 18750,
    last_refill_iso: '2024-08-27T05:45:00Z',
    avg_consumption_lph: 67.2,
    is_community: true,
    location: 'North Industrial Park',
    status: 'healthy'
  }
];

// Generate historical consumption data for charts
export const generateHistoricalData = (tank: Tank, hoursBack: number = 48): ConsumptionData[] => {
  const data: ConsumptionData[] = [];
  const now = new Date();
  
  for (let i = hoursBack; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseConsumption = tank.current_liters + (i * tank.avg_consumption_lph);
    
    // Add some realistic variance (±10%)
    const variance = 0.9 + Math.random() * 0.2;
    const liters = Math.min(Math.max(baseConsumption * variance, 0), tank.capacity_liters);
    
    data.push({
      timestamp: timestamp.toISOString(),
      tank_id: tank.tank_id,
      liters: Math.round(liters),
      percentage: Math.round((liters / tank.capacity_liters) * 100)
    });
  }
  
  return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Mock alerts data
export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    tank_id: 'tank-004',
    message: 'Community Tank Beta critically low - immediate refill required',
    severity: 'critical',
    timestamp: '2024-09-02T08:15:00Z',
    type: 'level',
    resolved: false
  },
  {
    id: 'alert-002',
    tank_id: 'tank-005',
    message: 'Garcia Family Tank showing unusual consumption spike',
    severity: 'medium',
    timestamp: '2024-09-02T06:30:00Z',
    type: 'usage',
    resolved: false
  },
  {
    id: 'alert-003',
    tank_id: 'tank-002',
    message: 'Community Tank Alpha predicted to be empty in 18 hours',
    severity: 'high',
    timestamp: '2024-09-02T05:45:00Z',
    type: 'prediction',
    resolved: false
  },
  {
    id: 'alert-004',
    tank_id: 'tank-001',
    message: 'Main Residential Tank scheduled maintenance due',
    severity: 'low',
    timestamp: '2024-09-01T14:20:00Z',
    type: 'maintenance',
    resolved: true
  }
];

// Calculate KPIs
export const calculateKPIs = (tanks: Tank[]) => {
  const totalCapacity = tanks.reduce((sum, tank) => sum + tank.capacity_liters, 0);
  const totalCurrent = tanks.reduce((sum, tank) => sum + tank.current_liters, 0);
  const communityTanks = tanks.filter(tank => tank.is_community).length;
  const avgConsumption = tanks.reduce((sum, tank) => sum + tank.avg_consumption_lph, 0);
  
  // Calculate next refill ETA for the tank that needs it most urgently
  const criticalTank = tanks
    .filter(tank => tank.status === 'critical' || tank.status === 'low')
    .sort((a, b) => (a.current_liters / a.capacity_liters) - (b.current_liters / b.capacity_liters))[0];
  
  const nextRefillHours = criticalTank 
    ? Math.max(0, criticalTank.current_liters / criticalTank.avg_consumption_lph)
    : null;
  
  return {
    totalWaterStored: totalCurrent,
    totalCapacity,
    utilizationPercentage: Math.round((totalCurrent / totalCapacity) * 100),
    communityTanks,
    avgDailyConsumption: Math.round(avgConsumption * 24),
    nextRefillETA: nextRefillHours ? Math.round(nextRefillHours) : null,
    criticalTankCount: tanks.filter(tank => tank.status === 'critical').length,
    lowTankCount: tanks.filter(tank => tank.status === 'low').length
  };
};