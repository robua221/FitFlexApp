import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Linking,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const GOOGLE_PLACES_API_KEY = "AIzaSyBSSAAo7L0ZngxlI291ihg1jo46x5kk6BI";

export default function NearbyGymsScreen() {
  const [location, setLocation] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Location permission denied");
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (e) {
        setErrorMsg("Could not get your location");
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchGyms = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=8000&type=gym&key=${GOOGLE_PLACES_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== "OK") {
          console.log("Places API error:", data.status, data.error_message);
        }

        setGyms(data.results || []);
      } catch (err) {
        console.log("Error fetching gyms:", err);
        setErrorMsg("Error fetching gyms");
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, [location]);

  const openMap = (lat, lng) => {
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${lat},${lng}`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    Linking.openURL(url);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#05040A", "#120533", "#2E005D"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#A47CF3" />
        <Text style={styles.loadingText}>Finding gyms near you...</Text>
      </LinearGradient>
    );
  }

  if (errorMsg) {
    return (
      <LinearGradient
        colors={["#05040A", "#120533", "#2E005D"]}
        style={styles.loadingContainer}
      >
        <Text style={styles.errorText}>{errorMsg}</Text>
      </LinearGradient>
    );
  }

  if (!gyms.length) {
    return (
      <LinearGradient
        colors={["#05040A", "#120533", "#2E005D"]}
        style={styles.loadingContainer}
      >
        <Ionicons name="alert-circle-outline" size={42} color="#fff" />
        <Text style={styles.errorText}>No gyms found nearby.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={{ flex: 1 }}
    >
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Ionicons name="location-outline" size={24} color="#DDB6FF" />
        <Text style={styles.title}>Nearby Gyms</Text>
      </View>

      {/* MAP */}
      <View style={styles.mapWrapper}>
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
      </View>

      {/* LIST */}
      <View style={styles.bottomCard}>
        <FlatList
          data={gyms}
          keyExtractor={(item) => item.place_id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.gymCard}>
              <View style={styles.gymHeaderRow}>
                <Ionicons name="fitness-outline" size={24} color="#C89BFF" />
                <Text style={styles.gymName} numberOfLines={2}>
                  {item.name}
                </Text>
              </View>

              <Text style={styles.address}>{item.vicinity}</Text>
              {item.rating && (
                <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
              )}

              <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                  openMap(
                    item.geometry.location.lat,
                    item.geometry.location.lng
                  )
                }
              >
                <Ionicons name="navigate-outline" size={18} color="#fff" />
                <Text style={styles.btnText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 65,
    alignSelf: "center",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 8,
  },
  mapWrapper: {
    marginHorizontal: 15,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginTop: 15,
  },
  map: {
    height: height * 0.34,
    width: "100%",
  },
  bottomCard: {
    flex: 1,
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  gymCard: {
    backgroundColor: "rgba(255,255,255,0.10)",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  gymHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  gymName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },
  address: {
    color: "#ccc",
    marginTop: 4,
    fontSize: 13,
  },
  rating: {
    color: "#FFD369",
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
  },
  btn: {
    marginTop: 10,
    backgroundColor: "#A47CF3",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  btnText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 14,
  },
  errorText: {
    color: "#ffb3b3",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
