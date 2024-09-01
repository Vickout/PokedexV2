import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

type PokemonEvolutionProps = {
  name: string;
  image: string;
  color: string;
  isEvolution?: boolean;
};

export function PokemonEvolution({
  name,
  image,
  color,
  isEvolution,
}: PokemonEvolutionProps) {
  return (
    <View key={name} style={{ alignItems: "center" }}>
      {isEvolution && (
        <Ionicons size={24} name="arrow-down" style={styles.downIcon} />
      )}
      <View style={[styles.spriteImageContainer, { borderColor: color }]}>
        <Image source={{ uri: image }} style={styles.spriteImage} />
      </View>
      <ThemedText>{name}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  spriteImageContainer: {
    borderRadius: 75,
    borderWidth: 2,
    backgroundColor: "#b8b8b854",
  },
  spriteImage: {
    height: 130,
    width: 130,
  },
  downIcon: {
    color: "#808080",
    marginVertical: 15,
  },
});
