import { Restaurant } from '@/services/mockData';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { RestaurantCard } from './RestaurantCard';
import { Typography } from './ui/Typography';

interface RestaurantCarouselProps {
  title: string;
  data: Restaurant[];
  onSeeAll?: () => void;
}

export const RestaurantCarousel: React.FC<RestaurantCarouselProps> = ({
  title,
  data,
  onSeeAll,
}) => {
  if (data.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>{title}</Typography>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Typography variant="label" color={COLORS.primary}>See All</Typography>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <RestaurantCard
              id={item.id}
              name={item.name}
              cuisine={item.cuisine}
              rating={item.rating}
              reviews={item.reviews}
              image={item.image}
              distance={item.distance || '1.2 mi'}
              price={item.price || '$$'}
              verified={item.verified}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  cardWrapper: {
    width: 280,
    marginRight: SPACING.md,
  },
});
