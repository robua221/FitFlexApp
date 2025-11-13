import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  getFavoritesByUser,
  removeFavorite,
  clearFavorites,
} from "../utils/firebaseUtils";
import { auth } from "../firebase/config";
import ExerciseCard from "../components/ExerciseCard";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const loadFavorites = async () => {
      if (user?.uid) {
        const favs = await getFavoritesByUser(user.uid);
        const uniqueFavs = favs.filter(
          (item, index, arr) => arr.findIndex((i) => i.id === item.id) === index
        );
        setFavorites(uniqueFavs);
      }
    };

    const timer = setInterval(loadFavorites, 1500);
    loadFavorites();
    return () => clearInterval(timer);
  }, [user?.uid]);

  const handleRemove = (exerciseId) => {
    Alert.alert("Remove Favorite", "Remove this exercise from favorites?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeFavorite(user.uid, exerciseId);
          setFavorites((prev) => prev.filter((item) => item.id !== exerciseId));
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all exercises?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearFavorites(user.uid);
            setFavorites([]);
          },
        },
      ]
    );
  };

  if (!favorites.length) {
    return (
      <LinearGradient
        colors={["#05040A", "#120533", "#2E005D"]}
        style={styles.emptyContainer}
      >
        <Ionicons name="heart-dislike-outline" size={70} color="#999" />
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptyText}>
          Explore exercises and tap the heart icon to save your favorites 💪
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Favorites</Text>

          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={16} color="#fff" />
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ExerciseCard item={item} onPress={() => handleRemove(item.id)} />
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "800",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 70, 70, 0.25)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,70,70,0.4)",
  },
  clearText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 14,
  },
  emptyText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    maxWidth: "80%",
  },
});
