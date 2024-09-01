/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export type PokemonTypeColorProps = {
  grass_colors: string,
  poison_colors: string,
  fire_colors: string,
  flying_colors: string,
  water_colors: string,
  normal_colors: string,
  eletric_colors: string,
  ground_colors: string,
  fairy_colors: string,
  bug_colors: string,
  fighting_colors: string,
  psychic_colors: string,
  rock_colors: string,
  steel_colors: string,
  ice_colors: string,
  ghost_colors: string,
  dark_colors: string,
  dragon_colors: string,
}

export const pokemon_type_color = {
  grass_colors: "#1b932c",
  poison_colors: "#8849b0",
  fire_colors: "#ec8c4c",
  flying_colors: "#aacbe1",
  water_colors: "#265dfc",
  normal_colors: "#b8b8b8",
  electric_colors: "#ffce30",
  ground_colors: "#9e6e53",
  fairy_colors: "#ff48cc",
  bug_colors: "#d0ec94",
  fighting_colors: "#f10a34",
  psychic_colors: "#e389b9",
  rock_colors: "#673e2c",
  steel_colors: "#89a0b3",
  ice_colors: "#20c5f5",
  ghost_colors: "#a98df8",
  dark_colors: "#00000",
  dragon_colors: "#0804b4",
}
