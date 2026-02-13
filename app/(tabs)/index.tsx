import { RestaurantCarousel } from '@/components/RestaurantCarousel';
import { Typography } from '@/components/ui/Typography';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { fetchRestaurants } from '@/services/api';
import { CATEGORIES } from '@/services/mockData';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { Bell, MapPin, Search } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [city, setCity] = useState<string>('Philadelphia, PA');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('1'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRestaurants();
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        let userLocation = null;
        if (status === 'granted') {
          userLocation = await Location.getCurrentPositionAsync({});
          setLocation(userLocation);

          let address = await Location.reverseGeocodeAsync({
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          });

          if (address.length > 0) {
            const { city, region } = address[0];
            setCity(`${city}, ${region}`);
          }
        }

        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 3958.8;
          const dLat = (lat2 - lat1) * (Math.PI / 180);
          const dLon = (lon2 - lon1) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        const withDistances = data.map((restaurant) => {
          let dist = 1.2;
          if (userLocation) {
            dist = calculateDistance(
              userLocation.coords.latitude,
              userLocation.coords.longitude,
              restaurant.latitude,
              restaurant.longitude
            );
          }
          return {
            ...restaurant,
            distanceVal: dist,
            distance: `${dist.toFixed(1)} mi`,
          };
        });

        setRestaurants(withDistances);
      } catch (error) {
        console.warn('Init error:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredRestaurants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const selectedCategoryName = CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'All';

    return restaurants.filter((restaurant) => {
      const matchesCategory =
        selectedCategoryName === 'All' ||
        restaurant.cuisine.toLowerCase().includes(selectedCategoryName.toLowerCase());

      const matchesSearch =
        !q ||
        restaurant.name.toLowerCase().includes(q) ||
        restaurant.cuisine.toLowerCase().includes(q) ||
        restaurant.address.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [restaurants, searchQuery, selectedCategory]);

  const nearYou = useMemo(() => 
    [...filteredRestaurants].sort((a, b) => a.distanceVal - b.distanceVal).slice(0, 6)
  , [filteredRestaurants]);

  const topRated = useMemo(() => 
    filteredRestaurants.filter(r => r.rating >= 4.7).sort((a, b) => b.rating - a.rating)
  , [filteredRestaurants]);

  const fastPickup = useMemo(() => 
    filteredRestaurants.filter(r => {
      const timeMatch = r.pickupTime?.match(/(\d+)/);
      return timeMatch && parseInt(timeMatch[1]) <= 15;
    })
  , [filteredRestaurants]);

  const newSpots = useMemo(() => 
    [...filteredRestaurants].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  , [filteredRestaurants]);

  const openNow = useMemo(() => 
    filteredRestaurants.filter(r => r.status === 'Open')
  , [filteredRestaurants]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Typography variant="label" color={COLORS.textLight}>
              ASAP • {loading ? 'Locating...' : city}
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MapPin size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
              <Typography variant="h3" weight="bold">Deliver Now</Typography>
            </View>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <Bell size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.textLight} style={{ marginRight: SPACING.sm }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search restaurants, cuisines..."
            placeholderTextColor={COLORS.textLight}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        {/* Categories Carousel */}
        <View style={styles.categoriesSection}>
          <FlatList
            horizontal
            nestedScrollEnabled
            directionalLockEnabled
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
            renderItem={({ item }) => {
              const isSelected = selectedCategory === item.id;
              return (
                <TouchableOpacity onPress={() => setSelectedCategory(item.id)} style={styles.categoryItem}>
                  <View
                    style={[
                      styles.categoryPill,
                      isSelected && { backgroundColor: COLORS.primary },
                    ]}
                  >
                    <Typography variant="label" color={isSelected ? '#FFF' : COLORS.text} weight="700">
                      {item.name}
                    </Typography>
                  </View>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ width: SPACING.sm }} />}
          />
        </View>

        {/* Dynamic Carousel Rows */}
        <RestaurantCarousel title="Halal Near You" data={nearYou} onSeeAll={() => {}} />
        
        <RestaurantCarousel title="Top Rated" data={topRated} onSeeAll={() => {}} />

        <RestaurantCarousel title="Fast Pickup" data={fastPickup} onSeeAll={() => {}} />

        <RestaurantCarousel title="New on Halal Spot" data={newSpots} onSeeAll={() => {}} />

        <RestaurantCarousel title="Open Now" data={openNow} onSeeAll={() => {}} />

        {filteredRestaurants.length === 0 && (
          <View style={styles.noResults}>
            <Typography variant="h3" align="center">
              No restaurants found
            </Typography>
            <Typography variant="body" color={COLORS.textLight} align="center" style={{ marginTop: 6 }}>
              Try a different cuisine, name, or address.
            </Typography>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  scrollContent: {
    paddingVertical: SPACING.md,
  },
  categoriesSection: {
    marginBottom: SPACING.md,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noResults: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
