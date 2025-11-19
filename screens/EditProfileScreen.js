// screens/EditProfileScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AVATARS = [
  require("../assets/avatars/1.png"),
  require("../assets/avatars/2.png"),
  require("../assets/avatars/3.png"),
  require("../assets/avatars/4.png"),
  require("../assets/avatars/5.png"),
  require("../assets/avatars/6.png"),
  require("../assets/avatars/7.png"),
  require("../assets/avatars/8.png"),
  require("../assets/avatars/9.png"),
];

export default function EditProfileScreen({ navigation }) {
  const [displayName, setDisplayName] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const loadProfile = async () => {
      try {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setDisplayName(
            data.displayName || currentUser.email?.split("@")[0] || ""
          );
          setAvatarIndex(
            typeof data.avatarIndex === "number" ? data.avatarIndex : 0
          );
        } else {
          setDisplayName(currentUser.email?.split("@")[0] || "");
        }
      } catch (e) {
        console.log("Error loading profile:", e.message);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (!displayName.trim()) {
      Alert.alert("Name required", "Please enter a display name.");
      return;
    }

    try {
      setLoading(true);
      const ref = doc(db, "users", currentUser.uid);
      await setDoc(
        ref,
        {
          displayName: displayName.trim(),
          avatarIndex,
          email: currentUser.email,
        },
        { merge: true }
      );

      Alert.alert("Profile updated", "Your profile has been saved.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      console.log("Error saving profile:", e.message);
      Alert.alert("Error", "Could not save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>
          Choose your avatar and set how your name appears in FitFlex.
        </Text>

        {/* Current avatar */}
        <View style={styles.center}>
          <Image source={AVATARS[avatarIndex]} style={styles.currentAvatar} />
        </View>

        {/* Display name input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your name"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>

        {/* Avatar picker */}
        <Text style={[styles.label, { marginTop: 20 }]}>Choose an Avatar</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.avatarRow}
        >
          {AVATARS.map((img, index) => {
            const selected = index === avatarIndex;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setAvatarIndex(index)}
                style={[styles.avatarOption, selected && styles.avatarSelected]}
              >
                <Image source={img} style={styles.avatarThumb} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? "Saving..." : "Save Profile"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: { color: "#fff", fontSize: 14, marginLeft: 4 },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 20,
  },
  center: { alignItems: "center", marginBottom: 20 },
  currentAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#A47CF3",
  },
  inputGroup: { marginTop: 10 },
  label: { color: "#ccc", fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: "#1b1b1f",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  avatarRow: {
    marginTop: 10,
  },
  avatarOption: {
    marginRight: 10,
    borderRadius: 30,
    padding: 2,
  },
  avatarSelected: {
    borderWidth: 2,
    borderColor: "#A47CF3",
  },
  avatarThumb: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  saveButton: {
    backgroundColor: "#A47CF3",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
