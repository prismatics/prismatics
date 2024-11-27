# @prismatics/react-native

A lightweight yet powerful performance management and optimization system for React Native applications. This package provides real-time performance monitoring, automatic UI adaptation, and battery-aware optimizations.

> ⚠️ **Beta Software**: This package is in early beta. While functional, it may contain bugs and the API might change between versions.

## Features

- 📊 Real-time performance monitoring (FPS, memory usage)
- 🔄 Automatic UI adaptation based on performance metrics
- 🔋 Battery-aware optimizations (iOS)
- ⚡️ Minimal performance overhead
- 📱 Platform-specific optimizations
- 🎯 Component-level performance boundaries

## Installation

```bash
npm install @prismatics/react-native
# or
yarn add @prismatics/react-native
# or
pnpm add @prismatics/react-native
```

## Quick Start

```tsx
import { PerformanceBoundary, usePerformance } from '@prismatics/react-native';

// Using Performance Boundary
function ComplexList() {
  return (
    <PerformanceBoundary
      fallback={<SimpleListView data={data} />}
      config={{
        thresholds: {
          fps: 30,
          memoryPercentage: 80
        }
      }}
      onPerformanceChange={(isLow, metrics) => {
        console.log('Performance changed:', { isLow, metrics });
      }}
    >
      <ComplexListView data={data} />
    </PerformanceBoundary>
  );
}

// Using Performance Hook
function PerformanceStats() {
  const { metrics, isLowPerformance } = usePerformance({
    sampleRate: 1000,
    enableBatteryMonitoring: true
  });

  return (
    <View>
      <Text>FPS: {metrics?.fps.toFixed(1)}</Text>
      <Text>Memory: {metrics?.memory.percentage.toFixed(1)}%</Text>
      {metrics?.batteryInfo && (
        <Text>Battery: {metrics.batteryInfo.level.toFixed(1)}%</Text>
      )}
    </View>
  );
}
```

## API Reference

### PerformanceBoundary

A component that automatically switches between views based on performance metrics.

```tsx
interface PerformanceBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  config?: PerformanceConfig;
  onPerformanceChange?: (isLow: boolean, metrics: PerformanceMetrics | null) => void;
}
```

### usePerformance Hook

```tsx
const { 
  metrics,          // Current performance metrics
  isLowPerformance, // Whether performance is below thresholds
  isBatteryMonitoringAvailable // Whether battery monitoring is available
} = usePerformance({
  thresholds: {
    fps: 30,              // Minimum acceptable FPS
    memoryPercentage: 80, // Maximum memory usage
    batteryLevel: 20      // Minimum battery level (iOS only)
  },
  sampleRate: 1000,       // How often to check metrics (ms)
  enableBatteryMonitoring: true, // Enable battery monitoring
  adaptiveMonitoring: true      // Adjust sample rate based on performance
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
  batteryInfo?: {    // iOS only
    level: number;   // 0-100
    isLowPowerMode: boolean;
    isCharging: boolean;
  };
  timestamp: number;
}
```

## Platform Support

| Feature | iOS | Android |
|---------|-----|---------|
| FPS Monitoring | ✅ | ✅ |
| Memory Monitoring | ✅ | ✅ |
| Battery Monitoring | ✅ | ❌ |
| Low Power Mode | ✅ | ❌ |

## Best Practices

1. **Component Boundaries**: Place performance boundaries around computationally expensive components
2. **Appropriate Thresholds**: Set thresholds based on your app's specific needs
3. **Fallback Components**: Design lightweight fallback components that maintain core functionality
4. **Battery Awareness**: Consider battery state when implementing power-intensive features

## Known Limitations

- Battery monitoring is currently only available on iOS
- Memory usage metrics might vary in accuracy across devices
- Performance overhead increases with lower sampling rates

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © Prismatics