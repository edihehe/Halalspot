
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { COLORS, SHADOWS, SPACING } from '@/constants/theme';
import { Building2, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    View
} from 'react-native';

export default function RequestScreen() {
  const [isBusiness, setIsBusiness] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    address: '',
    description: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.cuisine || !formData.address) {
      Alert.alert('Missing Fields', 'Please fill in the restaurant name, cuisine, and address.');
      return;
    }

    setLoading(true);
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
        Alert.alert('Success', 'Thank you for your suggestion! We will review it soon.');
        setFormData({
          name: '',
          cuisine: '',
          address: '',
          description: '',
          email: '',
        });
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>Suggest a Spot</Typography>
          <Typography variant="body" color={COLORS.textLight}>
            Help us grow the community by suggesting new halal restaurants.
          </Typography>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.toggleContainer}>
            <View style={styles.toggleText}>
              <Typography variant="h3">{isBusiness ? 'Business Owner' : 'Community Member'}</Typography>
              <Typography variant="caption" color={COLORS.textLight}>
                {isBusiness ? "I am suggesting my own business" : "I am suggesting a spot I found"}
              </Typography>
            </View>
            <View style={styles.iconSwitch}>
               {isBusiness ? <Building2 size={24} color={COLORS.primary} /> : <User size={24} color={COLORS.primary} />}
               <Switch
                 value={isBusiness}
                 onValueChange={setIsBusiness}
                 trackColor={{ false: COLORS.border, true: COLORS.primary + '50' }}
                 thumbColor={isBusiness ? COLORS.primary : '#f4f3f4'}
                 style={{ marginLeft: 8 }}
               />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Restaurant Name *</Typography>
            <Input 
              placeholder="e.g. Halal Guys" 
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Cuisine Type *</Typography>
            <Input 
              placeholder="e.g. Middle Eastern, Pakistani" 
              value={formData.cuisine}
              onChangeText={(text) => handleInputChange('cuisine', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Full Address *</Typography>
            <Input 
              placeholder="123 Main St, City, State, ZIP" 
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Description (Optional)</Typography>
            <Input 
              placeholder="Tell us why this place is great..." 
              multiline
              numberOfLines={4}
              style={styles.textArea}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Your Email (Optional)</Typography>
            <Input 
              placeholder="We might contact you for details" 
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>

          <Button 
            title={loading ? "Submitting..." : "Submit Suggestion"}
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitButton}
            disabled={loading}
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
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  formCard: {
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toggleText: {
    flex: 1,
  },
  iconSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    marginBottom: SPACING.xs,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.sm,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});
