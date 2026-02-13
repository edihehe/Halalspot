import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="label" color={COLORS.textLight} style={styles.label}>
          {label}
        </Typography>
      )}
      <View
        style={[
          styles.inputWrapper,
          props.multiline && styles.multilineWrapper,
          isFocused && styles.focusedInput,
          !!error && styles.errorInput,
        ]}
      >
        <TextInput
          style={[styles.input, props.multiline && styles.multilineInput, style]}
          placeholderTextColor={COLORS.textLight}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
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
    width: '100%',
  },
  label: {
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    backgroundColor: COLORS.formBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: COLORS.text,
  },
  multilineWrapper: {
    height: 'auto',
    minHeight: 120,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  focusedInput: {
    borderColor: COLORS.focus,
    shadowColor: COLORS.focus,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 1,
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  errorText: {
    marginTop: 4,
  },
});
