'use client';

import React, { memo } from 'react';
import { usePerformanceMonitor } from '@prismatics/react';

const MetricValue = memo(({ label, value, unit = '' }: {
    value: string | number;
    label: string;
    unit?: string;
}) => (
    <div className="bg-gray-50 p-4 rounded">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-semibold">
            {value}
            {unit && <span className="text-base ml-1 text-gray-500">{unit}</span>}
        </p>
    </div>
));

export const MetricsDisplay = memo(() => {
    const { metrics, isLowPerformance, isBatteryMonitoringAvailable } = usePerformanceMonitor();

    if (!metrics) {
        return (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
                <p className="text-gray-500">Loading metrics...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Performance Metrics</h2>
                {isLowPerformance && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Performance Issues Detected
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricValue
                    label="FPS"
                    value={metrics.fps.toFixed(1)}
                />
                <MetricValue
                    label="Memory Usage"
                    value={metrics.memory.percentage.toFixed(1)}
                    unit="%"
                />
                {metrics.pageLoadTime && (
                    <MetricValue
                        label="Page Load"
                        value={(metrics.pageLoadTime / 1000).toFixed(2)}
                        unit="s"
                    />
                )}
                {isBatteryMonitoringAvailable && metrics.batteryInfo && (
                    <MetricValue
                        label="Battery"
                        value={`${metrics.batteryInfo.level.toFixed(0)}${metrics.batteryInfo.charging ? ' ⚡' : ''}`}
                        unit="%"
                    />
                )}
            </div>

            {metrics.memory.used > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    Memory Details: {(metrics.memory.used / (1024 * 1024)).toFixed(1)}MB used
                    of {(metrics.memory.total / (1024 * 1024)).toFixed(1)}MB
                </div>
            )}
        </div>
    );
});

MetricsDisplay.displayName = 'MetricsDisplay';