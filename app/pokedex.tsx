import { PokemonCard } from "@/components/PokemonCard";
import PokeInput from "@/components/PokeInput";
import { ThemedView } from "@/components/ThemedView";
import { onDebounce, onThrottle } from "@/hooks/usePerformance";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as React from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import PokeHeader from "@/components/PokeHeader";

type Props = NativeStackScreenProps<RootStackParamList, "pokedex">;

interface PokemonList {
  name: string;
  url: string;
}

export default function Pokedex({ navigation }: Props) {
  const [search, setSearch] = React.useState<string>("");
  const [data, setData] = React.useState<IPokemon[]>([]);
  const [page, setPage] = React.useState<number>(10);

  const throttleRequest = onThrottle(async () => {
    try {
      const param = String(search).toLowerCase();

      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${param}`
      );

      if (response.data.name) {
        setData([response.data]);
      }
    } catch (error) {
      console.log(error);
    }
  });

  const handlePokemonDetails = React.useCallback(async (url: string) => {
    try {
      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const debounceRequest = onDebounce(async () => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${page}`
      );

      const pokemonsInfo = await Promise.all(
        response.data.results.map(
          async (result: PokemonList) => await handlePokemonDetails(result.url)
        )
      );
      setData(pokemonsInfo);
    } catch (error) {
      console.log(error);
    }
  });

  const handlePokemonSearch = React.useCallback((value: string) => {
    setSearch(value);
    throttleRequest();
  }, []);

  React.useEffect(() => {
    if (!search) {
      debounceRequest();
    }
  }, [page, search]);

  return (
    <ThemedView style={styles.container}>
      <PokeHeader title="Pokedex" />
      <PokeInput value={search} onChangeText={handlePokemonSearch} />
      <FlatList
        data={data}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          setPage((prev) => prev + 10);
        }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          return <PokemonCard pokemon={item} />;
        }}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
  },
});
