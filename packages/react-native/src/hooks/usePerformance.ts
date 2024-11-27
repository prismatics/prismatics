import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import type { PerformanceMetrics, PerformanceConfig } from '../types';
import { performanceMonitor } from '../utils/metrics';

const DEFAULT_CONFIG: PerformanceConfig = {
  thresholds: {
    fps: 30,
    memoryPercentage: 80,
    batteryLevel: 20,
  },
  sampleRate: 1000,
  enableBatteryMonitoring: true,
  adaptiveMonitoring: true,
};

export function usePerformance(config: Partial<PerformanceConfig> = {}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const checkPerformance = useCallback(async () => {
    const currentMetrics = await performanceMonitor.getMetrics();
    setMetrics(currentMetrics);

    const isLow: any =
      currentMetrics.fps < (finalConfig.thresholds?.fps || 30) ||
      currentMetrics.memory.percentage >
        (finalConfig.thresholds?.memoryPercentage || 80) ||
      (Platform.OS === 'ios' &&
        finalConfig.enableBatteryMonitoring &&
        currentMetrics.batteryInfo?.level !== undefined &&
        currentMetrics.batteryInfo.level <
          (finalConfig.thresholds?.batteryLevel || 20));

    setIsLowPerformance(isLow);

    // Adaptive monitoring - increase interval if performance is low
    return finalConfig.adaptiveMonitoring && isLow
      ? finalConfig.sampleRate! * 2
      : finalConfig.sampleRate;
  }, [finalConfig]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runCheck = async () => {
      const nextDelay = await checkPerformance();
      timeoutId = setTimeout(runCheck, nextDelay);
    };

    runCheck();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [checkPerformance]);

  return {
    metrics,
    isLowPerformance,
    isBatteryMonitoringAvailable: Platform.OS === 'ios',
  };
}
