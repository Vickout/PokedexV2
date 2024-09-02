import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./home";
import PokemonStats from "./pokemon_stats";
import PokemonTeam from "./pokemon_team";
import Pokedex from "./pokedex";
import { PokemonTypeProvider } from "@/context/pokemonTypeContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PokemonTypeProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="pokemon_stats" component={PokemonStats} />
        <Stack.Screen name="pokemon_team" component={PokemonTeam} />
        <Stack.Screen name="pokedex" component={Pokedex} />
      </Stack.Navigator>
    </PokemonTypeProvider>
  );
}
