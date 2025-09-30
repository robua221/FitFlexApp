import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import { COLORS } from '../utils/theme';
import { MaterialIcons } from '@expo/vector-icons'; 

global.Buffer = Buffer;

const ExerciseCard = ({ item, onPress, isFavorite = false, showFavoriteIcon = false }) => {
  const [gifUri, setGifUri] = useState(item.gifUrl); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGif = async () => {
      try {
        const response = await axios.get('https://exercisedb.p.rapidapi.com/image', {
          params: {
            exerciseId: item.id,
            resolution: '360',
          },
          headers: {
            'x-rapidapi-key': 'e068936fdfmshc1c299760b8c16ep1e2f3ejsn898441aaa8c7',
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
          },
          responseType: 'arraybuffer',
        });

        const base64Gif = `data:image/gif;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
        setGifUri(base64Gif);
      } catch (error) {
        console.warn('Could not fetch animated image, using gifUrl fallback.');
      } finally {
        setLoading(false);
      }
    };

    fetchGif();
  }, [item.id]);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPress(item)}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.gif} />
      ) : (
        <Image source={{ uri: gifUri }} style={styles.gif} resizeMode="cover" />
      )}

      {/* ❤️ Favorite icon (top right) */}
      {showFavoriteIcon && (
        <TouchableOpacity style={styles.heartIcon} onPress={() => onPress(item)}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={28}
            color={isFavorite ? COLORS.danger : COLORS.gray}
          />
        </TouchableOpacity>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name.toUpperCase()}</Text>
        <Text style={styles.details}>
          {item.bodyPart} • {item.target}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  gif: {
    width: '100%',
    height: 200,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 2,
  },
  textContainer: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: COLORS.text,
  },
});

export default ExerciseCard;
