import * as React from "react";
import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList } from "@shopify/flash-list";

import { onThrottle, onDebounce } from "@/hooks/usePerformance";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PokemonCard } from "@/components/PokemonCard";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import PokeInput from "@/components/PokeInput";

type Props = NativeStackScreenProps<RootStackParamList, "home">;

export default function Home({ navigation }: Props) {
  const [search, setSearch] = React.useState<string>("");
  const [data, setData] = React.useState<IPokemon[]>([]);

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

  const handlePokemonSearch = React.useCallback((value: string) => {
    setSearch(value);
    throttleRequest();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        O que você quer saber sobre os Pokémons?
      </ThemedText>
      <PokeInput value={search} onChangeText={handlePokemonSearch} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={[styles.button, { width: "40%", backgroundColor: "green" }]}
          onPress={() => navigation.navigate("pokemon_team")}
        >
          <ThemedText style={styles.buttonText}>My team</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { width: "55%", backgroundColor: "blue" }]}
          onPress={() => navigation.navigate("pokedex")}
        >
          <ThemedText style={styles.buttonText}>Pokedex</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  button: {
    height: 64,
    borderRadius: 8,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 8
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: "700"
  },
});
