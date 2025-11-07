import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { auth, db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ProgressBar } from "react-native-paper";

export default function DashboardScreen() {
  const [user, setUser] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [activityCount, setActivityCount] = useState(0);

  const DAILY_GOAL = 600;

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    if (!currentUser) return;

    fetchFavorites(currentUser.uid);
    fetchActivities(currentUser.uid);
  }, []);

  const fetchFavorites = async (uid) => {
    const q = query(collection(db, "favorites"), where("userId", "==", uid));
    const snapshot = await getDocs(q);
    setFavoritesCount(snapshot.size);
  };

  const fetchActivities = async (uid) => {
    const q = query(collection(db, "dailyActivity"), where("userId", "==", uid));
    const snapshot = await getDocs(q);

    let totalCalories = 0;
    snapshot.forEach((doc) => {
      totalCalories += doc.data().calories || 0;
    });

    setCaloriesBurned(totalCalories);
    setActivityCount(snapshot.size);
  };

  const progress = Math.min(caloriesBurned / DAILY_GOAL, 1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>{user?.email}</Text>
          <Text style={styles.email}>FitFlex User</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Your Stats</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{favoritesCount}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{caloriesBurned}</Text>
            <Text style={styles.statLabel}>Calories Burned</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{activityCount}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.sectionTitle}>Daily Progress</Text>
        <ProgressBar progress={progress} color="#8e44ad" style={styles.progressBar} />
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% of your daily goal
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  name: { fontSize: 20, fontWeight: "700" },
  email: { color: "#666" },

  statsCard: {
    backgroundColor: "#f7f2fa",
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBox: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#8e44ad" },
  statLabel: { color: "#777" },

  progressCard: { padding: 15, borderRadius: 15, backgroundColor: "#f7f2fa" },
  progressBar: { height: 10, borderRadius: 10 },
  progressText: { marginTop: 10, textAlign: "center", color: "#777" },
});
