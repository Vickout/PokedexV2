import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { capitalize } from "@/hooks/useCapitalize";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { usePokemonType } from "@/context/pokemonTypeContext";

type PokemonTeamCardProps = {
  pokemon: IPokemon;
};

export function PokemonTeamCard({ pokemon }: PokemonTeamCardProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { types } = usePokemonType();

  const imageTypes = React.useMemo(() => {
    return types
      .map((type) => {
        if (
          pokemon.types.some(
            (pokemonType) => pokemonType.type.name === type.name
          )
        )
          return type.image;
      })
      .filter((type) => type !== undefined);
  }, [types, pokemon]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="button"
        style={styles.pokemonContainer}
        onPress={() =>
          navigation.navigate("pokemon_stats", { pokemon, imageTypes })
        }
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image
            source={require("@/assets/images/game-3.png")}
            style={styles.imageBackground}
          />
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.spriteImage}
          />
        </View>
        <ThemedText style={styles.pokemonName}>
          {capitalize(pokemon.name)}
        </ThemedText>
        {imageTypes.map((image) => (
          <Image
            key={String(image)}
            source={{ uri: image }}
            style={styles.typeImage}
          />
        ))}
      </TouchableOpacity>
    </View>
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
    alignItems: "center",
    paddingVertical: 10,
  },
  pokemonContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    padding: 20,
    height: 250,
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
    position: "absolute",
  },
  pokemonName: {
    marginVertical: 12,
  },
  typeImage: {
    height: 15,
    width: 72,
    marginBottom: 5,
  },
});
