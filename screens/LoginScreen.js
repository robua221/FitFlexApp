// screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import FitFlexLogo from "../components/FitFlexLogo";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      navigation.replace("Home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View style={styles.logoContainer}>
          <FitFlexLogo size={60} />
          <Text style={styles.subtitle}>
            Train smarter. Track better. Stay consistent.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupText}>
              Don’t have an account?{" "}
              <Text style={styles.signupHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  subtitle: {
    color: "#dcdcdc",
    textAlign: "center",
    marginTop: 8,
    marginHorizontal: 40,
    fontSize: 14,
    opacity: 0.85,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 24,
    borderRadius: 20,
    marginHorizontal: 24,
    shadowColor: "#9b59b6",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },

  input: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    fontSize: 15,
  },

  loginButton: {
    backgroundColor: "#8e44ad",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  signupText: {
    marginTop: 14,
    color: "#ccc",
    textAlign: "center",
    fontSize: 14,
  },

  signupHighlight: {
    color: "#b388ff",
    fontWeight: "700",
  },
});
