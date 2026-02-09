import { Typography } from '@/components/ui/Typography';
import { COLORS, SPACING } from '@/constants/theme';
import { Stack } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function MapWebScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Map View' }} />
      <MapPin size={48} color={COLORS.primary} />
      <Typography variant="h2" style={{ marginTop: SPACING.md }}>
        Map View is not available on Web
      </Typography>
      <Typography variant="body" color={COLORS.textLight}>
        Please use a mobile device or simulator.
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
});
