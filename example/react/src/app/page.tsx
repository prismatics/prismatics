'use client';

import { MetricsDisplay } from '../components/MetricsDisplay';

function Card({ title, description, href }: {
    title: string;
    description: string;
    href: string;
}) {


    return (
        <a
            href={href}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-gray-600">{description}</p>
        </a>
    );
}

export default function Home() {

    return (
        <div>
            <MetricsDisplay />

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">Performance Examples</h2>
                <p className="text-gray-600">
                    Explore different scenarios and patterns for handling performance-sensitive features
                    in React applications. Each example demonstrates different aspects of the
                    performance monitoring and optimization system.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card
                    title="Performance Monitor"
                    description="Real-time visualization of performance metrics with detailed analysis and history tracking."
                    href="/performance-monitor"
                />
                <Card
                    title="Power Aware Components"
                    description="Components that adapt based on device battery status and power mode. Shows advanced usage of performance monitoring."
                    href="/power-aware"
                />
                <Card
                    title="Performance Task Example"
                    description="Demonstrates how to monitor and optimize heavy computational tasks with real-time performance tracking."
                    href="/performance-task"
                />
            </div>
        </div>
    );
}