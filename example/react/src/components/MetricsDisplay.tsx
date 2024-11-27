'use client';

import React, { memo } from 'react';
import { usePerformance } from '@prismatics/react';

const MetricValue = memo(({ value, label }: { value: string; label: string }) => (
    <div className="bg-gray-50 p-4 rounded">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-semibold">{value || 'Loading...'}</p>
    </div>
));

export const MetricsDisplay = memo(() => {
    const { metrics, isBatteryMonitoringAvailable } = usePerformance({
        sampleRate: 2000,
        enableBatteryMonitoring: true,
    });

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricValue
                    label="FPS"
                    value={metrics ? metrics.fps.toFixed(0) : '-'}
                />
                <MetricValue
                    label="Memory Usage"
                    value={metrics ? `${metrics.memory.percentage.toFixed(0)}%` : '-'}
                />
                {isBatteryMonitoringAvailable && metrics?.batteryInfo && (
                    <MetricValue
                        label="Battery"
                        value={`${metrics.batteryInfo.level.toFixed(0)}%${metrics.batteryInfo.charging ? ' ⚡' : ''
                            }`}
                    />
                )}
            </div>
        </div>
    );
});
