import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../utils/theme';

export default function ExerciseVideosScreen() {
  const [bodyPart, setBodyPart] = useState('');

  const openYouTube = () => {
    if (!bodyPart.trim()) return;
    const query = encodeURIComponent(`${bodyPart} workout`);
    const url = `https://www.youtube.com/results?search_query=${query}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={FONTS.title}>🎥 Search Exercise Videos</Text>

      <TextInput
        placeholder="Enter body part (e.g., chest, abs)"
        placeholderTextColor="#aaa"
        value={bodyPart}
        onChangeText={setBodyPart}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={openYouTube}>
        <Text style={FONTS.button}>Search on YouTube</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background, justifyContent: 'center' },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});
