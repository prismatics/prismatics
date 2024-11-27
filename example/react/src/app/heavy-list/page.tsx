'use client';

import { memo, useCallback, useState } from 'react';
import { PerformanceBoundary } from '@prismatics/react';
import { MetricsDisplay } from '../../components/MetricsDisplay';

const ComplexListItem = memo(({ item }: { item: any }) => (
    <div className="p-4 border-b border-gray-200 hover:bg-gray-50">
        <div className="flex items-start">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4" />
            <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1 truncate">{item.title}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {item.likes}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {item.comments}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
));

const SimpleListItem = memo(({ item }: { item: any }) => (
    <div className="p-3 border-b border-gray-200">
        <h3 className="font-medium truncate">{item.title}</h3>
        <p className="text-gray-600 truncate text-sm">{item.description}</p>
    </div>
));

const generateData = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
        description: `This is a detailed description for item ${i + 1} that contains multiple lines of text to demonstrate the difference between complex and simple views.`,
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        tags: ['Performance', 'React', 'Web'].slice(0, Math.floor(Math.random() * 3) + 1),
    }));

export default function HeavyListPage() {
    const [data] = useState(() => generateData(1000));
    const [metrics, setMetrics] = useState<any>(null);

    const ComplexList = useCallback(() => (
        <div className="divide-y divide-gray-200">
            {data.map(item => (
                <ComplexListItem key={item.id} item={item} />
            ))}
        </div>
    ), [data]);

    const SimpleList = useCallback(() => (
        <div className="divide-y divide-gray-200">
            {data.map(item => (
                <SimpleListItem key={item.id} item={item} />
            ))}
        </div>
    ), [data]);

    return (
        <div className="space-y-6">
            <MetricsDisplay />

            <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-2">Performance-Aware List</h1>
                <p className="text-gray-600 mb-4">
                    This example demonstrates automatic switching between complex and simple list
                    views based on performance metrics. The complex view includes rich formatting
                    and animations, while the simple view provides a basic representation for
                    better performance.
                </p>
                {metrics && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            Performance changed: {metrics.isLow ? 'Low' : 'Normal'}
                            (FPS: {metrics.metrics?.fps.toFixed(1)})
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <PerformanceBoundary
                    fallback={<SimpleList />}
                    config={{
                        thresholds: {
                            fps: 45,
                            memoryPercentage: 70,
                        },
                        sampleRate: 1000,
                    }}
                    onPerformanceChange={(isLow, metrics) => {
                        setMetrics({ isLow, metrics });
                    }}
                >
                    <ComplexList />
                </PerformanceBoundary>
            </div>
        </div>
    );
}