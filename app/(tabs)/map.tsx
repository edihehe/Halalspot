import { RestaurantCard } from '@/components/RestaurantCard';
import { Typography } from '@/components/ui/Typography';
import { COLORS, SHADOWS, SPACING } from '@/constants/theme';
import { fetchRestaurants } from '@/services/api';
import { Restaurant } from '@/services/mockData';
import { Stack } from 'expo-router';
import { LocateFixed, Navigation } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <MapView
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
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
            onPress={() => setSelectedRestaurant(restaurant)}
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
        <Typography variant="h3" align="center">
          Halal Food Near Philadelphia
        </Typography>
      </View>

      {/* Map Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.circleBtn}>
          <Navigation size={22} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.circleBtn, { marginTop: SPACING.md }]}>
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
    padding: SPACING.md,
    borderRadius: 50,
    ...SHADOWS.medium,
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
