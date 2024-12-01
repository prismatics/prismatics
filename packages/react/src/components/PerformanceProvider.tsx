import React, { useEffect, useState } from 'react';
import { PerformanceContext, PerformanceContextValue, PerformanceState } from '../context/PerformanceContext';
import { performanceMonitor } from '../utils/metrics';
import type { PerformanceMetrics } from '../types';
import { PerformanceClient } from '../core/PerformanceClient';

interface PerformanceProviderProps {
    client: PerformanceClient;
    children: React.ReactNode;
}

export function PerformanceProvider({ client, children }: PerformanceProviderProps) {
    const [state, setState] = useState<PerformanceState>({
        metrics: null,
        isLowPerformance: false,
        isBatteryMonitoringAvailable: typeof navigator !== 'undefined' && 'getBattery' in navigator,
    });

    useEffect(() => {
        const config = client.getConfig();
        let timeoutId: number;

        const checkPerformance = async () => {
            const metrics = await performanceMonitor.getMetrics();
            const isLow = metrics.fps < (config.thresholds?.fps || 30) ||
                metrics.memory.percentage > (config.thresholds?.memoryPercentage || 80);

            setState(prev => ({
                ...prev,
                metrics,
                isLowPerformance: isLow,
            }));

            client.notify(metrics);

            const nextDelay = config.adaptiveMonitoring && isLow
                ? config.sampleRate! * 2
                : config.sampleRate;

            timeoutId = window.setTimeout(checkPerformance, nextDelay);
        };

        checkPerformance();

        return () => {
            window.clearTimeout(timeoutId);
            performanceMonitor.cleanup();
        };
    }, [client]);

    const contextValue: PerformanceContextValue = {
        ...state,
        client,
        updateMetrics: (metrics: PerformanceMetrics) => {
            setState(prev => ({ ...prev, metrics }));
        },
        setLowPerformance: (isLow: boolean) => {
            setState(prev => ({ ...prev, isLowPerformance: isLow }));
        },
    };

    return (
        <PerformanceContext.Provider value={contextValue}>
            {children}
        </PerformanceContext.Provider>
    );
}