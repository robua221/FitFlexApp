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
import { Ionicons } from "@expo/vector-icons";
import { GEMINI_API_KEY } from "@env";
import { LinearGradient } from "expo-linear-gradient";

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
        - Protein / carbs / fats estimate
        - 1 improvement suggestion
        No markdown, no symbols, under 6 lines.
        Description: ${input}
        `,
      });

      const clean = stripMarkdown(response.text || "").trim();
      setResult(clean);
    } catch (error) {
      console.error("AI Error:", error);
      setResult("⚠️ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Ionicons name="sparkles-outline" size={26} color="#b388ff" />
          <Text style={styles.title}>AI Fitness Assistant</Text>
        </View>

        <Text style={styles.subtitle}>
          Describe your meal or workout and get instant calorie & macro
          analysis.
        </Text>

        {/* Input Box */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="E.g. 2 eggs, toast, latte OR 20 min cycling..."
            placeholderTextColor="#888"
            multiline
            value={input}
            onChangeText={setInput}
            style={styles.input}
          />
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          onPress={analyzeCalories}
          disabled={loading}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Analyze with AI</Text>
            </>
          )}
        </TouchableOpacity>

        {/* AI Result */}
        {result ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>AI Result</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 10,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 10,
  },

  subtitle: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 20,
  },

  inputBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginBottom: 16,
  },

  input: {
    color: "#fff",
    fontSize: 15,
    minHeight: 120,
  },

  button: {
    flexDirection: "row",
    backgroundColor: "#A47CF3",
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },

  buttonText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 16,
  },

  resultBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(179,136,255,0.4)",
    marginTop: 10,
  },

  resultLabel: {
    color: "#b388ff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  resultText: {
    color: "#eee",
    fontSize: 14,
    lineHeight: 22,
  },
});
