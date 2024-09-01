import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import axios from "axios";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { pokemon_type_color } from "@/constants/Colors";

type PokemonCardProps = {
  pokemon: IPokemon;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [types, setTypes] = React.useState<string[]>([]);

  const pokemonOrder = React.useMemo(() => {
    return `#${String(pokemon.order).padStart(3, "0")}`;
  }, [pokemon.order]);

  const typeColor = React.useMemo(() => {
    const firstColor = Object.keys(pokemon_type_color).find(
      (color) => `${pokemon?.types[0]?.type?.name}_colors` === color
    );

    return pokemon_type_color[firstColor];
  }, [pokemon.types]);

  const handleTypeImage = React.useCallback(async (url: string) => {
    try {
      const response = await axios.get(url);

      return response.data.sprites["generation-viii"]["sword-shield"]
        .name_icon as string;
    } catch (error) {}
  }, []);

  const hanldeTypes = React.useCallback(async () => {
    const images = await Promise.all(
      pokemon.types.map(async ({ type }) => {
        return await handleTypeImage(type.url);
      })
    );

    setTypes(images.filter((image) => image !== undefined));
  }, [handleTypeImage]);

  const handlePress = React.useCallback(() => {
    navigation.navigate("pokemon_stats", { pokemon, imageTypes: types });
  }, [pokemon, types]);

  React.useEffect(() => {
    hanldeTypes();
  }, []);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: typeColor + "aa" }]}
      onPress={handlePress}
    >
      <View style={styles.subContainer}>
        <View style={styles.contentContainer}>
          <ThemedText type="defaultSemiBold">{pokemonOrder}</ThemedText>
          <View style={{ flexDirection: "row" }}>
            {types.map((image) => (
              <Image
                key={String(image)}
                source={{ uri: image }}
                style={styles.typeImage}
              />
            ))}
          </View>
        </View>
        <Image
          source={{ uri: pokemon.sprites.front_default }}
          style={styles.spriteImage}
        />
      </View>
      <Image
        source={require("@/assets/images/game.png")}
        style={styles.pokeballLogo}
      />
      <View style={styles.pokeballButton}>
        <Image
          source={require("@/assets/images/pokeball-2.png")}
          style={styles.pokeball}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: "#b8b8b8",
    minHeight: 124,
    marginBottom: 20,
    overflow: "hidden",
  },
  subContainer: {
    flexDirection: "row",
    flex: 1,
  },
  contentContainer: {
    justifyContent: "space-between",
    padding: 20,
    flex: 1,
  },
  typeContainer: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "red",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  spriteImage: {
    height: 130,
    width: 130,
    marginRight: 30,
  },
  typeImage: {
    height: 15,
    width: 72,
    resizeMode: "contain",
    marginRight: 8,
  },
  pokeballButton: {
    right: 10,
    top: 10,
    position: "absolute",
  },
  pokeball: {
    height: 30,
    width: 30,
  },
  pokeballLogo: {
    height: 178,
    width: 178,
    right: 0,
    transform: "rotateZ(45deg)",
    position: "absolute",
    opacity: 0.8,
    zIndex: -1,
  },
});
