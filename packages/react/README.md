# @prismatics/react

A powerful performance monitoring and optimization system for React applications. Monitor performance in real-time, track performance-intensive tasks, and optimize your application based on performance metrics.

## Features

- 📊 Real-time performance monitoring (FPS, memory, Web Vitals)
- 🔄 Performance task tracking and optimization
- 🔋 Battery-aware adaptations
- 📈 Performance trend analysis
- ⚡️ Automatic performance issue detection
- 🎯 Detailed performance metrics and reporting

## Installation

```bash
npm install @prismatics/react
# or
yarn add @prismatics/react
# or
pnpm add @prismatics/react
```

## Core Concepts

### 1. Performance Client

The PerformanceClient is the core of the monitoring system. It manages configuration, tracks FPS, memory usage, and other performance metrics.

```typescript
import { PerformanceClient } from '@prismatics/react';

const client = new PerformanceClient({
  thresholds: {
    fps: 45,
    memoryPercentage: 70,
    pageLoadTime: 3000,
  },
  sampleRate: 1000,
  enableBatteryMonitoring: true,
  enableWebVitals: true,
  adaptiveMonitoring: true,
});
```

### 2. Performance Provider

The Provider component sets up the performance monitoring context for your application.

```typescript
import { PerformanceProvider } from '@prismatics/react';

function App() {
  return (
    <PerformanceProvider client={client}>
      <YourApp />
    </PerformanceProvider>
  );
}
```

### 3. Performance Monitoring Hook

Monitor performance metrics in your components:

```typescript
import { usePerformanceMonitor } from '@prismatics/react';

function PerformanceAwareComponent() {
  const { 
    metrics,
    isLowPerformance,
    isBatteryMonitoringAvailable
  } = usePerformanceMonitor({
    sampleRate: 1000,
    enableBatteryMonitoring: true,
  });

  return (
    <div>
      <p>FPS: {metrics?.fps}</p>
      <p>Memory Usage: {metrics?.memory.percentage}%</p>
      {isLowPerformance && (
        <p>Performance issues detected!</p>
      )}
    </div>
  );
}
```

### 4. Performance Tasks

Track and optimize performance-intensive operations:

```typescript
import { usePerformanceTask } from '@prismatics/react';

function DataProcessor() {
  const { executeTask } = usePerformanceTask({
    name: 'data-processing',
    threshold: 100,
    onComplete: (result) => {
      console.log('Task completed:', result);
    },
    onThresholdExceeded: (result) => {
      console.warn('Performance threshold exceeded:', result);
    },
  });

  const processData = async () => {
    try {
      const result = await executeTask(async () => {
        // Your heavy computation here
        return processedData;
      });
      setData(result);
    } catch (error) {
      console.error('Processing failed:', error);
    }
  };

  return <button onClick={processData}>Process Data</button>;
}
```

### 5. Performance Subscriptions

Subscribe to performance updates and track trends:

```typescript
import { usePerformanceSubscription } from '@prismatics/react';

function PerformanceMonitor() {
  usePerformanceSubscription((metrics) => {
    // React to performance changes
    if (metrics.fps < 30) {
      console.warn('Low FPS detected');
    }
  }, { immediate: true });

  return <PerformanceDisplay />;
}
```

## API Reference

### PerformanceClient

```typescript
interface PerformanceConfig {
  thresholds?: {
    fps?: number;
    memoryPercentage?: number;
    pageLoadTime?: number;
    batteryLevel?: number;
  };
  sampleRate?: number;
  enableBatteryMonitoring?: boolean;
  enableWebVitals?: boolean;
  adaptiveMonitoring?: boolean;
}

const client = new PerformanceClient(config?: PerformanceConfig);
```

### Hooks

#### usePerformanceMonitor

```typescript
const {
  metrics,          // Current performance metrics
  isLowPerformance, // Performance below thresholds
  isBatteryMonitoringAvailable
} = usePerformanceMonitor(config?: PerformanceConfig);
```

#### usePerformanceTask

```typescript
const { executeTask } = usePerformanceTask({
  name?: string;
  threshold?: number;
  onComplete?: (result: PerformanceTraceResult) => void;
  onThresholdExceeded?: (result: PerformanceTraceResult) => void;
});
```

#### usePerformanceSubscription

```typescript
usePerformanceSubscription(
  onMetricsUpdate: (metrics: PerformanceMetrics) => void,
  options?: { immediate?: boolean }
);
```

### Performance Metrics

```typescript
interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;    // Bytes
    total: number;   // Bytes
    percentage: number;
  };
  pageLoadTime?: number;
  firstContentfulPaint?: number;
  timeToInteractive?: number;
  batteryInfo?: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  };
  timestamp: number;
  performanceIssue?: {
    type: string;
    value: number;
  };
}
```

## Best Practices

1. **Initialize Early**: Set up the PerformanceClient at your app's entry point
2. **Set Appropriate Thresholds**: Adjust thresholds based on your app's requirements
3. **Use Performance Tasks**: Wrap heavy computations in performance tasks
4. **Monitor Trends**: Use subscriptions to track performance over time
5. **Handle Performance Issues**: Implement fallbacks for low-performance scenarios

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|---------|----------|---------|-------|
| FPS Monitoring | ✅ | ✅ | ✅ | ✅ |
| Memory Monitoring | ✅ | ⚠️* | ⚠️* | ✅ |
| Battery Monitoring | ✅ | ✅ | ❌ | ✅ |
| Web Vitals | ✅ | ✅ | ✅ | ✅ |

*Limited support or different implementation

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © Prismatics