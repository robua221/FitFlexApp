// screens/NearbyGymsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform, Linking } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from '../utils/theme';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBSSAAo7L0ZngxlI291ihg1jo46x5kk6BI'; 

export default function NearbyGymsScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Request location permissions and get user location
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

  // Fetch nearby gyms once location is available
  useEffect(() => {
    if (!location) return;

    const fetchNearbyGyms = async () => {
      try {
        const { latitude, longitude } = location;
        const radius = 5000; // 5 km
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

  // Open Apple Maps or Google Maps with directions
  const openMap = (lat, lng, name) => {
    const label = name || 'Gym';
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    
    Linking.openURL(url);
  };

  if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;
  if (errorMsg) return <Text style={styles.error}>{errorMsg}</Text>;
  if (!gyms.length) return <Text style={styles.noGyms}>No gyms found nearby.</Text>;

  return (
    <MapView
      style={{ flex: 1,margin:20 }}
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
          onPress={() =>
            openMap(gym.geometry.location.lat, gym.geometry.location.lng, gym.name)
          }
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  error: { textAlign: 'center', marginTop: 20, color: 'red' },
  noGyms: { textAlign: 'center', marginTop: 20, color: COLORS.text },
});
