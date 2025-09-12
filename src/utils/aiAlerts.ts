import { Tank, Alert } from './mockData';

// AI-powered alert and prediction system
export class AquaMindAI {
  private predictionHistory: Map<string, number[]> = new Map();
  
  /**
   * Predict time to empty using linear regression on consumption trends
   * Uses last 24 data points for trend analysis
   */
  predictTimeToEmpty(tank: Tank, historicalConsumption: number[]): {
    hoursToEmpty: number;
    confidence: number;
    trend: 'stable' | 'increasing' | 'decreasing';
  } {
    if (historicalConsumption.length < 5) {
      return {
        hoursToEmpty: tank.current_liters / tank.avg_consumption_lph,
        confidence: 0.3,
        trend: 'stable'
      };
    }
    
    // Calculate trend using simple linear regression
    const n = historicalConsumption.length;
    const xSum = (n * (n - 1)) / 2;
    const ySum = historicalConsumption.reduce((sum, val) => sum + val, 0);
    const xySum = historicalConsumption.reduce((sum, val, idx) => sum + val * idx, 0);
    const xxSum = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;
    
    // Predict when tank will be empty
    const currentRate = Math.abs(slope);
    const adjustedRate = currentRate > 0 ? currentRate : tank.avg_consumption_lph;
    
    const hoursToEmpty = tank.current_liters / adjustedRate;
    
    // Calculate confidence based on trend consistency
    const variance = historicalConsumption.reduce((sum, val, idx) => {
      const predicted = intercept + slope * idx;
      return sum + Math.pow(val - predicted, 2);
    }, 0) / n;
    
    const confidence = Math.max(0.1, 1 - (variance / (ySum / n)));
    
    // Determine trend direction
    let trend: 'stable' | 'increasing' | 'decreasing' = 'stable';
    if (Math.abs(slope) > 0.1) {
      trend = slope > 0 ? 'increasing' : 'decreasing';
    }
    
    return {
      hoursToEmpty: Math.max(0, hoursToEmpty),
      confidence: Math.min(1, confidence),
      trend
    };
  }

  /**
   * Detect anomalies in water consumption patterns
   * Uses Z-score method for outlier detection
   */
  detectAnomalies(tank: Tank, recentConsumption: number[]): {
    isAnomaly: boolean;
    severity: 'low' | 'medium' | 'high';
    description: string;
    confidence: number;
  } {
    if (recentConsumption.length < 10) {
      return {
        isAnomaly: false,
        severity: 'low',
        description: 'Insufficient data for anomaly detection',
        confidence: 0
      };
    }
    
    // Calculate mean and standard deviation
    const mean = recentConsumption.reduce((sum, val) => sum + val, 0) / recentConsumption.length;
    const variance = recentConsumption.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recentConsumption.length;
    const stdDev = Math.sqrt(variance);
    
    // Check latest consumption against historical patterns
    const latestConsumption = recentConsumption[recentConsumption.length - 1];
    const zScore = Math.abs((latestConsumption - mean) / stdDev);
    
    let isAnomaly = false;
    let severity: 'low' | 'medium' | 'high' = 'low';
    let description = '';
    
    if (zScore > 2.5) {
      isAnomaly = true;
      severity = 'high';
      description = latestConsumption > mean 
        ? 'Significant consumption spike detected - possible leak or unusual usage'
        : 'Consumption drop detected - possible blockage or reduced usage';
    } else if (zScore > 1.5) {
      isAnomaly = true;
      severity = 'medium';
      description = latestConsumption > mean
        ? 'Elevated consumption detected - monitor for continued trend'
        : 'Reduced consumption detected - verify normal operation';
    }
    
    return {
      isAnomaly,
      severity,
      description,
      confidence: Math.min(1, zScore / 3)
    };
  }

