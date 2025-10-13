import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { getFavoritesByUser, removeFavorite, clearFavorites } from '../utils/firebaseUtils';
import { auth } from '../firebase/config';
import ExerciseCard from '../components/ExerciseCard';
import { COLORS, FONTS } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const user = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      if (!user?.uid) return;

      const fetchFavs = async () => {
        const favs = await getFavoritesByUser(user.uid);

        // Remove duplicate entries
        const uniqueFavs = favs.filter(
          (item, index, arr) => arr.findIndex(i => i.id === item.id) === index
        );

        setFavorites(uniqueFavs);
      };

      fetchFavs();
    }, [user])
  );

  const handleRemove = (exerciseId) => {
    Alert.alert(
      "Remove Favorite",
      "Are you sure you want to remove this exercise from favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: async () => {
            await removeFavorite(user.uid, exerciseId);
            setFavorites(prev => prev.filter(item => item.id !== exerciseId));
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to clear all favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          onPress: async () => {
            await clearFavorites(user.uid);
            setFavorites([]);
          },
          style: "destructive"
        }
      ]
    );
  };

  if (!favorites.length) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={FONTS.title}>No favorites yet!</Text>
        <Text style={{ color: COLORS.text, marginTop: 10 }}>Go to Explore and add some 💪</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExerciseCard
            item={item}
            onPress={() => handleRemove(item.id)}
            showFavoriteIcon={true}
            isFavorite={true}
          />
        )}
      />
      <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
        <Text style={FONTS.button}>Clear All Favorites</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: COLORS.background,marginTop:40 },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background,
  },
  clearButton: {
    backgroundColor: COLORS.danger,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10
  }
});
