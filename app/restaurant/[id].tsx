import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { getRestaurantById } from '@/services/api';
import { Restaurant } from '@/services/mockData';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, ChevronLeft, Clock, Heart, MapPin, Phone, Share2, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          const data = await getRestaurantById(id as string);
          setRestaurant(data);
        } catch (error) {
          console.error('Detail fetch error:', error);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Typography variant="body">Loading...</Typography>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Typography variant="h2">Restaurant not found.</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.image} />
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <ChevronLeft size={24} color={COLORS.text} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[styles.iconButton, { marginRight: SPACING.sm }]}>
                <Share2 size={24} color={COLORS.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Heart size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Typography variant="h1" style={styles.title}>
                {restaurant.name}
              </Typography>
              <Typography variant="body" color={COLORS.textLight}>
                {restaurant.cuisine} • {restaurant.price || '$$'}
              </Typography>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={16} color="#FFF" fill="#FFF" />
              <Typography variant="h3" color="#FFF" style={{ marginLeft: 4 }}>
                {restaurant.rating}
              </Typography>
            </View>
          </View>

          {/* Verification Box - The Core Value Prop */}
          <View style={styles.verificationBox}>
            <View style={styles.verificationHeader}>
              <CheckCircle size={20} color={COLORS.primary} fill={COLORS.surface} />
              <Typography variant="h3" style={{ marginLeft: SPACING.sm }}>
                Verified Halal
              </Typography>
            </View>
            <Typography variant="body" style={{ marginTop: SPACING.sm }}>
              Verified by{' '}
              <Typography variant="body" weight="600">
                {restaurant.verifiedBy || 'Halal Spot Team'}
              </Typography>{' '}
              on {restaurant.verificationDate?.toString() || 'Recently'}.
            </Typography>
            <View style={styles.tagsContainer}>
              {restaurant.features?.map((feature, index) => (
                <Badge
                  key={index}
                  label={feature}
                  variant="success"
                  style={{ marginRight: SPACING.sm, marginTop: SPACING.sm }}
                />
              ))}
            </View>
          </View>

          {/* Info Rows */}
          <View style={styles.infoRow}>
            <Clock size={20} color={COLORS.textLight} />
            <Typography variant="body" style={{ marginLeft: SPACING.md }}>
              {restaurant.status || 'Open'} • Closes 10 PM
            </Typography>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={20} color={COLORS.textLight} />
            <Typography variant="body" style={{ marginLeft: SPACING.md, flex: 1 }}>
              {restaurant.address || 'Address not listed'}
            </Typography>
          </View>
          <View style={styles.infoRow}>
            <Phone size={20} color={COLORS.textLight} />
            <Typography variant="body" style={{ marginLeft: SPACING.md }}>
              +1 (555) 123-4567
            </Typography>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Typography variant="h3" style={{ marginBottom: SPACING.sm }}>
              About
            </Typography>
            <Typography variant="body" color={COLORS.text} style={{ lineHeight: 24 }}>
              {restaurant.description || 'No description available.'}
            </Typography>
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <Button
          title="Order Now"
          onPress={() => {}}
          size="lg"
          style={{ width: '100%' }} // Full width button
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 350,
    width: '100%',
    position: 'relative',
    ...SHADOWS.large,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerButtons: {
    position: 'absolute',
    top: 60,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -30,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: SPACING.xs,
  },
  ratingBadge: {
    backgroundColor: COLORS.warning,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  verificationBox: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...SHADOWS.medium,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  section: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: SPACING.lg,
    paddingBottom: SPACING.xl + 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    ...SHADOWS.large,
  },
});