  /**
   * Generate AI-powered recommendations for water management
   */
  generateRecommendations(tanks: Tank[]): {
    tip: string;
    priority: 'low' | 'medium' | 'high';
    tankIds: string[];
    estimatedSavings?: string;
  }[] {
    const recommendations: {
      tip: string;
      priority: 'low' | 'medium' | 'high';
      tankIds: string[];
      estimatedSavings?: string;
    }[] = [];
    
    // Analyze each tank for optimization opportunities
    tanks.forEach(tank => {
      const utilizationRate = (tank.current_liters / tank.capacity_liters) * 100;
      const dailyConsumption = tank.avg_consumption_lph * 24;
      
      // High consumption optimization
      if (tank.avg_consumption_lph > 50) {
        recommendations.push({
          tip: `${tank.name} has high consumption rate. Consider implementing water-saving measures or leak detection.`,
          priority: 'high',
          tankIds: [tank.tank_id],
          estimatedSavings: '15-25% reduction possible'
        });
      }
      
      // Low utilization recommendations
      if (utilizationRate > 90 && tank.status === 'healthy') {
        recommendations.push({
          tip: `${tank.name} maintains excellent water levels. Consider this as a model for other tanks.`,
          priority: 'low',
          tankIds: [tank.tank_id]
        });
      }
      
      // Maintenance scheduling
      const daysSinceRefill = Math.floor(
        (Date.now() - new Date(tank.last_refill_iso).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceRefill > 30) {
        recommendations.push({
          tip: `${tank.name} hasn't been refilled in ${daysSinceRefill} days. Schedule maintenance inspection.`,
          priority: 'medium',
          tankIds: [tank.tank_id]
        });
      }
    });
    
    // Community vs individual tank analysis
    const communityTanks = tanks.filter(t => t.is_community);
    const personalTanks = tanks.filter(t => !t.is_community);
    
    if (communityTanks.length > 0 && personalTanks.length > 0) {
      const avgCommunityEfficiency = communityTanks.reduce((sum, t) => 
        sum + (t.current_liters / t.capacity_liters), 0) / communityTanks.length;
      const avgPersonalEfficiency = personalTanks.reduce((sum, t) => 
        sum + (t.current_liters / t.capacity_liters), 0) / personalTanks.length;
      
      if (avgCommunityEfficiency > avgPersonalEfficiency + 0.2) {
        recommendations.push({
          tip: 'Community tanks show better efficiency. Consider community water management workshops.',
          priority: 'medium',
          tankIds: communityTanks.map(t => t.tank_id)
        });
      }
    }
    
    // Critical tanks requiring immediate attention
    const criticalTanks = tanks.filter(t => t.status === 'critical');
    if (criticalTanks.length > 0) {
      recommendations.push({
        tip: `${criticalTanks.length} tank(s) in critical status. Immediate refill required to prevent outage.`,
        priority: 'high',
        tankIds: criticalTanks.map(t => t.tank_id)
      });
    }
    
    // Seasonal and time-based recommendations
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour <= 10) {
      recommendations.push({
        tip: 'Morning peak hours detected. Consider staggering non-essential water usage to optimize distribution.',
        priority: 'low',
        tankIds: tanks.map(t => t.tank_id),
        estimatedSavings: '10-15% efficiency gain'
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Process natural language queries about tank data
   * This is a simplified version - in production would use LLM API
   */
  processNaturalLanguageQuery(query: string, tanks: Tank[]): {
    answer: string;
    data?: unknown;
    chartType?: 'bar' | 'line' | 'pie';
  } {
    const lowerQuery = query.toLowerCase();
    
    // Tank level queries
    if (lowerQuery.includes('level') || lowerQuery.includes('full')) {
      const tankLevels = tanks.map(t => ({
        name: t.name,
        level: Math.round((t.current_liters / t.capacity_liters) * 100)
      })).sort((a, b) => b.level - a.level);
      
      return {
        answer: `Current tank levels: ${tankLevels.map(t => `${t.name} (${t.level}%)`).join(', ')}`,
        data: tankLevels,
        chartType: 'bar'
      };
    }
    
    // Consumption queries
    if (lowerQuery.includes('consumption') || lowerQuery.includes('usage')) {
      const totalConsumption = tanks.reduce((sum, t) => sum + t.avg_consumption_lph * 24, 0);
      const topConsumer = tanks.reduce((max, t) => 
        t.avg_consumption_lph > max.avg_consumption_lph ? t : max);
      
      return {
        answer: `Total daily consumption: ${totalConsumption.toFixed(1)} liters. Highest consumer: ${topConsumer.name} (${(topConsumer.avg_consumption_lph * 24).toFixed(1)} L/day)`,
        data: tanks.map(t => ({ name: t.name, consumption: t.avg_consumption_lph * 24 })),
        chartType: 'bar'
      };
    }
    
    // Status queries
    if (lowerQuery.includes('status') || lowerQuery.includes('health')) {
      const statusCounts = tanks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        answer: `Tank status summary: ${Object.entries(statusCounts).map(([status, count]) => 
          `${count} ${status}`).join(', ')}`,
        data: Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count })),
        chartType: 'pie'
      };
    }
    
    // Community vs personal queries
    if (lowerQuery.includes('community') || lowerQuery.includes('personal')) {
      const communityTanks = tanks.filter(t => t.is_community);
      const personalTanks = tanks.filter(t => !t.is_community);
      
      return {
        answer: `${communityTanks.length} community tanks, ${personalTanks.length} personal tanks. Community capacity: ${communityTanks.reduce((sum, t) => sum + t.capacity_liters, 0).toLocaleString()} L`,
        data: [
          { name: 'Community', value: communityTanks.length },
          { name: 'Personal', value: personalTanks.length }
        ],
        chartType: 'pie'
      };
    }
    
    // Default response
    return {
      answer: `I can help you with questions about tank levels, consumption, status, and community vs personal tank comparisons. Try asking "What are the current tank levels?" or "Which tank uses the most water?"`
    };
  }
}

// Singleton instance
let aiInstance: AquaMindAI | null = null;

export const getAquaMindAI = (): AquaMindAI => {
  if (!aiInstance) {
    aiInstance = new AquaMindAI();
  }
  return aiInstance;
};

/*
 * OPTIONAL: Integration with OpenAI GPT for natural language processing
 * Uncomment and configure if you want to use actual AI services
 */

/*
export const processQueryWithGPT = async (query: string, tankData: Tank[]): Promise<string> => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  
  const prompt = `
    You are AquaMind AI, an intelligent water tank management assistant. 
    
    Current tank data:
    ${JSON.stringify(tankData, null, 2)}
    
    User question: ${query}
    
    Provide a helpful, concise answer about the water tank system. Focus on actionable insights.
  `;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are AquaMind AI, a water management expert. Be concise and actionable.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });
    
    const data = await response.json();
    return data.choices[0]?.message?.content || 'Unable to process query at this time.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'AI service temporarily unavailable. Please try again later.';
  }
};
*/