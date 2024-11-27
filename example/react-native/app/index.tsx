import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { usePerformance } from '@prismatics/react-native';

interface ExampleRoute {
  title: string;
  description: string;
  route: any;
}

const examples: ExampleRoute[] = [
  {
    title: "Heavy List Example",
    description: "Demonstrates performance boundary with complex list rendering and fallback to simple list",
    route: "heavy-list"
  },
  {
    title: "Battery Aware Example",
    description: "Shows how to adapt your app based on device battery status (iOS focused)",
    route: "battery-aware"
  },
  {
    title: "Performance Monitor",
    description: "Real-time monitoring of FPS, memory usage, and device metrics",
    route: "performance-monitor"
  }
];

export default function Home() {
  const router = useRouter();
  const { metrics, isBatteryMonitoringAvailable } = usePerformance({
    sampleRate: 1000,
    enableBatteryMonitoring: true,
  });

  const renderMetricsCard = () => (
    <View style={styles.metricsCard}>
      <Text style={styles.metricsTitle}>Current Device Metrics</Text>
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>FPS:</Text>
        <Text style={styles.metricValue}>{metrics?.fps.toFixed(1) || 'N/A'}</Text>
      </View>
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Memory:</Text>
        <Text style={styles.metricValue}>
          {metrics?.memory.percentage.toFixed(1)}% used
        </Text>
      </View>
      {isBatteryMonitoringAvailable && metrics?.batteryInfo && (
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Battery:</Text>
          <Text style={styles.metricValue}>
            {metrics.batteryInfo.level.toFixed(1)}%
            {metrics.batteryInfo.isCharging ? ' (Charging)' : ''}
          </Text>
        </View>
      )}
    </View>
  );

  const renderExampleCard = ({ title, description, route }: ExampleRoute) => (
    <Pressable
      key={route}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
      onPress={() => router.push(route)}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Performance Examples</Text>
      {renderMetricsCard()}

      <Text style={styles.sectionTitle}>Available Examples</Text>
      <View style={styles.cardsContainer}>
        {examples.map(renderExampleCard)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  metricsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPressed: {
    backgroundColor: '#f5f5f5',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});