
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Building2, CheckCircle2, MapPinned, Sparkles, UserRound } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RequestForm = {
  name: string;
  cuisine: string;
  address: string;
  description: string;
  email: string;
};

type FormErrors = Partial<Record<keyof RequestForm, string>>;

const initialFormData: RequestForm = {
  name: '',
  cuisine: '',
  address: '',
  description: '',
  email: '',
};

export default function RequestScreen() {
  const insets = useSafeAreaInsets();
  const [isBusiness, setIsBusiness] = useState(false);
  const [formData, setFormData] = useState<RequestForm>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key: keyof RequestForm, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
    if (statusMessage) {
      setStatusMessage(null);
    }
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Restaurant name is required.';
    if (!formData.cuisine.trim()) nextErrors.cuisine = 'Cuisine type is required.';
    if (!formData.address.trim()) nextErrors.address = 'Address is required.';

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        nextErrors.email = 'Enter a valid email address.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setStatusMessage(null);
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isBusiness,
        }),
      });

      if (response.ok) {
        setStatusMessage({
          type: 'success',
          text: 'Thanks for the suggestion. We will review this spot shortly.',
        });
        setFormData(initialFormData);
        setErrors({});
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Could not submit your request. Please try again in a moment.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.bgAccentTop} />
      <View style={styles.bgAccentBottom} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + SPACING.lg, paddingBottom: insets.bottom + 130 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Sparkles size={14} color={COLORS.primary} />
            <Typography variant="caption" color={COLORS.primary} weight="600">
              Community Powered
            </Typography>
          </View>
          <Typography variant="h1" style={styles.title}>Suggest a Halal Spot</Typography>
          <Typography variant="body" color={COLORS.textLight}>
            Share great restaurants so more people can discover trusted halal options nearby.
          </Typography>
        </View>

        <Card style={styles.formCard} variant="elevated">
          <Typography variant="h3" style={styles.sectionTitle}>Who are you?</Typography>
          <View style={styles.roleGrid}>
            <Pressable
              onPress={() => setIsBusiness(false)}
              style={[styles.roleCard, !isBusiness && styles.roleCardActive]}
              accessibilityRole="button"
              accessibilityLabel="Select community member"
            >
              <UserRound size={18} color={!isBusiness ? COLORS.primary : COLORS.textLight} />
              <View style={styles.roleCopy}>
                <Typography variant="h3" color={!isBusiness ? COLORS.primary : COLORS.text}>
                  Community Member
                </Typography>
                <Typography variant="caption" color={COLORS.textLight}>
                  Suggesting a place you discovered
                </Typography>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setIsBusiness(true)}
              style={[styles.roleCard, isBusiness && styles.roleCardActive]}
              accessibilityRole="button"
              accessibilityLabel="Select business owner"
            >
              <Building2 size={18} color={isBusiness ? COLORS.primary : COLORS.textLight} />
              <View style={styles.roleCopy}>
                <Typography variant="h3" color={isBusiness ? COLORS.primary : COLORS.text}>
                  Business Owner
                </Typography>
                <Typography variant="caption" color={COLORS.textLight}>
                  Suggesting your own restaurant
                </Typography>
              </View>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Restaurant Name *</Typography>
            <Input
              placeholder="e.g. The Halal Guys"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              error={errors.name}
              accessibilityLabel="Restaurant name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Cuisine Type *</Typography>
            <Input
              placeholder="e.g. Afghan, Pakistani, Yemeni"
              value={formData.cuisine}
              onChangeText={(text) => handleInputChange('cuisine', text)}
              error={errors.cuisine}
              accessibilityLabel="Cuisine type"
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Full Address *</Typography>
            <Input
              placeholder="123 Main St, City, State, ZIP" 
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              error={errors.address}
              accessibilityLabel="Full address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Description (Optional)</Typography>
            <Input
              placeholder="Tell us what makes this spot worth adding..."
              multiline
              numberOfLines={5}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              maxLength={300}
              accessibilityLabel="Description"
            />
            <Typography variant="caption" color={COLORS.textLight} style={styles.charCount}>
              {formData.description.length}/300
            </Typography>
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Your Email (Optional)</Typography>
            <Input
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              error={errors.email}
              accessibilityLabel="Email address"
            />
          </View>

          <View style={styles.helperCard}>
            <MapPinned size={16} color={COLORS.primary} />
            <Typography variant="caption" color={COLORS.textLight} style={styles.helperText}>
              We verify each request before publishing to keep listings reliable.
            </Typography>
          </View>

          {statusMessage && (
            <View
              style={[
                styles.statusBanner,
                statusMessage.type === 'success' ? styles.successBanner : styles.errorBanner,
              ]}
            >
              {statusMessage.type === 'success' && <CheckCircle2 size={16} color={COLORS.success} />}
              <Typography
                variant="caption"
                color={statusMessage.type === 'success' ? COLORS.success : COLORS.error}
                style={styles.statusText}
              >
                {statusMessage.text}
              </Typography>
            </View>
          )}

          <Button
            title={loading ? 'Submitting...' : 'Submit Suggestion'}
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitButton}
            disabled={loading}
            accessibilityLabel="Submit suggestion"
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bgAccentTop: {
    position: 'absolute',
    top: -90,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: '#D6F2E6',
  },
  bgAccentBottom: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: '#EAF8F1',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#EAF8F1',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    marginBottom: SPACING.sm,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  formCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  roleGrid: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.formBackground,
  },
  roleCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#EAF8F1',
  },
  roleCopy: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.xs,
    color: COLORS.text,
  },
  charCount: {
    marginTop: SPACING.xs,
    textAlign: 'right',
  },
  helperCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: '#F1F9F5',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEFE4',
  },
  helperText: {
    flex: 1,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  successBanner: {
    backgroundColor: '#ECFDF3',
    borderColor: '#BBF7D0',
  },
  errorBanner: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  statusText: {
    flex: 1,
  },
  submitButton: {
    marginTop: SPACING.sm,
    height: 52,
  },
});
