import { COLORS } from '@/constants/theme';
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption';
  color?: string;
  weight?: '400' | '500' | '600' | '700' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = COLORS.text,
  weight,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return { fontSize: 24, fontWeight: '700', lineHeight: 32 };
      case 'h2':
        return { fontSize: 20, fontWeight: '600', lineHeight: 28 };
      case 'h3':
        return { fontSize: 16, fontWeight: '600', lineHeight: 24 };
      case 'label':
        return { fontSize: 13, fontWeight: '500', lineHeight: 18, textTransform: 'uppercase', letterSpacing: 0.5 };
      case 'caption':
        return { fontSize: 11, fontWeight: '400', lineHeight: 16 };
      default:
        return { fontSize: 14, fontWeight: '400', lineHeight: 20 };
    }
  };

  return (
    <Text
      style={[
        getVariantStyle(),
        { color, textAlign: align },
        weight ? { fontWeight: weight } : {},
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
