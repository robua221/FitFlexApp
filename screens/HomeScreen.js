// screens/HomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import FitFlexLogo from "../components/FitFlexLogo";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <FitFlexLogo size={52} />
        <Text style={styles.greeting}>Welcome back 👋</Text>
        <Text style={styles.subtitle}>
          Your all-in-one gym companion for workouts, tracking, and guidance.
        </Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "rgba(142, 68, 173, 0.2)" }]}
            onPress={() => navigation.navigate("Explore")}
          >
            <Ionicons name="barbell-outline" size={28} color="#fff" />
            <Text style={styles.cardTitle}>Explore Exercises</Text>
            <Text style={styles.cardDesc}>Browse and favorite exercises.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: "rgba(52, 152, 219, 0.2)" }]}
            onPress={() => navigation.navigate("Favorites")}
          >
            <Ionicons name="heart-outline" size={28} color="#fff" />
            <Text style={styles.cardTitle}>My Favorites</Text>
            <Text style={styles.cardDesc}>Quick access to saved moves.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: "rgba(46, 204, 113, 0.2)" }]}
            onPress={() => navigation.navigate("NearbyGyms")}
          >
            <Ionicons name="location-outline" size={28} color="#fff" />
            <Text style={styles.cardTitle}>Nearby Gyms</Text>
            <Text style={styles.cardDesc}>Find gyms near your location.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: "rgba(241, 196, 15, 0.2)" }]}
            onPress={() => navigation.navigate("ExerciseVideos")}
          >
            <Ionicons name="logo-youtube" size={28} color="#fff" />
            <Text style={styles.cardTitle}>Exercise Videos</Text>
            <Text style={styles.cardDesc}>Watch YouTube workout demos.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: "rgba(231, 76, 60, 0.25)" }]}
            onPress={() => navigation.navigate("AIAssistant")}
          >
            <Ionicons name="sparkles-outline" size={28} color="#fff" />
            <Text style={styles.cardTitle}>AI Assistant</Text>
            <Text style={styles.cardDesc}>Calories & workout guidance.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: "rgba(155, 89, 182, 0.25)" }]}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Ionicons name="stats-chart-outline" size={28} color="#fff" />
            <Text style={styles.cardTitle}>Dashboard</Text>
            <Text style={styles.cardDesc}>Overview of your progress.</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  greeting: {
    marginTop: 10,
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#dcdcdc",
    marginTop: 6,
    marginBottom: 20,
    fontSize: 14,
    opacity: 0.85,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 14,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
  },
  cardDesc: {
    color: "#ddd",
    fontSize: 12,
    marginTop: 2,
    opacity: 0.85,
  },
  logoutButton: {
    marginTop: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  logoutText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
});
