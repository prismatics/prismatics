'use client';

import { useState } from 'react';
import { usePerformanceTask, usePerformanceSubscription, PerformanceTraceResult } from '@prismatics/react';
import { MetricsDisplay } from '../../components/MetricsDisplay';

interface DataPoint {
    id: number;
    value: number;
    timestamp: number;
}

function generateLargeDataset(size: number): DataPoint[] {
    return Array.from({ length: size }, (_, i) => ({
        id: i,
        value: Math.random() * 1000,
        timestamp: Date.now() - i * 1000,
    }));
}

export default function PerformanceTaskExample() {
    const [processedData, setProcessedData] = useState<DataPoint[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastTraceResult, setLastTraceResult] = useState<PerformanceTraceResult | null>(null);

    const { executeTask } = usePerformanceTask({
        name: 'data-processing',
        threshold: 100,
        onComplete: (result) => {
            setLastTraceResult(result);
            setIsProcessing(false);
        },
        onThresholdExceeded: (result) => {
            console.warn('Performance threshold exceeded:', result);
        },
    });

    // Subscribe to overall performance metrics
    usePerformanceSubscription((metrics) => {
        if (metrics.fps < 30) {
            console.warn('Low FPS detected:', metrics.fps);
        }
    });

    const processData = async () => {
        setIsProcessing(true);
        const rawData = generateLargeDataset(10000);

        try {
            const result = await executeTask(async () => {
                // Simulate complex data processing
                const processed = rawData.map(point => ({
                    ...point,
                    value: point.value * Math.sin(point.timestamp / 1000),
                    movingAverage: calculateMovingAverage(rawData, point.id, 100),
                }));

                return processed.filter(point => point.value > 0);
            });

            setProcessedData(result);
        } catch (error) {
            console.error('Processing failed:', error);
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <MetricsDisplay />

            <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-4">Performance Task Example</h1>
                <p className="text-gray-600 mb-4">
                    This example demonstrates how to use performance task monitoring for
                    heavy computations while tracking their impact on application performance.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={processData}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        {isProcessing ? 'Processing...' : 'Process Large Dataset'}
                    </button>

                    {lastTraceResult && (
                        <div className="p-4 bg-gray-50 rounded">
                            <h2 className="font-semibold mb-2">Last Operation Metrics</h2>
                            <dl className="grid grid-cols-2 gap-2 text-sm">
                                <dt>Duration</dt>
                                <dd>{lastTraceResult.duration.toFixed(2)}ms</dd>

                                <dt>Memory Impact</dt>
                                <dd>{(lastTraceResult.memoryImpact / 1024 / 1024).toFixed(2)}MB</dd>

                                <dt>FPS Impact</dt>
                                <dd>{lastTraceResult.fpsImpact.toFixed(1)} fps</dd>
                            </dl>
                        </div>
                    )}

                    <div className="mt-4">
                        <h2 className="font-semibold mb-2">Processed Data Preview</h2>
                        <div className="max-h-60 overflow-y-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Value</th>
                                        <th className="px-4 py-2">Moving Average</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processedData.slice(0, 100).map(point => (
                                        <tr key={point.id}>
                                            <td className="px-4 py-2">{point.id}</td>
                                            <td className="px-4 py-2">{point.value.toFixed(2)}</td>
                                            <td className="px-4 py-2">
                                                {/* {point.movingAverage.toFixed(2)} */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function calculateMovingAverage(data: DataPoint[], currentId: number, window: number): number {
    const startIdx = Math.max(0, currentId - window);
    const endIdx = currentId;
    const windowData = data.slice(startIdx, endIdx + 1);
    return windowData.reduce((sum, point) => sum + point.value, 0) / windowData.length;
}