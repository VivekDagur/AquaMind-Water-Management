// Enhanced demo data for hackathon presentation
export const demoTanks = [
  {
    id: '1',
    name: 'Main Residential Tank',
    capacity_liters: 5000,
    current_liters: 3750,
    location: 'Rooftop - Building A',
    status: 'healthy',
    temperature: 22.5,
    ph_level: 7.2,
    turbidity: 0.8,
    last_cleaned: '2024-01-10',
    sensor_battery: 85,
    flow_rate: 12.5,
    pressure: 2.3,
    efficiency_score: 92
  },
  {
    id: '2',
    name: 'Backup Storage Tank',
    capacity_liters: 3000,
    current_liters: 450,
    location: 'Ground Level - East Wing',
    status: 'low',
    temperature: 21.8,
    ph_level: 7.0,
    turbidity: 1.2,
    last_cleaned: '2024-01-05',
    sensor_battery: 67,
    flow_rate: 8.2,
    pressure: 1.8,
    efficiency_score: 78
  },
  {
    id: '3',
    name: 'Emergency Reserve',
    capacity_liters: 2000,
    current_liters: 1900,
    location: 'Underground - North Side',
    status: 'healthy',
    temperature: 20.1,
    ph_level: 7.4,
    turbidity: 0.5,
    last_cleaned: '2024-01-15',
    sensor_battery: 94,
    flow_rate: 15.8,
    pressure: 2.7,
    efficiency_score: 96
  },
  {
    id: '4',
    name: 'Community Pool Tank',
    capacity_liters: 8000,
    current_liters: 6400,
    location: 'Recreation Center',
    status: 'healthy',
    temperature: 24.2,
    ph_level: 7.6,
    turbidity: 0.3,
    last_cleaned: '2024-01-12',
    sensor_battery: 91,
    flow_rate: 22.1,
    pressure: 3.1,
    efficiency_score: 89
  }
];

export const demoKPIs = {
  totalCapacity: 18000,
  currentVolume: 12500,
  dailyUsage: 850,
  efficiency: 89,
  waterSaved: 2340,
  costSavings: 1250,
  alertsToday: 2,
  systemHealth: 94,
  predictedDaysRemaining: 14.7,
  carbonFootprintReduced: 45.2
};

export const demoAlerts = [
  {
    id: '1',
    type: 'warning',
    title: 'Low Water Level Detected',
    message: 'Backup Storage Tank is at 15% capacity. Consider refilling soon.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    tank: 'Backup Storage Tank',
    severity: 'medium',
    resolved: false
  },
  {
    id: '2',
    type: 'info',
    title: 'Maintenance Reminder',
    message: 'Main Residential Tank is due for scheduled cleaning in 3 days.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    tank: 'Main Residential Tank',
    severity: 'low',
    resolved: false
  },
  {
    id: '3',
    type: 'success',
    title: 'Efficiency Milestone Reached',
    message: 'Emergency Reserve has achieved 96% efficiency score - excellent performance!',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    tank: 'Emergency Reserve',
    severity: 'low',
    resolved: true
  },
  {
    id: '4',
    type: 'warning',
    title: 'Sensor Battery Low',
    message: 'Backup Storage Tank sensor battery at 67%. Replace within 2 weeks.',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    tank: 'Backup Storage Tank',
    severity: 'medium',
    resolved: false
  }
];

export const demoUsageData = [
  { month: 'Jan', usage: 2400, target: 2800, efficiency: 85 },
  { month: 'Feb', usage: 2100, target: 2600, efficiency: 88 },
  { month: 'Mar', usage: 2300, target: 2700, efficiency: 87 },
  { month: 'Apr', usage: 2000, target: 2500, efficiency: 91 },
  { month: 'May', usage: 1850, target: 2400, efficiency: 93 },
  { month: 'Jun', usage: 1900, target: 2300, efficiency: 92 },
  { month: 'Jul', usage: 1750, target: 2200, efficiency: 95 },
  { month: 'Aug', usage: 1800, target: 2100, efficiency: 94 },
  { month: 'Sep', usage: 1650, target: 2000, efficiency: 96 },
  { month: 'Oct', usage: 1700, target: 1950, efficiency: 95 },
  { month: 'Nov', usage: 1600, target: 1900, efficiency: 97 },
  { month: 'Dec', usage: 1550, target: 1850, efficiency: 98 }
];

export const demoAnalytics = {
  peakUsageHours: ['6:00-8:00 AM', '6:00-9:00 PM'],
  averageDailyConsumption: 850,
  weeklyTrends: {
    monday: 920,
    tuesday: 880,
    wednesday: 850,
    thursday: 840,
    friday: 900,
    saturday: 780,
    sunday: 750
  },
  seasonalPatterns: {
    spring: { usage: 2100, efficiency: 89 },
    summer: { usage: 1800, efficiency: 94 },
    fall: { usage: 1650, efficiency: 96 },
    winter: { usage: 2200, efficiency: 87 }
  },
  costAnalysis: {
    monthlyBill: 145,
    yearlyProjection: 1740,
    savingsFromOptimization: 380,
    roi: '22%'
  }
};

export const demoInsights = [
  {
    title: 'Water Usage Optimization',
    description: 'Your system has reduced water waste by 30% compared to last year through smart monitoring and predictive analytics.',
    impact: 'High',
    category: 'Efficiency'
  },
  {
    title: 'Predictive Maintenance',
    description: 'AI analysis suggests cleaning Main Residential Tank 2 days earlier than scheduled for optimal performance.',
    impact: 'Medium',
    category: 'Maintenance'
  },
  {
    title: 'Cost Savings Opportunity',
    description: 'Adjusting usage patterns during peak hours could save an additional $45/month on utility bills.',
    impact: 'Medium',
    category: 'Financial'
  },
  {
    title: 'Environmental Impact',
    description: 'Your water conservation efforts have reduced carbon footprint by 45.2 kg CO2 equivalent this month.',
    impact: 'High',
    category: 'Environmental'
  }
];
