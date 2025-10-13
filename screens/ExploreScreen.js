import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { fetchExercises } from '../api/exerciseApi';
import ExerciseCard from '../components/ExerciseCard';
import { COLORS } from '../utils/theme';
import { addFavorite, removeFavorite, getFavoritesByUser } from '../utils/firebaseUtils';
import { auth } from '../firebase/config';
import { SafeAreaView } from 'react-native-safe-area-context';

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

    const isFav = favs.find(f => f.id === item.id);

    if (isFav) {
      await removeFavorite(user.uid, item.id);
      setFavs(prev => prev.filter(f => f.id !== item.id));
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
      setFavs(prev => [...prev, safeItem]);
    }
  };

  const filteredExercises = exercises.filter((item) =>
    item.bodyPart.toLowerCase().includes(search.toLowerCase()) ||
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, padding: 15 }}>
      <TextInput
        placeholder="Search exercises (e.g., abs, push-up)..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isFav = favs.some(f => f.id === item.id);
          return (
            <ExerciseCard
              item={item}
              onPress={() => toggleFavorite(item)}
              isFavorite={isFav}
              showFavoriteIcon={true}
              searchTerm={search}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    color: "#000",
  }
});
