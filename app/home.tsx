import * as React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { onThrottle } from "@/hooks/usePerformance";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PokemonCard } from "@/components/PokemonCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import PokeInput from "@/components/PokeInput";
import { useToast } from "@/context/toastContext";

type Props = NativeStackScreenProps<RootStackParamList, "home">;

export default function Home({ navigation }: Props) {
  const [search, setSearch] = React.useState<string>("");
  const [data, setData] = React.useState<IPokemon>({} as IPokemon);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { showToast } = useToast();

  const throttleRequest = onThrottle(async () => {
    setLoading(true);
    try {
      const param = String(search).toLowerCase();

      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${param}`
      );

      if (response.data.name) {
        setData(response.data);
      } else {
        setData({} as IPokemon);
      }
    } catch (error) {
      console.log(error);
      showToast("Error to fetch data");
    } finally {
      setLoading(false);
    }
  });

  const handlePokemonSearch = React.useCallback((value: string) => {
    setSearch(value);
    throttleRequest();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@/assets/images/pokemon_logo.png")}
        style={styles.logo}
      />
      <ThemedText type="title">
        What do you want to know about Pokémon?
      </ThemedText>
      <PokeInput value={search} onChangeText={handlePokemonSearch} />
      {loading ? (
        <ActivityIndicator />
      ) : Object.keys(data).length ? (
        <PokemonCard pokemon={data} />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { width: "40%", backgroundColor: "green" }]}
            onPress={() => navigation.navigate("pokemon_team")}
          >
            <Image
              source={require("@/assets/images/gaming.png")}
              style={styles.buttonImage}
            />
            <ThemedText style={[styles.buttonText, { width: 50 }]}>
              My team
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { width: "55%", backgroundColor: "blue" }]}
            onPress={() => navigation.navigate("pokedex")}
          >
            <Image
              source={require("@/assets/images/avatar-2.png")}
              style={styles.buttonImage}
            />
            <ThemedText style={styles.buttonText}>Pokedex</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 64,
  },
  logo: {
    height: 64,
    width: 180,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 42,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    height: 72,
    borderRadius: 8,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
    overflow: "hidden",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
    textAlign: "right",
  },
  buttonImage: {
    width: 70,
    height: 70,
    position: "absolute",
    top: 0,
    left: 10,
    opacity: 0.6,
  },
});
