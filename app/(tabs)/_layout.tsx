import { Tabs } from 'expo-router';
import { Compass, Map, PlusCircle } from 'lucide-react-native';
import React from 'react';
import { useColorScheme } from '../../components/useColorScheme';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopColor: 'transparent',
          height: 90,
          paddingTop: SPACING.sm,
          paddingBottom: SPACING.lg,
          ...SHADOWS.large,
          position: 'absolute',
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: 'Request',
          tabBarIcon: ({ color }) => <PlusCircle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
