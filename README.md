# Prismatics

> Performance optimization and monitoring toolkit for modern JavaScript applications

Prismatics is a comprehensive toolkit for building performance-aware applications. It provides real-time performance monitoring and automatic optimization capabilities for both web and mobile applications.

## 📦 Packages

| Package | Platform | Latest Version | Description |
|---------|----------|----------------|-------------|
| [@prismatics/react](./packages/react) | Web | ![npm](https://img.shields.io/npm/v/@prismatics/react) | Performance management for React web applications |
| [@prismatics/react-native](./packages/react-native) | Mobile | ![npm](https://img.shields.io/npm/v/@prismatics/react-native) | Performance management for React Native applications |

## ✨ Key Features

- 📊 Real-time performance monitoring
- 🔄 Automatic UI adaptation
- 🔋 Battery-aware optimizations
- ⚡️ Web Vitals tracking (React)
- 📱 Platform-specific optimizations
- 🎯 Component-level performance boundaries

## 🚀 Quick Start

### For Web Applications

```bash
npm install @prismatics/react
```

```tsx
import { PerformanceBoundary } from '@prismatics/react';

function App() {
  return (
    <PerformanceBoundary
      fallback={<LightweightView />}
      config={{ thresholds: { fps: 30 } }}
    >
      <ComplexView />
    </PerformanceBoundary>
  );
}
```

### For React Native Applications

```bash
npm install @prismatics/react-native
```

```tsx
import { PerformanceBoundary } from '@prismatics/react-native';

function App() {
  return (
    <PerformanceBoundary
      fallback={<SimpleList />}
      config={{ thresholds: { fps: 30 } }}
    >
      <ComplexList />
    </PerformanceBoundary>
  );
}
```

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
- [Contributing Guide](./CONTRIBUTING.md)
- [Examples](./examples)

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT © Prismatics