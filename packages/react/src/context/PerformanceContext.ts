import { createContext, useContext } from 'react';
import type { PerformanceMetrics, PerformanceConfig } from '../types';
import { PerformanceClient } from '../core/PerformanceClient';

export interface PerformanceState {
  metrics: PerformanceMetrics | null;
  isLowPerformance: boolean;
  isBatteryMonitoringAvailable: boolean;
}

export interface PerformanceContextValue extends PerformanceState {
  client: PerformanceClient;
  updateMetrics: (metrics: PerformanceMetrics) => void;
  setLowPerformance: (isLow: boolean) => void;
}

export const PerformanceContext = createContext<PerformanceContextValue | null>(
  null,
);

export function usePerformanceContext() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error(
      'usePerformanceContext must be used within a PerformanceProvider',
    );
  }
  return context;
}
