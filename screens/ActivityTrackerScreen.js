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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { db, auth } from "../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const EXERCISES = [
  { name: "Arm Ergometer", icon: "barbell" },
  { name: "Ascent Trainer", icon: "walk" },
  { name: "Elliptical Trainer", icon: "bicycle" },
  { name: "Indoor Cycling", icon: "bicycle" },
  { name: "Pilates", icon: "accessibility" },
  { name: "Recumbent Bike", icon: "bicycle" },
  { name: "Rowing", icon: "rowing" },
  { name: "Stairstepper", icon: "stairs-up" },
  { name: "Stepmill", icon: "stairs" },
  { name: "Stretching", icon: "body" },
  { name: "Treadmill", icon: "walk" },
  { name: "Upright Bike", icon: "bicycle" },
];

// ✅ Calories burned per minute (approx)
const CALORIES_PER_MIN = 8;

export default function ActivityTrackerScreen() {
  const [search, setSearch] = useState("");

  const handleAddActivity = async (exerciseName, minutes) => {
    try {
      const caloriesBurned = minutes * CALORIES_PER_MIN;
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "Please login again.");
        return;
      }

      await addDoc(collection(db, "dailyActivity"), {
        userId: user.uid,
        exercise: exerciseName,
        minutes,
        calories: caloriesBurned,
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        "✅ Activity Added",
        `${exerciseName} (${minutes} min)\n${caloriesBurned} calories burned`
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not save activity.");
    }
  };

  const filtered = EXERCISES.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Tap to search..."
        placeholderTextColor="#aaa"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {filtered.map((item, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.left}>
            <Ionicons name={item.icon} size={20} color="#6E44FF" />
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  search: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center" },
  exerciseName: { marginLeft: 8, fontSize: 15, fontWeight: "500" },
  buttons: { flexDirection: "row", alignItems: "center" },
  timeButton: {
    borderWidth: 1,
    borderColor: "#6E44FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  timeText: { color: "#6E44FF", fontSize: 12, fontWeight: "600" },
  customButton: {
    borderWidth: 1,
    borderColor: "#6E44FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  customText: { color: "#6E44FF", fontSize: 12 },
});
