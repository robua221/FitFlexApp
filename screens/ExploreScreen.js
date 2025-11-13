// screens/ExploreScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Text,
} from "react-native";
import { fetchExercises } from "../api/exerciseApi";
import ExerciseCard from "../components/ExerciseCard";
import { COLORS } from "../utils/theme";
import {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
} from "../utils/firebaseUtils";
import { auth } from "../firebase/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ExploreScreen() {
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [favs, setFavs] = useState([]);
  const [search, setSearch] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchExercises();
      setExercises(data);
      setLoading(false);

      if (user?.uid) {
        const favsData = await getFavoritesByUser(user.uid);
        setFavs(favsData);
      }
    };
    loadData();
  }, []);

  const toggleFavorite = async (item) => {
    if (!user?.uid) return;
    const isFav = favs.find((f) => f.id === item.id);

    if (isFav) {
      await removeFavorite(user.uid, item.id);
      setFavs((prev) => prev.filter((f) => f.id !== item.id));
    } else {
      const safeItem = {
        id: item.id?.toString() || Date.now().toString(),
        name: item.name || "Unknown",
        gifUrl: item.gifUrl ?? "",
        bodyPart: item.bodyPart || "",
        equipment: item.equipment || "",
        target: item.target || "",
      };

      await addFavorite(user.uid, safeItem);
      setFavs((prev) => [...prev, safeItem]);
    }
  };

  const filteredExercises = exercises.filter((item) =>
    (item.bodyPart + item.name)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ flex: 1 }}
      />
    );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Explore Exercises</Text>
      <Text style={styles.description}>
        Search by body part or exercise name, then tap the heart to favorite.
      </Text>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color="#aaa" />
        <TextInput
          placeholder="Search exercises (e.g. chest, squats)..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
        renderItem={({ item }) => {
          const isFav = favs.some((f) => f.id === item.id);
          return (
            <ExerciseCard
              item={item}
              onPress={() => toggleFavorite(item)}
              isFavorite={isFav}
              showFavoriteIcon={true}
            />
          );
        }}
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 10,
  },
  description: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b1b1f",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
    fontSize: 14,
  },
});
