import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { COLORS, FONTS } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={FONTS.title}>🏋️‍♂️ FitFlex Gym App</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Explore')}>
        <Text style={FONTS.button}>Explore Exercises</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Favorites')}>
        <Text style={FONTS.button}>My Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NearbyGyms')}>
        <Text style={FONTS.button}>Nearby Gyms</Text>
      </TouchableOpacity>

      {/* New AI Assistant button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AIAssistant')}>
        <Text style={FONTS.button}>AI Calorie Tracker</Text>
      </TouchableOpacity>

      {/* New Exercise Videos button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ExerciseVideos', { bodyPart: '' })}
      >
        <Text style={FONTS.button}>Exercise Videos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.danger }]} onPress={handleLogout}>
        <Text style={FONTS.button}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.background },
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
});
