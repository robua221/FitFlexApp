import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pedometer } from "expo-sensors";

export default function StepCounterScreen() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    // Check if sensor is available
    Pedometer.isAvailableAsync().then(
      (result) => setIsAvailable(result),
      (error) => console.log("Pedometer error:", error)
    );

    // Subscribe to step updates
    const subscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
    });

    return () => subscription && subscription.remove();
  }, []);

  const distanceKm = (steps * 0.0008).toFixed(2); // avg 1 step = 0.8 meters
  const caloriesBurned = Math.round(steps * 0.04); // avg 0.04 cal per step

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚶 Step Counter</Text>

      {!isAvailable ? (
        <Text style={styles.error}>Step counter not available on this device</Text>
      ) : (
        <>
          <Text style={styles.stat}>Steps: {steps}</Text>
          <Text style={styles.stat}>Distance: {distanceKm} km</Text>
          <Text style={styles.stat}>Calories Burned: {caloriesBurned} cal</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },
  stat: { fontSize: 22, marginVertical: 10 },
  error: { fontSize: 18, color: "red" },
});
