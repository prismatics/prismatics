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
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </a>
    );
}

export default function Home() {
    return (
        <div>
            <MetricsDisplay />

            <h2 className="text-2xl font-bold mb-6">Example Components</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <Card
                    title="Heavy List Example"
                    description="Demonstrates automatic performance optimization for long lists with complex items."
                    href="/heavy-list"
                />
                <Card
                    title="Performance Monitor"
                    description="Real-time visualization of performance metrics with detailed analysis."
                    href="/performance-monitor"
                />
                <Card
                    title="Power Aware Components"
                    description="Components that adapt based on device battery status and power mode."
                    href="/power-aware"
                />
            </div>
        </div>
    );
}