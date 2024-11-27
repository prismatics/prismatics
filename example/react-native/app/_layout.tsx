import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: '600',
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Performance Examples',
          }}
        />
        <Stack.Screen
          name="heavy-list"
          options={{
            title: 'Heavy List',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="battery-aware"
          options={{
            title: 'Battery Aware',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="performance-monitor"
          options={{
            title: 'Performance Monitor',
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}