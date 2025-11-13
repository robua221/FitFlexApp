import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

export default function DashboardScreen() {
  const [user, setUser] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [stepData, setStepData] = useState({ steps: 0, calories: 0 });
  const [activityCalories, setActivityCalories] = useState(0);

  const dailyGoal = 10000;

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    if (!currentUser) return;

  
    const interval = setInterval(() => {
      refreshDashboard(currentUser.uid);
    }, 2000);

   
    refreshDashboard(currentUser.uid);

    return () => clearInterval(interval);
  }, []);


  const refreshDashboard = async (userId) => {
    loadFavorites(userId);
    loadSteps(userId);
    loadActivity(userId);
  };


  const loadFavorites = async (userId) => {
    const q = query(collection(db, "favorites"), where("userId", "==", userId));
    const snap = await getDocs(q);
    setFavoritesCount(snap.size);
  };


  const loadSteps = async (userId) => {
    const ref = doc(db, "userSteps", userId);
    const snap = await getDoc(ref);
    if (snap.exists()) setStepData(snap.data());
  };

  const loadActivity = async (userId) => {
    const q = query(
      collection(db, "dailyActivity"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);

    let total = 0;
    snap.forEach((doc) => (total += doc.data().calories));

    setActivityCalories(total);
  };

  const totalCalories = (stepData.calories || 0) + activityCalories;
  const progress = Math.min(totalCalories / dailyGoal, 1);

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image source={require("../assets/icon.png")} style={styles.avatar} />
          <View>
            <Text style={styles.name}>
              {user?.displayName || "FitFlex User"}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        {/* STATS CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>

          <View style={styles.row}>
            <View style={styles.statBox}>
              <Ionicons name="heart-outline" size={26} color="#fff" />
              <Text style={styles.statValue}>{favoritesCount}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="walk-outline" size={26} color="#fff" />
              <Text style={styles.statValue}>{stepData.steps || 0}</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="flame-outline" size={26} color="#fff" />
              <Text style={styles.statValue}>{totalCalories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          </View>
        </View>

        {/* PROGRESS CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Daily Goal</Text>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>

          <Text style={styles.progressText}>
            {Math.round(progress * 100)}% of 600 kcal goal
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  name: { color: "#fff", fontSize: 22, fontWeight: "700" },
  email: { color: "#bbb", fontSize: 14 },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statBox: { alignItems: "center", width: "32%" },
  statValue: { color: "#fff", fontSize: 22, fontWeight: "800" },
  statLabel: { color: "#ccc", marginTop: 4 },

  progressTrack: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    marginTop: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#A47CF3",
    borderRadius: 10,
  },
  progressText: {
    color: "#ccc",
    marginTop: 8,
    textAlign: "center",
  },
});
