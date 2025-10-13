import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { GoogleGenAI } from "@google/genai";
import { COLORS, FONTS } from "../utils/theme";

// ⚠️ Put your API key here directly
const GEMINI_API_KEY = "AIzaSyCuv13i0x2HbK8Mx5C9-JN3pzK3yY_5xxw"; 
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
        model: "gemini-2.5-flash", // or gemini-1.5-flash
        contents: `
        You are a nutrition and fitness assistant.
        The user will describe a meal or workout.
        Respond with an estimated calorie count and a short macronutrient breakdown (protein, carbs, fats).
        Description: ${input}
        `,
      });

      setResult(response.text);
    } catch (error) {
      console.error("AI Error:", error);
      setResult("⚠️ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>🍎 AI Calorie Tracker</Text>
      <TextInput
        placeholder="Type your meal or workout..."
        placeholderTextColor="#aaa"
        multiline
        value={input}
        onChangeText={setInput}
        style={styles.input}
      />

      <TouchableOpacity onPress={analyzeCalories} disabled={loading} style={styles.button}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={FONTS.button}>Analyze with AI</Text>}
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { ...FONTS.title, marginBottom: 20 , marginTop:30},
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  resultBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  resultText: { color: "#fff", fontSize: 16, lineHeight: 24 },
});
