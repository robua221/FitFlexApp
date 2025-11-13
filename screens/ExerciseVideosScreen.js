import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ExerciseVideosScreen() {
  const [bodyPart, setBodyPart] = useState("");
  const [url, setUrl] = useState("");

  const searchVideos = () => {
    if (!bodyPart.trim()) return;
    const query = encodeURIComponent(`${bodyPart} workout`);
    setUrl(`https://www.youtube.com/results?search_query=${query}`);
    Keyboard.dismiss();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#05040A" }}>

      <LinearGradient
        colors={["#05040A", "#120533", "#2E005D"]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => setUrl("")} style={styles.backButton}>
          <Ionicons
            name={url ? "arrow-back" : "logo-youtube"}
            size={26}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>Exercise Videos</Text>
      </LinearGradient>
{/* 
   Search */}
      {!url ? (
        <View style={styles.container}>
          <View style={styles.inputRow}>
            <Ionicons name="search-outline" size={18} color="#888" />
            <TextInput
              placeholder="Search by body part (e.g. chest, abs)"
              placeholderTextColor="#888"
              value={bodyPart}
              onChangeText={setBodyPart}
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={searchVideos}>
            <Ionicons name="play-outline" size={18} color="#fff" />
            <Text style={styles.buttonText}>Search Videos</Text>
          </TouchableOpacity>

          <Text style={styles.tip}>
            Example: “Chest workout”, “Leg workout”, “Full body workout”
          </Text>
        </View>
      ) : (
        <WebView
          source={{ uri: url }}
          style={{ flex: 1 }}
          startInLoadingState
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 65,
    paddingBottom: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  backButton: {
    padding: 6,
    marginRight: 10,
  },

  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  container: {
    padding: 20,
    flex: 1,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginBottom: 16,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    color: "#fff",
    fontSize: 15,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A47CF3",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 14,
    gap: 8,
  },

  buttonText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 16,
  },

  tip: {
    color: "#bbb",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
    opacity: 0.8,
  },
});
