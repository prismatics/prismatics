# Prismatics

> Real-time performance monitoring and optimization toolkit for React and React Native applications

Prismatics provides a comprehensive set of tools and utilities for monitoring, analyzing, and optimizing application performance in real-time.

## 📦 Packages

| Package | Platform | Latest Version | Description |
|---------|----------|----------------|-------------|
| [@prismatics/react](./packages/react) | Web | ![npm](https://img.shields.io/npm/v/@prismatics/react) | Performance management for React web applications |
| [@prismatics/react-native](./packages/react-native) | Mobile | ![npm](https://img.shields.io/npm/v/@prismatics/react-native) | Performance management for React Native applications |

## ✨ Key Features

- 📊 Real-time performance monitoring (FPS, memory usage, battery status)
- 🔄 Performance-aware components with automatic optimization
- 📈 Detailed performance metrics and analysis
- ⚡️ Task performance tracking and optimization
- 🔋 Battery-aware optimizations
- 📱 Platform-specific optimizations
- 🎯 Performance boundaries for conditional rendering

## 🚀 Quick Start

### For Web Applications

```bash
npm install @prismatics/react
# or
yarn add @prismatics/react
# or
pnpm add @prismatics/react
```

```tsx
import { PerformanceProvider, PerformanceClient } from '@prismatics/react';

// Create a performance client
const client = new PerformanceClient({
  thresholds: {
    fps: 45,
    memoryPercentage: 70,
    pageLoadTime: 3000,
  },
  sampleRate: 1000,
  enableBatteryMonitoring: true,
  enableWebVitals: true,
});

// Wrap your application with the provider
function App() {
  return (
    <PerformanceProvider client={client}>
      <YourApp />
    </PerformanceProvider>
  );
}

// Monitor performance in components
function YourComponent() {
  const { metrics, isLowPerformance } = usePerformanceMonitor();
  const { executeTask } = usePerformanceTask({
    name: 'heavy-operation',
    threshold: 100,
  });

  // Handle performance-intensive tasks
  const handleHeavyOperation = async () => {
    try {
      await executeTask(async () => {
        // Your heavy computation here
      });
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <div>
      <p>Current FPS: {metrics?.fps}</p>
      <button onClick={handleHeavyOperation}>
        Execute Heavy Task
      </button>
    </div>
  );
}
```

## 📊 Features in Detail

### Performance Monitoring
- Real-time FPS tracking
- Memory usage monitoring
- Battery status tracking
- Web Vitals metrics
- Performance issue detection

### Performance Tasks
- Track and measure heavy operations
- Automatic performance impact analysis
- Threshold-based optimizations
- Detailed execution metrics

### Performance Subscriptions
- Real-time metrics updates
- Performance trend analysis
- Customizable monitoring intervals
- Automatic adaptation to performance conditions

## 🛠️ Development

### Prerequisites
- Node.js >= 16
- pnpm >= 8.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/prismatics/prismatics.git
cd prismatics

# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm test

# Start development
pnpm dev
```

## 📚 Documentation
- [@prismatics/react documentation](./packages/react/README.md)
- [@prismatics/react-native documentation](./packages/react-native/README.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT © Prismatics