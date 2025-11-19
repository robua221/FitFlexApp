import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pedometer } from "expo-sensors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function StepCounterScreen() {
  const [steps, setSteps] = useState(0);
  const [available, setAvailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Today Key
  const getTodayKey = () => new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function init() {
      const isAvailable = await Pedometer.isAvailableAsync();
      setAvailable(isAvailable);

      if (!isAvailable) {
        setErrorMsg("Pedometer not available on this device.");
        return;
      }

      const subscription = Pedometer.watchStepCount(async (res) => {
        setSteps(res.steps);
        await saveStepsToFirestore(res.steps);
      });

      return () => subscription && subscription.remove();
    }

    init();
  }, []);

  const saveStepsToFirestore = async (currentSteps) => {
    const user = auth.currentUser;
    if (!user) {
      setErrorMsg("Please log in to sync steps.");
      return;
    }

    const dateKey = getTodayKey();
    const calories = Math.round(currentSteps * 0.04); // simple estimate

    const ref = doc(db, "userStepsDaily", `${user.uid}_${dateKey}`);
    await setDoc(
      ref,
      {
        userId: user.uid,
        date: dateKey,
        steps: currentSteps,
        calories,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const calories = Math.round(steps * 0.04);

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={styles.container}
    >
      <Text style={styles.title}>Step Counter</Text>

      {!available ? (
        <Text style={styles.unavailable}>
          {errorMsg || "Pedometer not available."}
        </Text>
      ) : (
        <>
          <View style={styles.card}>
            <Ionicons name="walk-outline" size={46} color="#fff" />
            <Text style={styles.value}>{steps}</Text>
            <Text style={styles.label}>Steps Today</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="flame-outline" size={46} color="#fff" />
            <Text style={styles.value}>{calories}</Text>
            <Text style={styles.label}>Calories Burned</Text>
          </View>

          <Text style={styles.syncNote}>
            Steps & calories are synced with your Dashboard for today's date.
          </Text>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 90, alignItems: "center" },
  title: { color: "#fff", fontSize: 28, fontWeight: "700", marginBottom: 30 },
  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 25,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  value: { color: "#fff", fontSize: 42, fontWeight: "800", marginTop: 10 },
  label: { color: "#ccc", marginTop: 6, fontSize: 15 },
  unavailable: {
    color: "#ccc",
    fontSize: 16,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  syncNote: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: "center",
  },
});
