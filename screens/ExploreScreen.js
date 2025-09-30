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
    fetchExercises().then(data => {
      setExercises(data);
      setLoading(false);
    });
    getFavoritesByUser(user.uid).then(setFavs);
  }, []);

  const toggleFavorite = async (item) => {
    if (favs.find(f => f.id === item.id)) {
      await removeFavorite(user.uid, item.id);
      setFavs(favs.filter(f => f.id !== item.id));
    } else {
      await addFavorite(user.uid, item);
      setFavs([...favs, item]);
    }
  };

  // Filter exercises by search term
  const filteredExercises = exercises.filter((item) =>
    item.bodyPart.toLowerCase().includes(search.toLowerCase()) ||
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{flex:1}} />;
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, padding:15 }}>
      
      
      <TextInput
        placeholder="Search exercises (e.g., abs, push-up)..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isFav = favs.some(f => f.id === item.id);
          return (
            <ExerciseCard
              item={item}
              onPress={toggleFavorite}
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
