import { RestaurantCard } from '@/components/RestaurantCard';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { fetchRestaurants } from '@/services/api';
import { CATEGORIES, RESTAURANTS } from '@/services/mockData';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [city, setCity] = useState<string>('San Francisco, CA');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('1'); // Default to 'All'
  const [restaurants, setRestaurants] = useState(RESTAURANTS);
  const [sortedRestaurants, setSortedRestaurants] = useState(RESTAURANTS);

  useEffect(() => {
    (async () => {
      try {
        // Fetch data from API (or DB directly via API route)
        const data = await fetchRestaurants();
        setRestaurants(data);
        setSortedRestaurants(data);

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Reverse Geocoding
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address.length > 0) {
          const { city, region } = address[0];
          setCity(`${city}, ${region}`);
        }

        // Simple Distance Calculation
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 3958.8; // Radius of Earth in miles
          const dLat = (lat2 - lat1) * (Math.PI / 180);
          const dLon = (lon2 - lon1) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        // Calculate distances for ALL fetched restaurants initially
        const withDistances = data.map((restaurant) => ({
          ...restaurant,
          distanceVal: calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            restaurant.latitude,
            restaurant.longitude
          ),
          distance: `${calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            restaurant.latitude,
            restaurant.longitude
          ).toFixed(1)} mi`,
        })).sort((a, b) => (a.distanceVal || 0) - (b.distanceVal || 0));

        setRestaurants(withDistances as any);
        setSortedRestaurants(withDistances as any);
      } catch (error) {
        console.warn('Location error:', error);
        setErrorMsg('Could not fetch location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter effect
  useEffect(() => {
    if (selectedCategory === '1') {
      setSortedRestaurants(restaurants);
    } else {
      const categoryName = CATEGORIES.find((c) => c.id === selectedCategory)?.name;
      const filtered = restaurants.filter((r) => {
        return r.cuisine.includes(categoryName || '');
      });
      setSortedRestaurants(filtered);
    }
  }, [selectedCategory, restaurants]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Typography variant="label" color={COLORS.primary}>
            Location
          </Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MapPin size={16} color={COLORS.text} style={{ marginRight: 4 }} />
            <Typography variant="h3">{loading ? 'Locating...' : city}</Typography>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Input placeholder="Search restaurants, cuisines..." />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Categories */}
        <View style={styles.section}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
            renderItem={({ item }) => {
              const isSelected = selectedCategory === item.id;
              return (
                <TouchableOpacity onPress={() => setSelectedCategory(item.id)}>
                  <View
                    style={[
                      styles.categoryPill,
                      isSelected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                    ]}
                  >
                    <Typography variant="label" color={isSelected ? '#FFF' : COLORS.textLight}>
                      {item.name}
                    </Typography>
                  </View>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ width: SPACING.sm }} />}
          />
        </View>

        {/* Featured */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="h2">Featured</Typography>
            <Typography variant="label" color={COLORS.primary}>
              See All
            </Typography>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={restaurants.slice(0, 5)} // Just show top 5 nearest as featured for now or keep random
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
            renderItem={({ item }) => (
              <View style={{ width: 280, marginRight: SPACING.md }}>
                <RestaurantCard
                  id={item.id}
                  name={item.name}
                  cuisine={item.cuisine}
                  rating={item.rating}
                  reviews={item.reviews}
                  image={item.image}
                  distance={item.distance || '1.2 mi'}
                  price={item.price}
                />
              </View>
            )}
          />
        </View>

        {/* Near You */}
        <View style={[styles.section, { paddingHorizontal: SPACING.lg, marginBottom: 80 }]}>
          <Typography variant="h2" style={{ marginBottom: SPACING.md }}>
            Near You
          </Typography>
          {sortedRestaurants.map((item: any) => (
            <RestaurantCard
              key={item.id}
              id={item.id}
              name={item.name}
              cuisine={item.cuisine}
              rating={item.rating}
              reviews={item.reviews}
              image={item.image}
              distance={item.distance || '1.5 mi'}
              price={item.price}
            />
          ))}
        </View>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.medium,
    zIndex: 10,
  },
  searchContainer: {
    marginTop: SPACING.md,
  },
  scrollContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  section: {
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    ...SHADOWS.small,
  },
});
