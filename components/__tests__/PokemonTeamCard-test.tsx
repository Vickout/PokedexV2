import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PokemonTeamCard } from "@/components/PokemonTeamCard";
import { useNavigation } from "@react-navigation/native";
import { usePokemonType } from "@/context/pokemonTypeContext";
import pokemon from "./pokemon-test.json";

// Mock the required dependencies
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("@/context/pokemonTypeContext", () => ({
  usePokemonType: jest.fn(),
}));

jest.mock("@/hooks/useCapitalize", () => ({
  capitalize: jest.fn(
    (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
  ),
}));

describe("<PokemonTeamCard />", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Mock the useNavigation hook to return the mock navigate function
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    // Mock usePokemonType to return a list of types
    (usePokemonType as jest.Mock).mockReturnValue({
      types: [
        {
          name: "grass",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/12.png",
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Pokémon name correctly", () => {
    const { getByText } = render(<PokemonTeamCard pokemon={pokemon} />);

    // Check if the Pokémon name is rendered correctly
    expect(getByText("Bulbasaur")).toBeTruthy();
  });

  it("navigates to the 'pokemon_stats' screen with correct parameters when pressed", () => {
    const { getByTestId } = render(<PokemonTeamCard pokemon={pokemon} />);

    // Simulate pressing the card
    fireEvent.press(getByTestId("button"));

    // Ensure the navigate function is called with correct parameters
    expect(mockNavigate).toHaveBeenCalledWith("pokemon_stats", {
      pokemon,
      imageTypes: [
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/12.png",
      ],
    });
  });
});
