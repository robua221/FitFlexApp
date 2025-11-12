import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { GoogleGenAI } from "@google/genai";
import { COLORS, FONTS } from "../utils/theme";
import { GEMINI_API_KEY } from "@env";

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
        model: "gemini-2.5-flash",
        contents: `
        You are a helpful fitness and nutrition assistant.
        The user will describe a meal or a workout.
        Provide:
        - Estimated total calories
        - Protein / Carbs / Fat breakdown
        - A simple explanation in 2–3 lines
        
        Avoid using bullet points, stars, or markdown formatting.
        Keep the answer clean and simple.
        
        Description: ${input}
        `,
      });

      let text = response.text;

      // REMOVE ALL '*' FROM OUTPUT
      text = text.replace(/\*/g, "");

      // REMOVE markdown-style " - " bullets
      text = text.replace(/^- /gm, "");

      setResult(text.trim());
    } catch (error) {
      console.error("AI Error:", error);
      setResult("⚠️ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>🍎 AI Assistant</Text>

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
  title: { ...FONTS.title, marginBottom: 20, marginTop: 30 },
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
