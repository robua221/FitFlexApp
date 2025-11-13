// screens/FavoritesScreen.js
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
import { COLORS } from "../utils/theme";
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

    const unsubscribe = setInterval(loadFavorites, 2000);
    loadFavorites();

    return () => clearInterval(unsubscribe);
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
    Alert.alert("Clear All", "Clear all favorite exercises?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearFavorites(user.uid);
          setFavorites([]);
        },
      },
    ]);
  };

  if (!favorites.length) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="heart-dislike-outline" size={56} color="#666" />
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptyText}>
          Explore exercises and tap the heart icon to save your favorites 💪
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <ExerciseCard item={item} onPress={() => handleRemove(item.id)} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  clearText: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  emptyText: {
    color: "#ccc",
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
});
