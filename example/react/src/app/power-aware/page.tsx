'use client';

import { usePerformanceMonitor } from '@prismatics/react';
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function generateChartData() {
    return Array.from({ length: 100 }, (_, i) => ({
        name: i,
        value: Math.sin(i * 0.1) * 100 + Math.random() * 20,
    }));
}

// High-performance version with rich interactivity and animations
function RichChart({ data }: { data: any[] }) {
    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        animationDuration={500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// Power-efficient version with minimal interactivity
function SimpleChart({ data }: { data: any[] }) {
    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer>
                <LineChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        dot={false}
                        animationDuration={0}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function PowerAwarePage() {
    const { metrics, isBatteryMonitoringAvailable } = usePerformanceMonitor({
        enableBatteryMonitoring: true,
        sampleRate: 1000,
    });

    const chartData = useMemo(() => generateChartData(), []);

    const isLowPower = isBatteryMonitoringAvailable &&
        metrics?.batteryInfo &&
        (metrics.batteryInfo.level < 20 || metrics.batteryInfo.charging === false);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-2">Power-Aware Component</h1>
                <p className="text-gray-600 mb-4">
                    This example demonstrates how components can adapt their behavior and
                    appearance based on the device's power status. The chart will switch to a
                    simplified version when battery is low or not charging.
                </p>

                {isBatteryMonitoringAvailable && metrics?.batteryInfo ? (
                    <div className="mb-4 p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Battery Status</p>
                                <p className="text-sm text-gray-600">
                                    Level: {metrics.batteryInfo.level.toFixed(1)}%
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">Power Mode</p>
                                <p className="text-sm text-gray-600">
                                    {isLowPower ? 'Power Saving' : 'Normal'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">Charging</p>
                                <p className="text-sm text-gray-600">
                                    {metrics.batteryInfo.charging ? 'Yes ⚡' : 'No'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 p-4 rounded-lg bg-yellow-50">
                        <p className="text-sm text-yellow-800">
                            Battery monitoring is not available in your browser.
                            This example works best in browsers that support the Battery API.
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                {isLowPower ? (
                    <>
                        <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                                Power saving mode active - displaying simplified visualization
                            </p>
                        </div>
                        <SimpleChart data={chartData} />
                    </>
                ) : (
                    <>
                        <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
                            <p className="text-sm text-green-800">
                                Normal power mode - displaying full interactive visualization
                            </p>
                        </div>
                        <RichChart data={chartData} />
                    </>
                )}
            </div>
        </div>
    );
}