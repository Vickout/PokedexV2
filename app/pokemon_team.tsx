import * as React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { FlashList } from "@shopify/flash-list";
import { capitalize } from "lodash";
import PokeHeader from "@/components/PokeHeader";
import { ThemedView } from "@/components/ThemedView";

type Props = NativeStackScreenProps<RootStackParamList, "pokemon_team">;

export default function PokemonTeam({ navigation }: Props) {
  return (
    <ThemedView style={styles.container}>
      <PokeHeader title="My Team" />
      <FlashList
        data={[{ id: 1 }, { id: 2 }]}
        numColumns={2}
        contentContainerStyle={{ paddingTop: 32 }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, alignItems: "center" }}>
            <TouchableOpacity style={styles.pokemonContainer}>
              <Image
                source={require("@/assets/images/game-3.png")}
                style={styles.imageBackground}
              />
              {/* <Image source={{ uri: image }} style={styles.spriteImage} /> */}
              <ThemedText style={styles.pokemonName}>
                {capitalize("bulbasaur")}
              </ThemedText>
              <View style={styles.typesContainer}>
                <Image style={styles.typeImage} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </ThemedView>
  );
}

const boxShadow = {
  shadowColor: "#00000066",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4.65,
  elevation: 6,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  pokemonContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    padding: 20,
    ...boxShadow,
  },
  imageBackground: {
    height: 124,
    width: 124,
    opacity: 0.5,
  },
  spriteImage: {
    height: 130,
    width: 130,
  },
  pokemonName: {
    marginVertical: 12,
  },
  typesContainer: {
    flexDirection: "row",
  },
  typeImage: {
    height: 15,
    width: 72,
    resizeMode: "contain",
  },
});
