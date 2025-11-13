import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pedometer } from "expo-sensors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function StepCounterScreen() {
  const [liveSteps, setLiveSteps] = useState(0);
  const [available, setAvailable] = useState(false);
  const [dailyTotal, setDailyTotal] = useState(0);

  const initialSavedSteps = useRef(0);

  useEffect(() => {
    async function init() {
      const isAvailable = await Pedometer.isAvailableAsync();
      setAvailable(isAvailable);

      if (!isAvailable) return;

      // Get today's saved steps from Firestore
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "userSteps", user.uid);
        const snap = await getDoc(ref);

        const today = new Date().toISOString().slice(0, 10);
        if (snap.exists() && snap.data().date === today) {
          initialSavedSteps.current = snap.data().steps || 0;
          setDailyTotal(initialSavedSteps.current);
        } else {
          initialSavedSteps.current = 0;
          setDailyTotal(0);
        }
      }

      // Start pedometer subscription
      const sub = Pedometer.watchStepCount((result) => {
        setLiveSteps(result.steps);

        const newTotal = initialSavedSteps.current + result.steps;
        setDailyTotal(newTotal);
      });

      return () => sub && sub.remove();
    }

    init();
  }, []);

  // Save updated total every 5 seconds
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);
    const calories = Math.round(dailyTotal * 0.04);

    const interval = setInterval(async () => {
      await setDoc(doc(db, "userSteps", user.uid), {
        steps: dailyTotal,
        calories,
        date: today,
        updatedAt: Date.now(),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [dailyTotal]);

  const caloriesBurned = Math.round(dailyTotal * 0.04);

  return (
    <LinearGradient
      colors={["#0A061A", "#140A36", "#2E0066"]}
      style={styles.container}
    >
      <Text style={styles.title}>Live Step Counter</Text>

      {!available ? (
        <Text style={styles.unavailable}>Pedometer not supported.</Text>
      ) : (
        <>
          <View style={styles.card}>
            <Ionicons name="walk-outline" size={54} color="#A47CF3" />
            <Text style={styles.value}>{dailyTotal}</Text>
            <Text style={styles.label}>Today's Steps</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="flame-outline" size={54} color="#FF8A4C" />
            <Text style={styles.value}>{caloriesBurned}</Text>
            <Text style={styles.label}>Calories Burned</Text>
          </View>

          <Text style={styles.liveText}>Live session steps: {liveSteps}</Text>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 35,
    letterSpacing: 1,
  },
  card: {
    width: "88%",
    backgroundColor: "rgba(255,255,255,0.07)",
    paddingVertical: 35,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 1.5,
  },
  value: {
    color: "#fff",
    fontSize: 44,
    fontWeight: "900",
    marginTop: 10,
  },
  label: {
    color: "#bbb",
    marginTop: 4,
    fontSize: 16,
  },
  liveText: {
    color: "#aaa",
    marginTop: 10,
  },
  unavailable: {
    color: "#ccc",
    fontSize: 18,
    marginTop: 40,
  },
});
