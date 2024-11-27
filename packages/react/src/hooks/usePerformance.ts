import { useState, useEffect, useCallback, useRef } from 'react';
import type { PerformanceMetrics, PerformanceConfig } from '../types';
import { performanceMonitor } from '../utils/metrics';

const DEFAULT_CONFIG: PerformanceConfig = {
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
};

export function usePerformance(config: Partial<PerformanceConfig> = {}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const timeoutRef = useRef<number>();
  const configRef = useRef(config);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const checkPerformance = useCallback(async () => {
    if (!isClient) return DEFAULT_CONFIG.sampleRate;

    const currentMetrics = await performanceMonitor.getMetrics();
    const finalConfig = { ...DEFAULT_CONFIG, ...configRef.current };
    const thresholds = finalConfig.thresholds!;

    const isLow: any =
      currentMetrics.fps < (thresholds.fps || 30) ||
      currentMetrics.memory.percentage > (thresholds.memoryPercentage || 80) ||
      (finalConfig.enableBatteryMonitoring &&
        currentMetrics.batteryInfo?.level !== undefined &&
        currentMetrics.batteryInfo.level < (thresholds.batteryLevel || 20));

    setMetrics(currentMetrics);
    setIsLowPerformance(isLow);

    return finalConfig.adaptiveMonitoring && isLow
      ? finalConfig.sampleRate! * 2
      : finalConfig.sampleRate;
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const runCheck = async () => {
      const nextDelay = await checkPerformance();
      timeoutRef.current = window.setTimeout(runCheck, nextDelay);
    };

    runCheck();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      performanceMonitor.cleanup();
    };
  }, [checkPerformance, isClient]);

  return {
    metrics,
    isLowPerformance,
    isBatteryMonitoringAvailable: isClient && 'getBattery' in navigator,
  };
}
