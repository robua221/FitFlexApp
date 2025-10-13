import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, FONTS } from '../utils/theme';

export default function ExerciseVideosScreen() {
  const [bodyPart, setBodyPart] = useState('');
  const [url, setUrl] = useState('');

  const searchVideos = () => {
    if (!bodyPart.trim()) return;
    const query = encodeURIComponent(`${bodyPart} workout`);
    const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;
    setUrl(youtubeUrl);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {!url ? (
        <>
          <Text style={FONTS.title}>🎥 Search Exercise Videos</Text>

          <TextInput
            placeholder="Enter body part (e.g., chest, abs)"
            placeholderTextColor="#aaa"
            value={bodyPart}
            onChangeText={setBodyPart}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={searchVideos}>
            <Text style={FONTS.button}>Search</Text>
          </TouchableOpacity>
        </>
      ) : (
        <WebView
          source={{ uri: url }}
          style={{ flex: 1 }}
          startInLoadingState
          scalesPageToFit
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
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
