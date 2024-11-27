export interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  // Marked as optional since it's iOS only
  batteryInfo?: {
    level: number;
    isLowPowerMode?: boolean;
    isCharging?: boolean;
  };
  timestamp: number;
}

export interface PerformanceThresholds {
  fps?: number;
  memoryPercentage?: number;
  batteryLevel?: number;
}

export interface PerformanceConfig {
  thresholds?: PerformanceThresholds;
  sampleRate?: number; // ms between checks
  enableBatteryMonitoring?: boolean; // iOS only
  adaptiveMonitoring?: boolean; // Adjusts sample rate based on performance
}
