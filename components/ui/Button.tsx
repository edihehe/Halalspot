import { COLORS, RADIUS, SHADOWS } from '@/constants/theme';
import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  style,
  disabled,
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary };
      case 'secondary':
        return { backgroundColor: COLORS.secondary };
      default:
        return { backgroundColor: COLORS.primary };
    }
  };

  const getSizing = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'lg':
        return { paddingVertical: 14, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 10, paddingHorizontal: 18 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getVariantStyle(),
        getSizing(),
        disabled && styles.disabled,
        style as ViewStyle,
      ]}
      activeOpacity={0.8}
      disabled={disabled}
      {...props}
    >
      <Typography
        variant={size === 'sm' ? 'label' : 'h3'}
        color={variant === 'outline' ? COLORS.primary : '#FFF'}
      >
        {title}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  disabled: {
    opacity: 0.55,
  },
});
