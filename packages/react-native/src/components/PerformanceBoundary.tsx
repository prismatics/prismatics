import React, { useEffect } from 'react';
import type { PerformanceConfig, PerformanceMetrics } from '../types';
import { usePerformance } from '../hooks/usePerformance';

interface PerformanceBoundaryProps {
    children: React.ReactNode;
    fallback: React.ReactNode;
    config?: PerformanceConfig;
    onPerformanceChange?: (isLow: boolean, metrics: PerformanceMetrics | null) => void;
}

export function PerformanceBoundary({
    children,
    fallback,
    config,
    onPerformanceChange,
}: PerformanceBoundaryProps) {
    const { metrics, isLowPerformance } = usePerformance(config);

    useEffect(() => {
        onPerformanceChange?.(isLowPerformance, metrics);
    }, [isLowPerformance, metrics, onPerformanceChange]);

    return <>{isLowPerformance ? fallback : children}</>;
}