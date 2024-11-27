import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { usePerformance } from '@prismatics/react-native';

const BatteryAwareExample = () => {
    const { metrics, isBatteryMonitoringAvailable } = usePerformance({
        enableBatteryMonitoring: true,
        sampleRate: 2000,
    });

    const getBatteryStatus = () => {
        if (!isBatteryMonitoringAvailable) {
            return 'Battery monitoring is only available on iOS';
        }

        if (!metrics?.batteryInfo) {
            return 'Loading battery information...';
        }

        const { level, isLowPowerMode, isCharging } = metrics.batteryInfo;
        return `
      Battery Level: ${level.toFixed(1)}%
      Power Mode: ${isLowPowerMode ? 'Low' : 'Normal'}
      Status: ${isCharging ? 'Charging' : 'Not Charging'}
    `;
    };

    const RenderContent = () => {
        if (isBatteryMonitoringAvailable && metrics?.batteryInfo?.isLowPowerMode) {
            return (
                <View style={styles.powerSavingMode}>
                    <Text style={styles.powerSavingText}>Power Saving Mode Active</Text>
                    <Text style={styles.powerSavingDesc}>
                        App is running in reduced functionality mode to conserve battery
                    </Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.fullFeatures}>
                <Text style={styles.title}>Full Features Enabled</Text>
                {/* Add your full-featured content here */}
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.statusCard}>
                <Text style={styles.statusTitle}>Device Status</Text>
                <Text style={styles.statusText}>{getBatteryStatus()}</Text>
            </View>
            <RenderContent />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    statusCard: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    statusText: {
        fontSize: 14,
        color: '#666',
    },
    powerSavingMode: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff9c4',
        padding: 20,
        borderRadius: 10,
    },
    powerSavingText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    powerSavingDesc: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
    fullFeatures: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default BatteryAwareExample;