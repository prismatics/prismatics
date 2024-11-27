'use client';

import { usePerformance } from '@prismatics/react';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricHistory {
    timestamp: number;
    fps: number;
    memory: number;
    battery?: number;
}

function getPerformanceStatus(fps: number) {
    if (fps >= 55) return { text: 'Excellent', color: 'text-green-600' };
    if (fps >= 45) return { text: 'Good', color: 'text-blue-600' };
    if (fps >= 30) return { text: 'Fair', color: 'text-yellow-600' };
    return { text: 'Poor', color: 'text-red-600' };
}

export default function PerformanceMonitorPage() {
    const { metrics, isBatteryMonitoringAvailable } = usePerformance({
        sampleRate: 5000, //5 seconds
        enableBatteryMonitoring: true,
        enableWebVitals: true,
    });

    const [history, setHistory] = useState<MetricHistory[]>([]);
    const status = getPerformanceStatus(metrics?.fps || 0);

    // Keep last 30 seconds of history
    useEffect(() => {
        if (metrics) {
            setHistory(prev => {
                const newHistory = [...prev, {
                    timestamp: Date.now(),
                    fps: metrics.fps,
                    memory: metrics.memory.percentage,
                    battery: metrics.batteryInfo?.level,
                }].slice(-30);
                return newHistory;
            });
        }
    }, [metrics]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-2">Performance Monitor</h1>
                <p className="text-gray-600">
                    Real-time monitoring of key performance metrics including FPS, memory usage,
                    and battery status. The graph shows the last 30 seconds of data.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* FPS Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-2">FPS</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                            {metrics?.fps.toFixed(1)}
                        </span>
                        <span className={`text-sm ${status.color}`}>
                            {status.text}
                        </span>
                    </div>
                </div>

                {/* Memory Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-2">Memory Usage</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                            {metrics?.memory.percentage.toFixed(1)}%
                        </span>
                        {metrics?.memory.total && (
                            <span className="text-sm text-gray-600">
                                of {(metrics?.memory.total / (1024 * 1024)).toFixed(0)} MB
                            </span>
                        )}

                    </div>
                </div>

                {/* Web Vitals */}
                {metrics?.pageLoadTime && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Web Vitals</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Page Load Time</p>
                                <p className="text-lg font-semibold">
                                    {(metrics.pageLoadTime / 1000).toFixed(2)}s
                                </p>
                            </div>
                            {metrics.firstContentfulPaint && (
                                <div>
                                    <p className="text-sm text-gray-600">First Contentful Paint</p>
                                    <p className="text-lg font-semibold">
                                        {(metrics.firstContentfulPaint / 1000).toFixed(2)}s
                                    </p>
                                </div>
                            )}
                            {metrics.timeToInteractive && (
                                <div>
                                    <p className="text-sm text-gray-600">Time to Interactive</p>
                                    <p className="text-lg font-semibold">
                                        {(metrics.timeToInteractive / 1000).toFixed(2)}s
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Battery Info */}
                {isBatteryMonitoringAvailable && metrics?.batteryInfo && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Battery Status</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Level</p>
                                <p className="text-lg font-semibold">
                                    {metrics.batteryInfo.level.toFixed(1)}%
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <p className="text-lg font-semibold">
                                    {metrics.batteryInfo.charging ? 'Charging ⚡' : 'Not Charging'}
                                </p>
                            </div>
                            {metrics.batteryInfo.chargingTime !== Infinity && (
                                <div>
                                    <p className="text-sm text-gray-600">Time to Full</p>
                                    <p className="text-lg font-semibold">
                                        {(metrics.batteryInfo.chargingTime / 60).toFixed(0)} minutes
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Metrics Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Performance History</h2>
                <div className="h-[300px]">
                    <ResponsiveContainer>
                        <LineChart data={history}>
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                            />
                            <YAxis yAxisId="left" domain={[0, 100]} />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 70]} />
                            <Tooltip
                                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                                formatter={(value, name) => [`${Number(value).toFixed(1)}`, name]}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="fps"
                                stroke="#8884d8"
                                name="FPS"
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="memory"
                                stroke="#82ca9d"
                                name="Memory %"
                            />
                            {isBatteryMonitoringAvailable && (
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="battery"
                                    stroke="#ffc658"
                                    name="Battery %"
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}