import { RestaurantCard } from '@/components/RestaurantCard';
import { Typography } from '@/components/ui/Typography';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { fetchRestaurants } from '@/services/api';
import { Restaurant } from '@/services/mockData';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { LocateFixed, Navigation } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, Linking, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Map fetch error:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredRestaurants = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return restaurants;
    return restaurants.filter((restaurant) => {
      return (
        restaurant.name.toLowerCase().includes(q) ||
        restaurant.cuisine.toLowerCase().includes(q) ||
        restaurant.address.toLowerCase().includes(q)
      );
    });
  }, [restaurants, query]);

  const jumpToRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    mapRef.current?.animateToRegion(
      {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      350
    );
  };

  const centerOnUser = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Enable location access to center the map on your position.');
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion(
        {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        },
        350
      );
    } catch (error) {
      Alert.alert('Location Error', 'Could not get your current location.');
    }
  };

  const openDirections = async () => {
    if (!selectedRestaurant) {
      Alert.alert('Select a Restaurant', 'Tap a marker first to open directions.');
      return;
    }

    const destination = `${selectedRestaurant.latitude},${selectedRestaurant.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Unable to Open Maps', 'No supported maps app found.');
      }
    } catch {
      Alert.alert('Unable to Open Maps', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 39.9526,
          longitude: -75.1652,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
            onPress={() => jumpToRestaurant(restaurant)}
          >
            <View style={styles.customMarker}>
              <View style={styles.markerCircle}>
                <Typography variant="caption" color="#FFF" weight="bold">
                  {restaurant.rating}
                </Typography>
              </View>
              <View style={styles.markerPointer} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <Typography variant="h3" align="center" style={styles.headerTitle}>
          Halal Food Near Philadelphia
        </Typography>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search restaurants or cuisines"
          placeholderTextColor={COLORS.textLight}
          style={styles.searchInput}
          returnKeyType="search"
        />
        {query.trim().length > 0 && filteredRestaurants.length > 0 && (
          <View style={styles.resultsList}>
            {filteredRestaurants.slice(0, 4).map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.resultRow}
                onPress={() => jumpToRestaurant(restaurant)}
              >
                <Typography variant="h3" numberOfLines={1}>
                  {restaurant.name}
                </Typography>
                <Typography variant="caption" color={COLORS.textLight} numberOfLines={1}>
                  {restaurant.cuisine}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Map Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.circleBtn} onPress={openDirections}>
          <Navigation size={22} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.circleBtn, { marginTop: SPACING.md }]} onPress={centerOnUser}>
          <LocateFixed size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Bottom Card for Selected Restaurant */}
      {selectedRestaurant && (
        <View style={styles.cardContainer}>
          <RestaurantCard
            id={selectedRestaurant.id}
            name={selectedRestaurant.name}
            cuisine={selectedRestaurant.cuisine}
            rating={selectedRestaurant.rating}
            reviews={selectedRestaurant.reviews}
            image={selectedRestaurant.image}
            distance="Nearby"
            verified={selectedRestaurant.verified}
            price={selectedRestaurant.price}
          />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedRestaurant(null)}
          >
            <Typography variant="caption" color={COLORS.textLight}>
              Close
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  floatingHeader: {
    position: 'absolute',
    top: 60,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.xl,
    ...SHADOWS.medium,
  },
  headerTitle: {
    marginTop: 4,
    marginBottom: SPACING.xs,
  },
  searchInput: {
    height: 40,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    color: COLORS.text,
    backgroundColor: '#F8FBF9',
  },
  resultsList: {
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  resultRow: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionButtons: {
    position: 'absolute',
    top: 130,
    right: SPACING.lg,
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 100,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  customMarker: {
    alignItems: 'center',
  },
  markerCircle: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    ...SHADOWS.small,
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary,
    marginTop: -2,
  },
});
