import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

const EXERCISES = [
  { name: "Arm Ergometer", icon: "barbell-outline" },
  { name: "Ascent Trainer", icon: "walk-outline" },
  { name: "Elliptical Trainer", icon: "bicycle-outline" },
  { name: "Indoor Cycling", icon: "bicycle-outline" },
  { name: "Pilates", icon: "accessibility-outline" },
  { name: "Recumbent Bike", icon: "bicycle-outline" },
  { name: "Rowing", icon: "water-outline" },
  { name: "Stairstepper", icon: "trending-up-outline" },
  { name: "Stepmill", icon: "bar-chart-outline" },
  { name: "Stretching", icon: "body-outline" },
  { name: "Treadmill", icon: "walk-outline" },
  { name: "Upright Bike", icon: "bicycle-outline" },
];

const CALORIES_PER_MIN = 8;

export default function ActivityTrackerScreen() {
  const [search, setSearch] = useState("");

  const handleAddActivity = async (exerciseName, minutes) => {
    try {
      const user = auth.currentUser;
      if (!user) return Alert.alert("Login error", "Please log in again.");

      const caloriesBurned = minutes * CALORIES_PER_MIN;
      const today = new Date().toISOString().slice(0, 10);

      await addDoc(collection(db, "dailyActivity"), {
        userId: user.uid,
        exercise: exerciseName,
        minutes,
        calories: caloriesBurned,
        createdAt: serverTimestamp(), // Firestore time
        timestamp: new Date(), // always valid
        date: today, // YYYY-MM-DD
      });

      Alert.alert(
        "🔥 Activity Added",
        `${exerciseName} (${minutes} min)\n🔥 ${caloriesBurned} calories burned`
      );
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not save activity.");
    }
  };

  const filtered = EXERCISES.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={styles.container}
    >
      <Text style={styles.title}>Track Your Activity</Text>

      <TextInput
        placeholder="Search exercises..."
        placeholderTextColor="#bbb"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView style={{ marginTop: 10 }}>
        {filtered.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.left}>
              <Ionicons name={item.icon} size={24} color="#A47CF3" />
              <Text style={styles.exerciseName}>{item.name}</Text>
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleAddActivity(item.name, 15)}
              >
                <Text style={styles.timeText}>15 min</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleAddActivity(item.name, 30)}
              >
                <Text style={styles.timeText}>30 min</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.customButton}
                onPress={() => handleAddActivity(item.name, 45)}
              >
                <Text style={styles.customText}>custom</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 18 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 15 },
  search: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  left: { flexDirection: "row", alignItems: "center" },
  exerciseName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttons: { flexDirection: "row", alignItems: "center" },
  timeButton: {
    borderWidth: 1,
    borderColor: "#A47CF3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  timeText: { color: "#A47CF3", fontSize: 12, fontWeight: "700" },
  customButton: {
    borderWidth: 1,
    borderColor: "#8E44FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  customText: { color: "#8E44FF", fontSize: 12, fontWeight: "700" },
});
