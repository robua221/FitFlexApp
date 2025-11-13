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
import {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
} from "../utils/firebaseUtils";
import { auth } from "../firebase/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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
    (item.bodyPart + item.name).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <LinearGradient
        colors={["#05040A", "#120533", "#2E005D"]}
        style={styles.loadingScreen}
      >
        <ActivityIndicator size="large" color="#A263F6" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#05040A", "#120533", "#2E005D"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.title}>Explore Exercises</Text>
        <Text style={styles.description}>
          Search by body part or exercise name.
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#bbb" />
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Exercise List */}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => {
            const isFav = favs.some((f) => f.id === item.id);
            return (
              <ExerciseCard
                item={item}
                isFavorite={isFav}
                onPress={() => toggleFavorite(item)}
                showFavoriteIcon={true}
              />
            );
          }}
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
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginTop: 10,
  },
  description: {
    fontSize: 13,
    color: "#ccc",
    marginBottom: 12,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
    fontSize: 14,
  },
});
