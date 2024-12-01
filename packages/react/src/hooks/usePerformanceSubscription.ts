import React, { useEffect } from 'react';
import { usePerformanceContext } from '../context/PerformanceContext';
import { PerformanceMetrics } from '../types';

export function usePerformanceSubscription(
  onMetricsUpdate: (metrics: PerformanceMetrics) => void,
  options: { immediate?: boolean } = {},
) {
  const context = usePerformanceContext();

  useEffect(() => {
    if (options.immediate && context.metrics) {
      onMetricsUpdate(context.metrics);
    }

    return context.client.subscribe(onMetricsUpdate);
  }, [context, onMetricsUpdate, options.immediate]);
}
