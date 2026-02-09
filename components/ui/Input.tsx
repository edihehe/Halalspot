import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="label" color={COLORS.textLight} style={styles.label}>
          {label}
        </Typography>
      )}
      <View style={[styles.inputWrapper, !!error && styles.errorInput]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textLight}
          {...props}
        />
      </View>
      {error && (
        <Typography variant="caption" color={COLORS.error} style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: COLORS.text,
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  errorText: {
    marginTop: 4,
  },
});
