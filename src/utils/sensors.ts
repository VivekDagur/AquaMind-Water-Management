import { Tank, Alert } from './mockData';

// Tank consumption simulation system
export class SensorSimulation {
  private tanks: Tank[] = [];
  private callbacks: ((tanks: Tank[]) => void)[] = [];
  private alertCallbacks: ((alert: Alert) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private readonly SIMULATION_INTERVAL = 5000; // 5 seconds
  private readonly HOURS_PER_INTERVAL = 0.1; // Simulate 6 minutes per 5-second interval

  constructor(initialTanks: Tank[]) {
    this.tanks = [...initialTanks];
  }

  // Start the sensor simulation
  start(): void {
    if (this.intervalId) return; // Already running

    this.intervalId = setInterval(() => {
      this.updateTankLevels();
      this.checkForAlerts();
      this.notifyCallbacks();
    }, this.SIMULATION_INTERVAL);

    console.log('🌊 AquaMind sensor simulation started');
  }

  // Stop the sensor simulation
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🛑 AquaMind sensor simulation stopped');
    }
  }

  // Subscribe to tank updates
  onTankUpdate(callback: (tanks: Tank[]) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  // Subscribe to alert updates
  onAlert(callback: (alert: Alert) => void): () => void {
    this.alertCallbacks.push(callback);
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  // Simulate tank refill (for admin actions)
  refillTank(tankId: string): void {
    const tank = this.tanks.find(t => t.tank_id === tankId);
    if (tank) {
      tank.current_liters = tank.capacity_liters;
      tank.last_refill_iso = new Date().toISOString();
      tank.status = 'healthy';
      
      // Create refill alert
      const refillAlert: Alert = {
        id: `alert-${Date.now()}`,
        tank_id: tankId,
        message: `${tank.name} has been successfully refilled to capacity`,
        severity: 'low',
        timestamp: new Date().toISOString(),
        type: 'maintenance',
        resolved: false
      };
      
      this.notifyAlertCallbacks(refillAlert);
      console.log(`🚰 Tank ${tank.name} refilled to capacity`);
    }
  }

  // Get current tank data
  getTanks(): Tank[] {
    return [...this.tanks];
  }

  // Update tank levels based on consumption rates
  private updateTankLevels(): void {
    this.tanks.forEach(tank => {
      if (tank.current_liters > 0) {
        // Calculate consumption for this interval
        const consumptionThisInterval = tank.avg_consumption_lph * this.HOURS_PER_INTERVAL;
        
        // Add realistic variance (±20%)
        const variance = 0.8 + Math.random() * 0.4;
        const actualConsumption = consumptionThisInterval * variance;
        
        // Update tank level
        tank.current_liters = Math.max(0, tank.current_liters - actualConsumption);
        
        // Update status based on current level
        const percentage = (tank.current_liters / tank.capacity_liters) * 100;
        
        if (percentage <= 5) {
          tank.status = 'critical';
        } else if (percentage <= 20) {
          tank.status = 'low';
        } else if (percentage >= 90) {
          tank.status = 'healthy';
        }
      }
    });
  }

  // Check for alert conditions and generate alerts
  private checkForAlerts(): void {
    this.tanks.forEach(tank => {
      const percentage = (tank.current_liters / tank.capacity_liters) * 100;
      const hoursToEmpty = tank.current_liters / tank.avg_consumption_lph;
      
      // Critical level alert (5% or less)
      if (percentage <= 5 && tank.current_liters > 0) {
        this.generateAlert(tank, 'critical', 
          `${tank.name} is critically low (${percentage.toFixed(1)}%) - immediate action required!`,
          'level'
        );
      }
      // Low level alert (20% or less)
      else if (percentage <= 20 && percentage > 5) {
        this.generateAlert(tank, 'high',
          `${tank.name} is running low (${percentage.toFixed(1)}%) - refill recommended`,
          'level'
        );
      }
      // Predictive alerts (time-based warnings)
      else if (hoursToEmpty <= 3 && hoursToEmpty > 0) {
        this.generateAlert(tank, 'critical',
          `${tank.name} predicted to be empty in ${hoursToEmpty.toFixed(1)} hours`,
          'prediction'
        );
      }
      else if (hoursToEmpty <= 12 && hoursToEmpty > 3) {
        this.generateAlert(tank, 'high',
          `${tank.name} predicted to be empty in ${hoursToEmpty.toFixed(1)} hours`,
          'prediction'
        );
      }
      else if (hoursToEmpty <= 24 && hoursToEmpty > 12) {
        this.generateAlert(tank, 'medium',
          `${tank.name} predicted to be empty in ${hoursToEmpty.toFixed(1)} hours - plan refill`,
          'prediction'
        );
      }
      
      // Anomaly detection: unusual consumption spikes
      const expectedConsumption = tank.avg_consumption_lph * this.HOURS_PER_INTERVAL;
      const actualConsumption = expectedConsumption * (Math.random() > 0.95 ? 3 : 1); // 5% chance of spike
      
      if (actualConsumption > expectedConsumption * 2) {
        this.generateAlert(tank, 'medium',
          `${tank.name} showing unusual consumption spike - possible leak detected`,
          'usage'
        );
      }
    });
  }

  // Generate and notify alert
  private generateAlert(
    tank: Tank, 
    severity: Alert['severity'], 
    message: string, 
    type: Alert['type']
  ): void {
    // Prevent spam by checking if similar alert was recently generated
    const recentAlertKey = `${tank.tank_id}-${type}-${severity}`;
    const lastAlertTime = localStorage.getItem(`lastAlert-${recentAlertKey}`);
    const now = Date.now();
    
    if (lastAlertTime && now - parseInt(lastAlertTime) < 60000) { // 1 minute cooldown
      return;
    }
    
    localStorage.setItem(`lastAlert-${recentAlertKey}`, now.toString());
    
    const alert: Alert = {
      id: `alert-${now}`,
      tank_id: tank.tank_id,
      message,
      severity,
      timestamp: new Date().toISOString(),
      type,
      resolved: false
    };
    
    this.notifyAlertCallbacks(alert);
  }

  // Notify all tank update callbacks
  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => callback([...this.tanks]));
  }

  // Notify all alert callbacks
  private notifyAlertCallbacks(alert: Alert): void {
    this.alertCallbacks.forEach(callback => callback(alert));
  }
}

// Global sensor simulation instance
let sensorInstance: SensorSimulation | null = null;

export const getSensorInstance = (tanks?: Tank[]): SensorSimulation => {
  if (!sensorInstance && tanks) {
    sensorInstance = new SensorSimulation(tanks);
  } else if (!sensorInstance) {
    throw new Error('Sensor simulation not initialized. Provide initial tanks data.');
  }
  return sensorInstance;
};

export const startSensorSimulation = (tanks: Tank[]): SensorSimulation => {
  const instance = getSensorInstance(tanks);
  instance.start();
  return instance;
};

export const stopSensorSimulation = (): void => {
  if (sensorInstance) {
    sensorInstance.stop();
  }
};