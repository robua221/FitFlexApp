// screens/NearbyGymsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Linking,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from '../utils/theme';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBSSAAo7L0ZngxlI291ihg1jo46x5kk6BI'; 

export default function NearbyGymsScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Request location permissions
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  // Fetch nearby gyms
  useEffect(() => {
    if (!location) return;

    const fetchNearbyGyms = async () => {
      try {
        const { latitude, longitude } = location;
        const radius = 20000;
        const type = 'gym';
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();
        setGyms(data.results);
      } catch (error) {
        console.error('Error fetching nearby gyms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyGyms();
  }, [location]);

  const openMap = (lat, lng, name) => {
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  if (loading)
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;

  if (errorMsg)
    return <Text style={styles.error}>{errorMsg}</Text>;

  if (!gyms.length)
    return <Text style={styles.noGyms}>No gyms found nearby.</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 37.78825,
          longitude: location?.longitude || -122.4324,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {gyms.map((gym) => (
          <Marker
            key={gym.place_id}
            coordinate={{
              latitude: gym.geometry.location.lat,
              longitude: gym.geometry.location.lng,
            }}
            title={gym.name}
            description={gym.vicinity}
          />
        ))}
      </MapView>

      {/* Gym List */}
      <View style={styles.listContainer}>
        <Text style={styles.header}>Nearby Gyms</Text>
        <FlatList
          data={gyms}
          keyExtractor={(item) => item.place_id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.gymName}>{item.name}</Text>
              <Text style={styles.gymAddress}>{item.vicinity}</Text>
              {item.rating && (
                <Text style={styles.gymRating}>⭐ {item.rating} / 5</Text>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  openMap(item.geometry.location.lat, item.geometry.location.lng, item.name)
                }
              >
                <Text style={styles.buttonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  map: {
    height: height * 0.4,
    margin: 10,
    borderRadius: 15,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: COLORS.primary || '#5B21B6',
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  gymName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  gymAddress: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  gymRating: {
    color: '#333',
    marginBottom: 5,
  },
  button: {
    backgroundColor: COLORS.primary || '#5B21B6',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: { textAlign: 'center', marginTop: 20, color: 'red' },
  noGyms: { textAlign: 'center', marginTop: 20, color: '#444' },
});
