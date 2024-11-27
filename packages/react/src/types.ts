export interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  // Web-specific metrics
  pageLoadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  // optional, not all browsers support it
  batteryInfo?: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  };
  timestamp: number;
}

export interface PerformanceThresholds {
  fps?: number;
  memoryPercentage?: number;
  pageLoadTime?: number;
  timeToInteractive?: number;
  batteryLevel?: number;
}

export interface PerformanceConfig {
  thresholds?: PerformanceThresholds;
  //ms between checks
  sampleRate?: number;
  enableBatteryMonitoring?: boolean;
  enableWebVitals?: boolean;
  adaptiveMonitoring?: boolean;
}

export type BatteryManager = {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
};

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }
}
