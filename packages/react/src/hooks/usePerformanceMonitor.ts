import React, { useEffect } from 'react';
import { usePerformanceContext } from '../context/PerformanceContext';
import { PerformanceConfig } from '../types';

export function usePerformanceMonitor(config?: Partial<PerformanceConfig>) {
  const context = usePerformanceContext();

  useEffect(() => {
    if (config) {
      context.client.setConfig(config);
    }
  }, [config, context.client]);

  return {
    metrics: context.metrics,
    isLowPerformance: context.isLowPerformance,
    isBatteryMonitoringAvailable: context.isBatteryMonitoringAvailable,
  };
}
