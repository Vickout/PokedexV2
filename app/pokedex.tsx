import { PokemonCard } from "@/components/PokemonCard";
import PokeInput from "@/components/PokeInput";
import { ThemedView } from "@/components/ThemedView";
import { onDebounce, onThrottle } from "@/hooks/usePerformance";
import axios from "axios";
import * as React from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  View,
} from "react-native";
import PokeHeader from "@/components/PokeHeader";
import { ThemedText } from "@/components/ThemedText";

interface PokemonList {
  name: string;
  url: string;
}

export default function Pokedex() {
  const [search, setSearch] = React.useState<string>("");
  const [data, setData] = React.useState<IPokemon[]>([]);
  const [page, setPage] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const throttleRequest = onThrottle(async () => {
    setLoading(true);
    try {
      const param = String(search).toLowerCase();

      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${param}`
      );

      if (response.data.name) {
        setData([response.data]);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setIsVisible(false);
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
    } finally {
      setIsVisible(false);
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
    <>
      <ThemedView style={styles.container}>
        <PokeHeader title="Pokedex" />
        <View style={{ paddingHorizontal: 20 }}>
          <PokeInput value={search} onChangeText={handlePokemonSearch} />
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={data}
              onEndReachedThreshold={0.4}
              onEndReached={() => {
                setPage((prev) => prev + 10);
                setIsVisible(true);
              }}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                return <PokemonCard pokemon={item} />;
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ThemedView>
      <Modal
        animationType="fade"
        visible={isVisible}
        transparent
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <ActivityIndicator color={"white"} />
          <ThemedText type="subtitle" style={{ color: "white" }}>
            Fetching data...
          </ThemedText>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000066",
    alignItems: "center",
    justifyContent: "center",
  },
});
