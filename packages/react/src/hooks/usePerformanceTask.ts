import React, { useCallback } from 'react';
import { usePerformanceContext } from '../context/PerformanceContext';
import { PerformanceTraceResult } from '../types';

interface PerformanceTaskOptions {
  name?: string;
  threshold?: number;
  onComplete?: (result: PerformanceTraceResult) => void;
  onThresholdExceeded?: (result: PerformanceTraceResult) => void;
}

export function usePerformanceTask(options: PerformanceTaskOptions = {}) {
  const context = usePerformanceContext();
  const client = context.client;

  const executeTask = useCallback(
    async <T>(task: () => Promise<T>): Promise<T> => {
      const traceName = options.name || `task-${Date.now()}`;
      client.startTrace(traceName);

      try {
        const result = await task();
        const traceResult = client.endTrace(traceName);

        if (traceResult) {
          if (options.threshold && traceResult.duration > options.threshold) {
            options.onThresholdExceeded?.(traceResult);
          }
          options.onComplete?.(traceResult);
        }

        return result;
      } catch (error) {
        client.endTrace(traceName);
        throw error;
      }
    },
    [client, options],
  );

  return { executeTask };
}
