import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Platform } from 'react-native';
import { PerformanceBoundary } from '@prismatics/react-native';

const ComplexListItem = memo(({ item }: { item: any }) => (
    <View style={styles.complexItem}>
        <View style={styles.avatar} />
        <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.stats}>
                <Text style={styles.stat}>Views: {item.views}</Text>
                <Text style={styles.stat}>Likes: {item.likes}</Text>
                <Text style={styles.stat}>Comments: {item.comments}</Text>
            </View>
            <View style={styles.tags}>
                {item.tags.map((tag: string) => (
                    <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>
        </View>
    </View>
));

const SimpleListItem = memo(({ item }: { item: any }) => (
    <View style={styles.simpleItem}>
        <Text style={styles.simpleTitle}>{item.title}</Text>
        <Text numberOfLines={1} style={styles.simpleDescription}>
            {item.description}
        </Text>
    </View>
));


const generateData = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
        id: i,
        title: `Item ${i}`,
        description: `This is a detailed description for item ${i} that contains multiple lines of text to demonstrate the difference between complex and simple views.`,
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1),
    }));

export default function HeavyListExample() {
    const [data] = useState(() => generateData(1000));

    const ComplexList = useCallback(() => (
        <FlatList
            data={data}
            renderItem={({ item }) => <ComplexListItem item={item} />}
            keyExtractor={item => item.id.toString()}
        />
    ), [data]);

    const SimpleList = useCallback(() => (
        <FlatList
            data={data}
            renderItem={({ item }) => <SimpleListItem item={item} />}
            keyExtractor={item => item.id.toString()}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
        />
    ), [data]);

    return (
        <View style={styles.container}>
            <PerformanceBoundary
                fallback={<SimpleList />}
                config={{
                    thresholds: {
                        fps: 45,
                        memoryPercentage: 70,
                    },
                    sampleRate: 1000,
                }}
                onPerformanceChange={(isLow, metrics) => {
                    console.log('Performance changed:', { isLow, metrics });
                }}
            >
                <ComplexList />
            </PerformanceBoundary>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    complexItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ddd',
        marginRight: 15,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    stats: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    stat: {
        marginRight: 15,
        fontSize: 12,
        color: '#888',
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 5,
        marginBottom: 5,
    },
    tagText: {
        fontSize: 12,
        color: '#666',
    },
    simpleItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    simpleTitle: {
        fontSize: 16,
        marginBottom: 4,
    },
    simpleDescription: {
        fontSize: 14,
        color: '#666',
    },
});