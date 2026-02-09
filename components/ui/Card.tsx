import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'flat' | 'elevated' | 'outline';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  variant = 'flat',
  padding = SPACING.md,
  style,
  children,
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return { 
          ...SHADOWS.medium, 
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.02)' 
        };
      case 'outline':
        return { 
          borderWidth: 1, 
          borderColor: COLORS.border, 
          backgroundColor: COLORS.surface 
        };
      default:
        return { backgroundColor: COLORS.surface };
    }
  };

  return (
    <View style={[styles.base, getVariantStyle(), { padding }, style as ViewStyle]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
});
