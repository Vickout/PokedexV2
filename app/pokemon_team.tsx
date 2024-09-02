import * as React from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";

import PokeHeader from "@/components/PokeHeader";
import { ThemedView } from "@/components/ThemedView";
import { getAll } from "@/databases";
import { PokemonTeamCard } from "@/components/PokemonTeamCard";
import { useIsFocused } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";

export default function PokemonTeam() {
  const [pokemons, setPokemons] = React.useState<IPokemon[]>([]);

  const isFocused = useIsFocused();

  const hanldeGetPokemons = React.useCallback(async () => {
    const myPokemons: Array<IPokemon> = await getAll();
    setPokemons(myPokemons);
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      hanldeGetPokemons();
    }
  }, [isFocused]);

  return (
    <ThemedView style={styles.container}>
      <PokeHeader title="My Team" />
      <FlatList
        data={pokemons}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 32 }}
        renderItem={({ item }) => <PokemonTeamCard pokemon={item} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Image
              source={require("@/assets/images/pokeball-2.png")}
              style={styles.pokeball}
            />
            <ThemedText style={styles.text}>
              Save your favorite Pokémon here!
            </ThemedText>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 64,
  },
  pokeball: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  text: {
    width: 150,
    textAlign: "center",
  },
});
