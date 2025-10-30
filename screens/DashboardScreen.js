import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { auth, db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ProgressBar } from "react-native-paper";

export default function DashboardScreen() {
  const [user, setUser] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(420);
  const [dailyGoal, setDailyGoal] = useState(600);

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    const fetchFavorites = async () => {
      if (currentUser) {
        const q = query(
          collection(db, "favorites"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        setFavoritesCount(snapshot.size);
      }
    };

    fetchFavorites();
  }, []);

  const progress = Math.min(caloriesBurned / dailyGoal, 1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>{user?.displayName || "FitFlex User"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
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
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Goal Reached</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c3e50",
  },
  email: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  statsCard: {
    backgroundColor: "#f7f2fa",
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2c3e50",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8e44ad",
  },
  statLabel: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  progressCard: {
    backgroundColor: "#f7f2fa",
    padding: 15,
    borderRadius: 15,
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
  },
  progressText: {
    textAlign: "center",
    marginTop: 8,
    color: "#7f8c8d",
  },
});
