
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
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


const AVATARS = [
  require("../assets/avatars/1.png"),
  require("../assets/avatars/2.png"),
  require("../assets/avatars/3.png"),
  require("../assets/avatars/4.png"),
  require("../assets/avatars/5.png"),
  require("../assets/avatars/6.png"),
  require("../assets/avatars/7.png"),
  require("../assets/avatars/8.png"),
  require("../assets/avatars/9.png"),
];

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ displayName: "", avatarIndex: 0 });
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [stepData, setStepData] = useState({ steps: 0, calories: 0 });
  const [activityCalories, setActivityCalories] = useState(0);

  const dailyGoal = 600; // kcal goal you show in UI

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
    await Promise.all([
      loadProfile(userId),
      loadFavorites(userId),
      loadSteps(userId),
      loadActivity(userId),
    ]);
  };

  // 🔹 Load user profile from users/{uid}
  const loadProfile = async (userId) => {
    try {
      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          displayName:
            data.displayName || auth.currentUser?.email || "FitFlex User",
          avatarIndex:
            typeof data.avatarIndex === "number" ? data.avatarIndex : 0,
        });
      } else {
        // Fallback if no doc yet
        setProfile({
          displayName: auth.currentUser?.email || "FitFlex User",
          avatarIndex: 0,
        });
      }
    } catch (e) {
      console.log("Error loading profile:", e.message);
    }
  };

  const loadFavorites = async (userId) => {
    try {
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", userId)
      );
      const snap = await getDocs(q);
      setFavoritesCount(snap.size);
    } catch (e) {
      console.log("Error loading favorites:", e.message);
    }
  };

  const loadSteps = async (userId) => {
    try {
      const ref = doc(db, "userSteps", userId);
      const snap = await getDoc(ref);
      if (snap.exists()) setStepData(snap.data());
    } catch (e) {
      console.log("Error loading steps:", e.message);
    }
  };

  const loadActivity = async (userId) => {
    try {
      const q = query(
        collection(db, "dailyActivity"),
        where("userId", "==", userId)
      );
      const snap = await getDocs(q);
      let total = 0;
      snap.forEach((d) => (total += d.data().calories || 0));
      setActivityCalories(total);
    } catch (e) {
      console.log("Error loading activity:", e.message);
    }
  };

  const totalCalories = (stepData.calories || 0) + activityCalories;
  const progress = Math.min(totalCalories / dailyGoal, 1);

  const currentAvatar =
    AVATARS[profile.avatarIndex] || require("../assets/icon.png");

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfile")}
            activeOpacity={0.8}
          >
            <Image source={currentAvatar} style={styles.avatar} />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {profile.displayName || "FitFlex User"}
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
            {Math.round(progress * 100)}% of {dailyGoal} kcal goal
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
  avatar: { width: 72, height: 72, borderRadius: 36 },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8e44ad",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#05040A",
  },
  name: { color: "#fff", fontSize: 22, fontWeight: "700" },
  email: { color: "#bbb", fontSize: 14, marginTop: 2 },

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
  statValue: { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 6 },
  statLabel: { color: "#ccc", marginTop: 2, fontSize: 12 },

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
    fontSize: 13,
  },
});
