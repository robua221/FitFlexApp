import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Buffer } from "buffer";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../utils/theme";
import {
  EXERCISE_IMAGE,
  EXERCISE_RAPIDAPI_KEY,
  EXERCISE_RAPIDAPI_HOST,
} from "@env";

global.Buffer = Buffer;

const ExerciseCard = ({ item, onPress, isFavorite = false, showFavoriteIcon = true }) => {
  const [gifUri, setGifUri] = useState(item.gifUrl);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGif = async () => {
      try {
        const response = await axios.get(EXERCISE_IMAGE, {
          params: { exerciseId: item.id, resolution: "360" },
          headers: {
            "x-rapidapi-key": EXERCISE_RAPIDAPI_KEY,
            "x-rapidapi-host": EXERCISE_RAPIDAPI_HOST,
          },
          responseType: "arraybuffer",
        });

        const base64Gif =
          "data:image/gif;base64," +
          Buffer.from(response.data, "binary").toString("base64");

        setGifUri(base64Gif);
      } catch (e) {
        console.log("GIF fallback used.");
      } finally {
        setLoading(false);
      }
    };

    fetchGif();
  }, [item.id]);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={styles.card}
      onPress={() => onPress(item)}
    >
      {/* GIF */}
      <View style={styles.gifWrapper}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <Image source={{ uri: gifUri }} style={styles.gif} resizeMode="cover" />
        )}

        {/* Gradient overlay for readability */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.overlay}
        />
      </View>

      {/* Favorite Icon */}
      {showFavoriteIcon && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onPress(item)}
        >
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"}
            size={28}
            color={isFavorite ? "#ff4d6d" : "#fff"}
          />
        </TouchableOpacity>
      )}

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>

        <Text style={styles.subText}>
          {item.bodyPart} • {item.target}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  gifWrapper: {
    width: "100%",
    height: 210,
  },

  gif: {
    width: "100%",
    height: "100%",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    height: 90,
    width: "100%",
  },

  favoriteButton: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 6,
    borderRadius: 100,
    zIndex: 10,
  },

  textContainer: {
    padding: 14,
  },

  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  subText: {
    color: "#bbb",
    fontSize: 13,
    marginTop: 3,
    textTransform: "capitalize",
  },
});

export default ExerciseCard;