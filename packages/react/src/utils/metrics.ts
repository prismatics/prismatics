import type { PerformanceMetrics, BatteryManager } from '../types';

const DEFAULT_METRICS: PerformanceMetrics = {
  fps: 0,
  memory: {
    used: 0,
    total: 0,
    percentage: 0,
  },
  timestamp: 0,
};

class PerformanceMonitor {
  private frameCount: number = 0;
  private lastFPSUpdate: number = 0;
  private currentFPS: number = 60;
  private batteryManager: BatteryManager | null = null;
  private batteryInfo: PerformanceMetrics['batteryInfo'] = undefined;
  private animationFrameId: number | null = null;
  private metricsState: PerformanceMetrics = DEFAULT_METRICS;
  private isInitialized: boolean = false;

  constructor() {
    // Doesnt initialize anything in constructor for SSR
  }

  private async initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.isInitialized = true;
    await this.setupBatteryMonitoring();
    this.startFrameTracking();
  }

  private async setupBatteryMonitoring() {
    if (typeof window === 'undefined' || !('getBattery' in navigator)) return;

    try {
      this.batteryManager = await navigator.getBattery!();

      const updateBatteryInfo = () => {
        if (this.batteryManager) {
          this.batteryInfo = {
            level: this.batteryManager.level * 100,
            charging: this.batteryManager.charging,
            chargingTime: this.batteryManager.chargingTime,
            dischargingTime: this.batteryManager.dischargingTime,
          };
          this.updateMetricsState();
        }
      };

      updateBatteryInfo();
      this.batteryManager.addEventListener('levelchange', updateBatteryInfo);
      this.batteryManager.addEventListener('chargingchange', updateBatteryInfo);
    } catch (error) {
      console.debug('Battery monitoring not available:', error);
    }
  }

  private startFrameTracking() {
    if (typeof window === 'undefined') return;

    let frameCount = 0;
    let lastTime = performance.now();

    const trackFrame = (timestamp: number) => {
      frameCount++;
      const elapsed = timestamp - lastTime;

      if (elapsed >= 1000) {
        this.currentFPS = Math.round((frameCount * 1000) / elapsed);
        frameCount = 0;
        lastTime = timestamp;
        this.updateMetricsState();
      }

      this.animationFrameId = requestAnimationFrame(trackFrame);
    };

    this.animationFrameId = requestAnimationFrame(trackFrame);
  }

  private updateMetricsState() {
    if (typeof window === 'undefined') return;

    const memory =
      'performance' in window && (performance as any).memory
        ? {
            used: Math.round(
              (performance as any).memory.usedJSHeapSize / (1024 * 1024),
            ),
            total: Math.round(
              (performance as any).memory.totalJSHeapSize / (1024 * 1024),
            ),
            percentage: Math.round(
              ((performance as any).memory.usedJSHeapSize /
                (performance as any).memory.totalJSHeapSize) *
                100,
            ),
          }
        : { used: 0, total: 0, percentage: 0 };

    this.metricsState = {
      fps: Math.round(this.currentFPS),
      memory,
      batteryInfo: this.batteryInfo,
      timestamp: Date.now(),
    };
  }

  public async getMetrics(): Promise<PerformanceMetrics> {
    await this.initialize();
    return this.metricsState;
  }

  public cleanup() {
    if (this.animationFrameId && typeof window !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.batteryManager) {
      this.batteryManager.removeEventListener('levelchange', () => {});
      this.batteryManager.removeEventListener('chargingchange', () => {});
    }
    this.isInitialized = false;
  }
}

export const performanceMonitor = new PerformanceMonitor();
