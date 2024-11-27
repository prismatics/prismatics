import React from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { usePerformance } from '@prismatics/react-native';

const PerformanceMonitorExample = () => {
    const { metrics } = usePerformance({
        sampleRate: 500,
        adaptiveMonitoring: true,
    });

    const animatedValue = React.useRef(new Animated.Value(0)).current;

    // Create some load to demonstrate performance monitoring
    React.useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, []);

    const getPerformanceStatus = (fps: number) => {
        if (fps >= 55) return { text: 'Excellent', color: '#4caf50' };
        if (fps >= 45) return { text: 'Good', color: '#8bc34a' };
        if (fps >= 30) return { text: 'Fair', color: '#ffc107' };
        return { text: 'Poor', color: '#f44336' };
    };

    const status = getPerformanceStatus(metrics?.fps || 0);

    return (
        <View style={styles.container}>
            <View style={styles.metricsContainer}>
                <Text style={styles.title}>Performance Metrics</Text>

                <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>FPS</Text>
                    <Text style={styles.metricValue}>{metrics?.fps.toFixed(1) || 'N/A'}</Text>
                    <Text style={[styles.status, { color: status.color }]}>
                        {status.text}
                    </Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Memory Usage</Text>
                    <Text style={styles.metricValue}>
                        {metrics?.memory.percentage.toFixed(1)}%
                    </Text>

                    {metrics?.memory.used && (
                        <Text style={styles.memoryDetails}>
                            {(metrics?.memory.used / (1024 * 1024)).toFixed(1)} MB used
                        </Text>
                    )}

                </View>

                {metrics?.batteryInfo && (
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Battery</Text>
                        <Text style={styles.metricValue}>
                            {metrics.batteryInfo.level.toFixed(1)}%
                        </Text>
                        <Text style={styles.batteryStatus}>
                            {metrics.batteryInfo.isCharging ? 'Charging' : 'Not Charging'}
                        </Text>
                    </View>
                )}
            </View>

            {/* Animation to create some load */}
            <Animated.View
                style={[
                    styles.animatedBox,
                    {
                        transform: [
                            {
                                scale: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 1.5],
                                }),
                            },
                            {
                                rotate: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                }),
                            },
                        ],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    metricsContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    metricCard: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    metricLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    status: {
        fontSize: 16,
        fontWeight: '500',
    },
    memoryDetails: {
        fontSize: 14,
        color: '#666',
    },
    batteryStatus: {
        fontSize: 14,
        color: '#666',
    },
    animatedBox: {
        width: 100,
        height: 100,
        backgroundColor: '#3498db',
        alignSelf: 'center',
    },
});

export default PerformanceMonitorExample;