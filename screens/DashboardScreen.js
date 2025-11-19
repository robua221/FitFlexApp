import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
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
  setDoc,
  Timestamp,
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

  const [dailyGoal, setDailyGoal] = useState(600);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("");

  const todayKey = () => new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const current = auth.currentUser;
    setUser(current);
    if (!current) return;

    refreshDashboard(current.uid);

    const interval = setInterval(() => refreshDashboard(current.uid), 3000);
    return () => clearInterval(interval);
  }, []);

  const refreshDashboard = async (userId) => {
    await Promise.all([
      loadProfile(userId),
      loadFavorites(userId),
      loadStepsToday(userId),
      loadActivityToday(userId),
      loadUserGoal(userId),
    ]);
  };

  //  Load profile (username + avatar)
  const loadProfile = async (userId) => {
    const ref = doc(db, "users", userId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setProfile({
        displayName: data.displayName || user?.email || "FitFlex User",
        avatarIndex:
          typeof data.avatarIndex === "number" ? data.avatarIndex : 0,
      });
    }
  };

  //  Favorites count
  const loadFavorites = async (userId) => {
    const qFav = query(
      collection(db, "favorites"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(qFav);
    setFavoritesCount(snap.size);
  };

  //  Load today steps & calories (new system)
  const loadStepsToday = async (userId) => {
    const ref = doc(db, "userStepsDaily", `${userId}_${todayKey()}`);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setStepData({
        steps: data.steps || 0,
        calories: data.calories || 0,
      });
    } else {
      setStepData({ steps: 0, calories: 0 });
    }
  };

  //  Load activity for today (new system)
  const loadActivityToday = async (userId) => {
    const today = new Date().toISOString().slice(0, 10);

    const qAct = query(
      collection(db, "dailyActivity"),
      where("userId", "==", userId),
      where("date", "==", today)
    );

    const snap = await getDocs(qAct);

    let total = 0;
    snap.forEach((d) => {
      const c = d.data().calories;
      if (typeof c === "number") total += c;
    });

    setActivityCalories(total);
  };

  //  Load daily goal
  const loadUserGoal = async (userId) => {
    const ref = doc(db, "users", userId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const g = snap.data().dailyGoal;
      if (typeof g === "number" && g > 0) {
        setDailyGoal(g);
      }
    }
  };

  //  Save new daily goal
  const saveGoal = async () => {
    const parsed = parseInt(goalInput, 10);
    if (isNaN(parsed) || parsed <= 0) {
      alert("Enter a valid kcal number.");
      return;
    }

    const ref = doc(db, "users", user.uid);
    await setDoc(ref, { dailyGoal: parsed }, { merge: true });

    setDailyGoal(parsed);
    setEditingGoal(false);
  };

  const totalCalories = stepData.calories + activityCalories;
  const progress = dailyGoal > 0 ? Math.min(totalCalories / dailyGoal, 1) : 0;

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

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>{profile.displayName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        {/* SUMMARY CARD */}
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
              <Text style={styles.statValue}>{stepData.steps}</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="flame-outline" size={26} color="#fff" />
              <Text style={styles.statValue}>{totalCalories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          </View>
        </View>

        {/* GOAL CARD */}
        <View style={styles.card}>
          <View style={styles.goalHeaderRow}>
            <Text style={styles.sectionTitle}>Daily Calorie Goal</Text>

            {!editingGoal && (
              <TouchableOpacity
                onPress={() => {
                  setGoalInput(String(dailyGoal));
                  setEditingGoal(true);
                }}
              >
                <Text style={styles.editGoalText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {editingGoal ? (
            <View style={styles.goalEditRow}>
              <TextInput
                value={goalInput}
                onChangeText={setGoalInput}
                keyboardType="numeric"
                placeholder="Enter kcal"
                placeholderTextColor="#999"
                style={styles.goalInput}
              />

              <TouchableOpacity style={styles.goalButton} onPress={saveGoal}>
                <Text style={styles.goalButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.goalButton, styles.cancelButton]}
                onPress={() => setEditingGoal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${progress * 100}%` }]}
                />
              </View>

              <Text style={styles.progressText}>
                {Math.round(progress * 100)}% of {dailyGoal} kcal goal
              </Text>

              <Text style={styles.progressSubText}>
                Steps: {stepData.calories} kcal · Activity: {activityCalories}{" "}
                kcal
              </Text>
            </>
          )}
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
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 6,
  },
  statLabel: { color: "#ccc", marginTop: 2, fontSize: 12 },

  progressTrack: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    marginTop: 12,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#A47CF3",
    borderRadius: 10,
  },

  progressText: {
    color: "#fff",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "600",
  },

  progressSubText: {
    color: "#ccc",
    marginTop: 4,
    textAlign: "center",
    fontSize: 12,
  },

  goalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  editGoalText: {
    color: "#A47CF3",
    fontWeight: "600",
    fontSize: 14,
  },

  goalEditRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  goalInput: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
    marginRight: 8,
  },

  goalButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#A47CF3",
    borderRadius: 10,
    marginLeft: 4,
  },
  goalButtonText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  cancelButton: {
    backgroundColor: "transparent",
    borderColor: "#aaa",
    borderWidth: 1,
  },
  cancelText: { color: "#ccc" },
});
