import {
  PerformanceConfig,
  PerformanceMetrics,
  PerformanceTrace,
  PerformanceTraceResult,
} from '../types';

export class PerformanceClient {
  private config: PerformanceConfig;
  private listeners: Set<(metrics: PerformanceMetrics) => void>;
  private traces: Map<string, PerformanceTrace>;

  private frameCount: number = 0;
  private lastFPSUpdate: number = 0;
  private currentFPS: number = 60;
  private rafId: number | null = null;

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      thresholds: {
        fps: 30,
        memoryPercentage: 80,
        pageLoadTime: 3000,
        batteryLevel: 20,
      },
      sampleRate: 1000,
      enableBatteryMonitoring: true,
      enableWebVitals: true,
      adaptiveMonitoring: true,
      ...config,
    };
    this.listeners = new Set();
    this.traces = new Map();

    // Start FPS tracking when client is created
    this.startFPSTracking();
  }

  private startFPSTracking() {
    if (typeof window === 'undefined') return;

    let previousTime = performance.now();

    const trackFrame = (timestamp: number) => {
      // Increment frame count
      this.frameCount++;

      // Calculate time elapsed since last FPS update
      const elapsed = timestamp - this.lastFPSUpdate;

      // Update FPS every second
      if (elapsed >= 1000) {
        // Calculate FPS: frames per second
        this.currentFPS = (this.frameCount * 1000) / elapsed;

        // Reset frame count and update timestamp
        this.frameCount = 0;
        this.lastFPSUpdate = timestamp;

        // Calculate frame time (ms per frame)
        const frameTime = timestamp - previousTime;
        previousTime = timestamp;

        // If frame time is unusually high, it might indicate performance issues
        if (frameTime > 32) {
          // More than ~30 FPS
          this.notifyPerformanceIssue('high-frame-time', frameTime);
        }
      }

      // Continue tracking
      this.rafId = requestAnimationFrame(trackFrame);
    };

    // Start the tracking loop
    this.rafId = requestAnimationFrame(trackFrame);
  }

  private stopFPSTracking() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public getCurrentFps(): number {
    return Math.round(this.currentFPS);
  }

  private notifyPerformanceIssue(type: string, value: number) {
    // Notify listeners of performance issues
    const metrics: PerformanceMetrics = {
      fps: this.getCurrentFps(),
      memory: this.getMemoryMetrics(),
      timestamp: Date.now(),
      performanceIssue: {
        type,
        value,
      },
    };

    this.notify(metrics);
  }

  private getMemoryMetrics() {
    if (typeof performance === 'undefined' || !performance.memory) {
      return {
        used: 0,
        total: 0,
        percentage: 0,
      };
    }

    const used = performance.memory.usedJSHeapSize;
    const total = performance.memory.jsHeapSizeLimit;

    return {
      used,
      total,
      percentage: total > 0 ? (used / total) * 100 : 0,
    };
  }

  public setConfig(config: Partial<PerformanceConfig>) {
    this.config = { ...this.config, ...config };
  }

  public getConfig(): PerformanceConfig {
    return this.config;
  }

  public subscribe(listener: (metrics: PerformanceMetrics) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify(metrics: PerformanceMetrics) {
    this.listeners.forEach((listener) => listener(metrics));
  }

  public startTrace(name: string) {
    this.traces.set(name, {
      name,
      startTime: performance.now(),
      metrics: {
        startMemory: performance.memory?.usedJSHeapSize || 0,
        startFps: this.getCurrentFps(),
      },
    });
  }

  public endTrace(name: string): PerformanceTraceResult | null {
    const trace = this.traces.get(name);
    if (!trace) return null;

    const endTime = performance.now();
    const duration = endTime - trace.startTime;
    const endMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryDelta = endMemory - trace.metrics.startMemory;
    const endFps = this.getCurrentFps();
    const fpsDelta = endFps - trace.metrics.startFps;

    this.traces.delete(name);

    return {
      name,
      duration,
      memoryImpact: memoryDelta,
      fpsImpact: fpsDelta,
      timestamp: endTime,
    };
  }

  public destroy() {
    this.stopFPSTracking();
    this.listeners.clear();
    this.traces.clear();
  }
}
