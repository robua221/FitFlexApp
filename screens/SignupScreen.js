import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import FitFlexLogo from "../components/FitFlexLogo";

export default function SignupScreen({ navigation }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Update auth profile
      await updateProfile(cred.user, { displayName: displayName.trim() });

      // Create Firestore profile document
      const userRef = doc(db, "users", cred.user.uid);
      await setDoc(userRef, {
        displayName: displayName.trim(),
        email: email.trim(),
        avatarIndex: 0,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Account created", "Welcome to FitFlex!", [
        { text: "OK", onPress: () => navigation.replace("Home") },
      ]);
    } catch (e) {
      console.log("Signup error:", e.message);
      Alert.alert("Error", e.message || "Could not sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <FitFlexLogo size={52} />
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Join FitFlex and start tracking your workouts and progress.
          </Text>

          <Text style={styles.label}>Display Name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="What should we call you?"
            placeholderTextColor="#888"
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.replace("Login")}
            style={{ marginTop: 15, alignItems: "center" }}
          >
            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Text style={{ color: "#A47CF3" }}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 30,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },
  label: { color: "#ccc", fontSize: 13, marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: "#1b1b1f",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  button: {
    backgroundColor: "#A47CF3",
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  linkText: { color: "#ccc", fontSize: 13 },
});
