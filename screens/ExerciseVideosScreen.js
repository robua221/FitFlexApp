import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, FONTS } from '../utils/theme';

export default function ExerciseVideosScreen({ route }) {
  const bodyPartFromRoute = route?.params?.bodyPart || '';
  const [bodyPart, setBodyPart] = useState(bodyPartFromRoute);
  const [url, setUrl] = useState('');

  useEffect(() => {
   
    if (bodyPartFromRoute) {
      searchVideos(bodyPartFromRoute);
    }
  }, [bodyPartFromRoute]);

  const searchVideos = (bp) => {
    const query = encodeURIComponent((bp || bodyPart) + ' workout');
    const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;
    setUrl(youtubeUrl);
    Keyboard.dismiss();
  };

  const resetSearch = () => {
    setUrl('');
    setBodyPart('');
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

          <TouchableOpacity
            style={styles.button}
            onPress={() => searchVideos()}
          >
            <Text style={FONTS.button}>Search</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.backButton} onPress={resetSearch}>
            <Text style={{ color: '#fff', fontWeight: 'bold'  }}>← Back</Text>
          </TouchableOpacity>
          <WebView
            source={{ uri: url }}
            style={{ flex: 1 }}
            startInLoadingState
            scalesPageToFit
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 , marginTop:30},
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
  backButton: {
    backgroundColor: '#6E44FF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop:20
  },
});
