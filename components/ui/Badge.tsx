import { COLORS, RADIUS } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Typography } from './Typography';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'info', style }) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: COLORS.success + '20', color: COLORS.success };
      case 'warning':
        return { backgroundColor: COLORS.warning + '20', color: COLORS.warning };
      case 'error':
        return { backgroundColor: COLORS.error + '20', color: COLORS.error };
      default:
        return { backgroundColor: COLORS.primary + '20', color: COLORS.primary };
    }
  };

  const colors = getVariantStyle();

  return (
    <View style={[styles.badge, { backgroundColor: colors.backgroundColor }, style]}>
      <Typography variant="caption" weight="bold" color={colors.color}>
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
});
