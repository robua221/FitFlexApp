// screens/AIAssistant.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { GoogleGenAI } from "@google/genai";
import { COLORS } from "../utils/theme";
import { GEMINI_API_KEY } from "@env";
import { Ionicons } from "@expo/vector-icons";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const stripMarkdown = (text) =>
  text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/#+\s/g, "")
    .replace(/-\s/g, "• ");

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeCalories = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
          You are a helpful fitness and nutrition assistant.
          The user will describe a meal or workout.
          Respond with:
          - Estimated calories
          - Approx protein / carbs / fats
          - One short suggestion to improve the meal or workout.
          Keep it under 6 lines, no markdown.
          Description: ${input}
        `,
      });

      const raw = response.text || "";
      const clean = stripMarkdown(raw);
      setResult(clean.trim());
    } catch (error) {
      console.error("AI Error:", error);
      setResult("⚠️ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.headerRow}>
        <Ionicons name="sparkles-outline" size={22} color="#b388ff" />
        <Text style={styles.title}>AI Fitness Assistant</Text>
      </View>
      <Text style={styles.subtitle}>
        Describe your meal or workout, and I’ll estimate calories and macros.
      </Text>

      <TextInput
        placeholder="E.g. 2 eggs, 2 slices of toast and a latte..."
        placeholderTextColor="#777"
        multiline
        value={input}
        onChangeText={setInput}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={analyzeCalories}
        disabled={loading}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Analyze with AI</Text>
        )}
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>AI Analysis</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1e1e24",
    color: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#8e44ad",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  resultBox: {
    backgroundColor: "#121218",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(179,136,255,0.4)",
  },
  resultLabel: {
    color: "#b388ff",
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 14,
  },
  resultText: {
    color: "#f5f5f5",
    fontSize: 14,
    lineHeight: 20,
  },
});
