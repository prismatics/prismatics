import { Platform, NativeEventEmitter, NativeModules } from 'react-native';
import { PerformanceMetrics } from '../types';

class PerformanceMonitor {
  private frameCount: number = 0;
  private lastFPSUpdate: number = 0;
  private currentFPS: number = 60;
  private batteryEmitter?: NativeEventEmitter;
  private batteryInfo: PerformanceMetrics['batteryInfo'] = undefined;

  constructor() {
    this.setupBatteryMonitoring();
    this.startFrameTracking();
  }

  private setupBatteryMonitoring() {
    if (Platform.OS === 'ios') {
      const { BatteryManager } = NativeModules;
      if (BatteryManager) {
        this.batteryEmitter = new NativeEventEmitter(BatteryManager);

        // Setup battery monitoring
        this.batteryEmitter.addListener('BatteryStatusDidChange', (status) => {
          this.batteryInfo = {
            level: status.level * 100,
            isLowPowerMode: status.poweredMode === 'low',
            isCharging: status.state === 'charging',
          };
        });

        BatteryManager.getBatteryLevel((level: number) => {
          this.batteryInfo = {
            ...this.batteryInfo,
            level: level * 100,
          };
        });
      }
    }
  }

  private startFrameTracking() {
    const trackFrame = () => {
      const now = performance.now();
      this.frameCount++;

      if (now - this.lastFPSUpdate >= 1000) {
        this.currentFPS = Math.round(
          (this.frameCount * 1000) / (now - this.lastFPSUpdate),
        );
        this.frameCount = 0;
        this.lastFPSUpdate = now;
      }

      requestAnimationFrame(trackFrame);
    };

    requestAnimationFrame(trackFrame);
  }

  public async getMetrics(): Promise<PerformanceMetrics> {
    const memory = (global as any).performance?.memory || {};

    return {
      fps: this.currentFPS,
      memory: {
        used: memory.usedJSHeapSize || 0,
        total: memory.totalJSHeapSize || 0,
        percentage: memory.usedJSHeapSize
          ? (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
          : 0,
      },
      batteryInfo: this.batteryInfo,
      timestamp: Date.now(),
    };
  }

  public cleanup() {
    if (this.batteryEmitter) {
      this.batteryEmitter.removeAllListeners('BatteryStatusDidChange');
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
