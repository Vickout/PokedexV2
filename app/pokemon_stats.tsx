import { StatProgressBar } from "@/components/StatProgressBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { pokemon_type_color } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { capitalize } from "@/hooks/useCapitalize";
import axios from "axios";
import { PokemonEvolution } from "@/components/PokemonEvolution";
import { add, remove, getById } from "@/databases";

type Props = NativeStackScreenProps<RootStackParamList, "pokemon_stats">;

type InfoProps = "stats" | "evolution" | "moves";

type InfoHeaderProps = { name: string; id: InfoProps };

type EvolutionProps = {
  species: {
    image: string;
    name: string;
  };
  evolves_to: Array<{
    image: string;
    name: string;
    evolves_to: Array<{
      image: string;
      name: string;
    }>;
  }>;
};

export default function PokemonStats({ route, navigation }: Props) {
  const [infoSelected, setInfoSelected] = React.useState<InfoProps>("stats");
  const [about, setAbout] = React.useState<string>("");
  const [evolutions, setEvolutions] = React.useState<EvolutionProps[]>([]);
  const [isMyPokemon, setIsMyPokemon] = React.useState<boolean>(false);

  const pokemon = React.useMemo(() => {
    return { ...route.params.pokemon, imageTypes: route.params.imageTypes };
  }, [route.params.pokemon]);

  const infoHeader = React.useMemo(() => {
    return [
      { name: "Stats", id: "stats" },
      { name: "Evolution", id: "evolution" },
      { name: "Moves", id: "moves" },
    ] as InfoHeaderProps[];
  }, [infoSelected]);

  const formattedAbout = React.useMemo(() => {
    return about.replace(/\s+/g, " ").trim();
  }, [about]);

  const typeColor = React.useMemo(() => {
    const firstColor = Object.keys(pokemon_type_color).find(
      (color) => `${pokemon.types[0].type.name}_colors` === color
    );

    return pokemon_type_color[firstColor];
  }, [pokemon.types]);

  const handleEvolution = React.useCallback(
    async (evolutionName: string): Promise<IPokemon | undefined> => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${evolutionName}`
        );

        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  const handleSpecies = React.useCallback(async (url: string) => {
    try {
      const speciesData = await axios.get(url);

      setAbout(speciesData.data.flavor_text_entries[0].flavor_text);

      if (!!Object.keys(speciesData.data).length) {
        const evolutionData = await axios.get(
          speciesData.data.evolution_chain.url
        );

        let evolutionInfo: EvolutionProps = {
          species: {
            name: "",
            image: "",
          },
          evolves_to: [],
        };

        const baseEvolutionChain = await axios.get(
          evolutionData.data.chain.species.url
        );

        const baseEvolution = await handleEvolution(
          baseEvolutionChain.data.name
        );

        if (baseEvolution !== undefined) {
          evolutionInfo = {
            ...evolutionInfo,
            species: {
              name: capitalize(baseEvolution.name),
              image: baseEvolution.sprites.front_default,
            },
          };
        }

        const evolutionChain = await Promise.all(
          evolutionData.data.chain.evolves_to.map(async (evolve: any) => {
            const evolution = await handleEvolution(evolve.species.name);

            if (evolution !== undefined) {
              let evolves_to = [];

              if (!!evolve.evolves_to.length) {
                evolves_to = await Promise.all(
                  evolve.evolves_to.map(async (nextEvolve: any) => {
                    const nextEvolution = await handleEvolution(
                      nextEvolve.species.name
                    );

                    if (nextEvolution !== undefined) {
                      return {
                        name: capitalize(nextEvolution.name),
                        image: nextEvolution.sprites.front_default,
                      };
                    }
                  })
                );
              }

              evolutionInfo = {
                ...evolutionInfo,
                evolves_to: [
                  ...evolutionInfo.evolves_to,
                  {
                    name: capitalize(evolution.name),
                    image: evolution.sprites.front_default,
                    evolves_to,
                  },
                ],
              };
            }

            return evolutionInfo;
          })
        );

        setEvolutions(evolutionChain);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const hanldeAddPokemon = React.useCallback(async () => {
    await add(pokemon);
    setIsMyPokemon(true);
  }, [pokemon]);

  const hanldeDeletePokemon = React.useCallback(async () => {
    await remove(pokemon.id);
    setIsMyPokemon(false);
  }, [pokemon]);

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
    handleSpecies(pokemon.species.url);
  }, [pokemon.species.url]);

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: typeColor + "aa" }]}
    >
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons size={24} name="chevron-back" style={styles.backIcon} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: "absolute",
          top: 56,
          right: 20,
          zIndex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            isMyPokemon ? hanldeDeletePokemon() : hanldeAddPokemon();
          }}
        >
          <Image
            source={
              isMyPokemon
                ? require("@/assets/images/pokeball.png")
                : require("@/assets/images/pokeball-2.png")
            }
            style={{
              width: 48,
              height: 48,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.pokeballImageContainer}>
        <Image
          source={require("@/assets/images/game-2.png")}
          style={styles.pokeballImage}
        />
        <Image
          source={{
            uri: pokemon.sprites.other["official-artwork"].front_default,
          }}
          style={styles.pokemonImage}
        />
      </View>
      <ThemedView style={styles.content}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <View
            style={[
              styles.pokemonNameContainer,
              { backgroundColor: typeColor },
            ]}
          >
            <ThemedText type="title" style={styles.pokemonName}>
              {capitalize(pokemon.name)}
            </ThemedText>
          </View>
          <View style={styles.typesContainer}>
            {pokemon.imageTypes.map((image) => (
              <Image
                key={String(image)}
                source={{ uri: image }}
                style={styles.typeImage}
              />
            ))}
          </View>
        </View>
        <View style={styles.contentHeader}>
          {infoHeader.map((info) => {
            const backgroundColor =
              info.id === infoSelected ? typeColor : undefined;

            const color = info.id !== infoSelected ? typeColor : "white";
            return (
              <TouchableOpacity
                key={info.id}
                onPress={() => {
                  if (info.id === "evolution") {
                    handleSpecies(pokemon.species.url);
                  }
                  setInfoSelected(info.id);
                }}
                style={{
                  backgroundColor,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  borderRadius: 20,
                }}
              >
                <ThemedText type="defaultSemiBold" style={{ color }}>
                  {info.name}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {infoSelected === "stats" && (
            <>
              {pokemon.stats.map((stat) => (
                <StatProgressBar
                  key={stat.stat.name}
                  base_stat={stat.base_stat}
                  name={stat.stat.name}
                  color={
                    pokemon.types[0].type.name === "normal"
                      ? "black"
                      : typeColor
                  }
                />
              ))}

              <ThemedText
                type="subtitle"
                style={[styles.aboutTitle, { color: typeColor }]}
              >
                About
              </ThemedText>
              <ThemedText style={styles.about}>{formattedAbout}</ThemedText>
            </>
          )}
          {infoSelected === "evolution" && (
            <>
              {evolutions.length ? (
                evolutions.map((evolution) => (
                  <View key={evolution.species.name}>
                    <PokemonEvolution
                      key={evolution.species.name}
                      name={evolution.species.name}
                      image={evolution.species.image}
                      color={typeColor}
                    />
                    {evolution.evolves_to.map((evolve) => (
                      <View key={evolve.name}>
                        <PokemonEvolution
                          name={evolve.name}
                          image={evolve.image}
                          color={typeColor}
                          isEvolution
                        />
                        {evolve.evolves_to.map((nextEvolve) => (
                          <PokemonEvolution
                            key={nextEvolve.name}
                            name={nextEvolve.name}
                            image={nextEvolve.image}
                            color={typeColor}
                            isEvolution
                          />
                        ))}
                      </View>
                    ))}
                  </View>
                ))
              ) : (
                <View style={styles.noEvolutionContainer}>
                  <ThemedText type="subtitle" style={{}}>
                    No evolutions
                  </ThemedText>
                </View>
              )}
            </>
          )}

          {infoSelected === "moves" &&
            pokemon.moves.map((move) => (
              <View key={String(move.move.name)} style={styles.moveContainer}>
                <ThemedText>{capitalize(move.move.name)}</ThemedText>
              </View>
            ))}
        </ScrollView>
      </ThemedView>
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
    backgroundColor: "#b8b8b8",
  },
  backButton: {
    width: 48,
    height: 48,
    position: "absolute",
    top: 56,
    left: 20,
    borderRadius: 24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    ...boxShadow,
  },
  backIcon: {
    color: "#808080",
  },
  pokeballImageContainer: {
    marginTop: 64,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  typesContainer: {
    flexDirection: "row",
  },
  typeImage: {
    height: 15,
    width: 72,
    resizeMode: "contain",
  },
  pokeballImage: {
    width: 300,
    height: 300,
    opacity: 0.2,
    alignItems: "center",
  },
  pokemonImage: {
    width: 250,
    height: 250,
    position: "absolute",
    bottom: -30,
  },
  content: {
    flex: 1,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    marginHorizontal: 10,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 32,
    zIndex: -1,
  },
  pokemonNameContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingTop: 12,
    left: -20,
    alignItems: "center",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  pokemonName: {
    alignSelf: "center",
    color: "white",
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  noEvolutionContainer: {
    alignItems: "center",
    paddingTop: 32,
  },
  aboutTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  about: {
    textAlign: "justify",
  },
  moveContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#b8b8b8",
  },
});
