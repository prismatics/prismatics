# @prismatics/react

A powerful performance management and optimization system for React web applications. Monitor performance metrics in real-time, automatically adapt UI based on performance constraints, and optimize your application for various device capabilities.

> ⚠️ **Beta Software**: This package is in early beta. While functional, it may contain bugs and the API might change between versions.

## Features

- 📊 Real-time performance monitoring (FPS, memory, Web Vitals)
- 🔄 Automatic UI adaptation based on performance metrics
- 🔋 Battery-aware optimizations (where supported)
- ⚡️ Web Vitals tracking
- 🎯 Component-level performance boundaries
- 📱 Responsive to device capabilities
- 🔍 Debug mode for development

## Installation

```bash
npm install @prismatics/react
# or
yarn add @prismatics/react
# or
pnpm add @prismatics/react
```

## Quick Start

```tsx
import { PerformanceBoundary, usePerformance } from '@prismatics/react';

// Using Performance Boundary
function ComplexDataView() {
  return (
    <PerformanceBoundary
      fallback={<SimpleDataView />}
      config={{
        thresholds: {
          fps: 30,
          memoryPercentage: 80,
          pageLoadTime: 3000
        }
      }}
      onPerformanceChange={(isLow, metrics) => {
        console.log('Performance changed:', { isLow, metrics });
      }}
    >
      <RichDataVisualization />
    </PerformanceBoundary>
  );
}

// Using Performance Hook
function PerformanceMonitor() {
  const { metrics, isLowPerformance } = usePerformance({
    sampleRate: 1000,
    enableBatteryMonitoring: true,
    enableWebVitals: true
  });

  if (!metrics) return null;

  return (
    <div>
      <h3>Performance Metrics</h3>
      <dl>
        <dt>FPS</dt>
        <dd>{metrics.fps.toFixed(1)}</dd>
        
        <dt>Memory Usage</dt>
        <dd>{metrics.memory.percentage.toFixed(1)}%</dd>
        
        {metrics.pageLoadTime && (
          <>
            <dt>Page Load Time</dt>
            <dd>{(metrics.pageLoadTime / 1000).toFixed(2)}s</dd>
          </>
        )}
        
        {metrics.batteryInfo && (
          <>
            <dt>Battery</dt>
            <dd>{metrics.batteryInfo.level.toFixed(1)}% {metrics.batteryInfo.charging ? '(Charging)' : ''}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
```

## API Reference

### PerformanceBoundary

Component that provides automatic performance-based view switching.

```tsx
interface PerformanceBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  config?: PerformanceConfig;
  onPerformanceChange?: (isLow: boolean, metrics: PerformanceMetrics | null) => void;
}

<PerformanceBoundary
  fallback={<LightweightComponent />}
  config={{
    thresholds: {
      fps: 30,
      memoryPercentage: 80,
      pageLoadTime: 3000,
      timeToInteractive: 5000,
      batteryLevel: 20
    },
    sampleRate: 1000,
    enableBatteryMonitoring: true,
    enableWebVitals: true,
    adaptiveMonitoring: true
  }}
>
  <HeavyComponent />
</PerformanceBoundary>
```

### usePerformance Hook

Hook for accessing performance metrics and status.

```tsx
const {
  metrics,          // Current performance metrics
  isLowPerformance, // Whether performance is below thresholds
  isBatteryMonitoringAvailable // Whether battery API is available
} = usePerformance({
  thresholds?: {
    fps?: number;
    memoryPercentage?: number;
    pageLoadTime?: number;
    timeToInteractive?: number;
    batteryLevel?: number;
  },
  sampleRate?: number;
  enableBatteryMonitoring?: boolean;
  enableWebVitals?: boolean;
  adaptiveMonitoring?: boolean;
});
```

### Performance Metrics

```tsx
interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;    // Bytes
    total: number;   // Bytes
    percentage: number;
  };
  // Web-specific metrics
  pageLoadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  batteryInfo?: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  };
  timestamp: number;
}
```

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|---------|----------|---------|-------|
| FPS Monitoring | ✅ | ✅ | ✅ | ✅ |
| Memory Monitoring | ✅ | ⚠️* | ⚠️* | ✅ |
| Battery Monitoring | ✅ | ✅ | ❌ | ✅ |
| Web Vitals | ✅ | ✅ | ✅ | ✅ |

*Limited support or different implementation

## Best Practices

1. **Strategic Placement**: Place performance boundaries around computationally expensive components or those with heavy rendering
   
2. **Appropriate Thresholds**: Set thresholds based on your application's requirements and user experience goals
   
3. **Lightweight Fallbacks**: Design fallback components to be significantly lighter than their full versions
   
4. **Progressive Enhancement**: Use performance monitoring to progressively enhance features based on device capabilities

## Debugging

Enable debug mode for detailed performance logs:

```tsx
<PerformanceBoundary
  config={{
    debug: true,
    debugCallback: (metrics) => {
      console.log('Performance metrics:', metrics);
    }
  }}
>
  {/* Your components */}
</PerformanceBoundary>
```

## Known Limitations

- Memory monitoring accuracy varies by browser
- Battery API support is not universal
- Some Web Vitals metrics may not be available in all browsers
- Performance monitoring itself has a small performance cost

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © Prismatics