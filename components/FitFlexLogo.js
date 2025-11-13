import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function FitFlexLogo({ size = 48 }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.logo,
          {
            fontSize: size,
            transform: [{ scale }],
          },
        ]}
      >
        FITFLEX
      </Animated.Text>

      <LinearGradient
        colors={["#6E44FF", "#B26BFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.underline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    fontWeight: "900",
    letterSpacing: 3,
    color: "#ffffff",
  },
  underline: {
    marginTop: 6,
    width: 140,
    height: 5,
    borderRadius: 999,
  },
});
