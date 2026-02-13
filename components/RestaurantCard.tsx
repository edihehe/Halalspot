import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Typography } from './ui/Typography';

interface RestaurantProps {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviews: number;
  image: string;
  distance?: string;
  verified?: boolean;
  price?: string;
  pickupTime?: string;
}

export const RestaurantCard: React.FC<RestaurantProps> = ({
  id,
  name,
  cuisine,
  rating,
  reviews,
  image,
  distance = '1.2 mi',
  verified = true,
  price = '$$',
  pickupTime = '20-30 min',
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/restaurant/${id}`);
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <Card variant="elevated" padding={0} style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          {verified && (
            <View style={styles.badgeContainer}>
              <Badge label="VERIFIED" variant="success" />
            </View>
          )}
          <View style={styles.priceBadge}>
            <Typography variant="caption" color="#FFF" weight="700">{price}</Typography>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Typography variant="h3" numberOfLines={1} style={styles.name}>
                {name}
              </Typography>
              <Typography variant="body" color={COLORS.textLight} numberOfLines={1}>
                {cuisine}
              </Typography>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={12} color="#FFF" fill="#FFF" />
              <Typography variant="label" color="#FFF" weight="700" style={{ marginLeft: 2 }}>
                {rating}
              </Typography>
            </View>
          </View>

          <View style={styles.footer}>
            <Typography variant="caption" color={COLORS.text} weight="600">
              {pickupTime}
            </Typography>
            <View style={styles.dot} />
            <Typography variant="caption" color={COLORS.textLight}>
              {distance}
            </Typography>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'visible', // Allow shadow to bleed
  },
  imageContainer: {
    position: 'relative',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.inner,
  },
  image: {
    width: '100%',
    height: 160,
  },
  badgeContainer: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
  },
  priceBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    flex: 1,
    fontSize: 18,
    color: COLORS.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
    ...SHADOWS.small,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textLight,
    marginHorizontal: SPACING.sm,
  },
});
