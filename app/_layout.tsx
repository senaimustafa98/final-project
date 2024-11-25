import React from 'react';
import { Tabs, useSegments } from 'expo-router';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export default function RootLayout() {
  const segments = useSegments();

  const isAuthScreen = segments[0] === '(auth)';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007aff',
        headerShown: false,
        tabBarStyle: isAuthScreen
          ? { display: 'none' }
          : { backgroundColor: 'rgba(0, 0, 0, 0.9)', marginTop: 0 },
      }}
    >
      <Tabs.Screen
        name="(tabs)/profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/workout"
        options={{
          tabBarLabel: 'Workout',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="dumbbell" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/history"
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="history" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/start-workout"
        options={{ tabBarItemStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="(tabs)/start-workout-template"
        options={{ tabBarItemStyle: { display: 'none' } }}
      />

      <Tabs.Screen
        name="(auth)/login"
        options={{ tabBarItemStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="(auth)/register"
        options={{ tabBarItemStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="(auth)/index"
        options={{ tabBarItemStyle: { display: 'none' } }}
      />
    </Tabs>
  );
}
