// screens/SignupScreen.js
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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import FitFlexLogo from "../components/FitFlexLogo";
import { LinearGradient } from "expo-linear-gradient";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
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
          <FitFlexLogo size={55} />
          <Text style={styles.subtitle}>Create your FitFlex account</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign Up</Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

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

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>
              Already have an account?{" "}
              <Text style={styles.loginHighlight}>Login</Text>
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
    marginBottom: 35,
  },

  subtitle: {
    color: "#dcdcdc",
    textAlign: "center",
    marginTop: 6,
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

  signupButton: {
    backgroundColor: "#8e44ad",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },

  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  loginLink: {
    marginTop: 14,
    color: "#ccc",
    textAlign: "center",
    fontSize: 14,
  },

  loginHighlight: {
    color: "#b388ff",
    fontWeight: "700",
  },
});
