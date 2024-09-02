import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import axios from "axios";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { pokemon_type_color } from "@/constants/Colors";
import { getById } from "@/databases";
import { capitalize } from "@/hooks/useCapitalize";

type PokemonCardProps = {
  pokemon: IPokemon;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [types, setTypes] = React.useState<string[]>([]);
  const [isMyPokemon, setIsMyPokemon] = React.useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

  const hanldeGetPokemon = React.useCallback(async () => {
    const myPokemon = await getById(pokemon.id);

    if (myPokemon !== null && myPokemon !== undefined) {
      setIsMyPokemon(true);
    }
  }, [pokemon]);

  React.useEffect(() => {
    hanldeGetPokemon();
  }, []);

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
          <ThemedText type="subtitle">{capitalize(pokemon.name)}</ThemedText>
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
          source={
            isMyPokemon
              ? require("@/assets/images/pokeball.png")
              : require("@/assets/images/pokeball-2.png")
          }
          style={styles.pokeball}
        />
      </View>
    </TouchableOpacity>
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
    borderRadius: 8,
    backgroundColor: "white",
    minHeight: 124,
    marginBottom: 20,
    overflow: "hidden",
    ...boxShadow,
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
    opacity: 0.2,
    zIndex: -1,
  },
});
