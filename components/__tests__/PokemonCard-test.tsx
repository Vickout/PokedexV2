import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PokemonCard } from "@/components/PokemonCard";
import { useNavigation } from "@react-navigation/native";
import { getById } from "@/databases/index"; // Assuming this is where getById is from
import { usePokemonType } from "@/context/pokemonTypeContext"; // Assuming usePokemonType is from this hook
import pokemon from "./pokemon-test.json";

// Mock the necessary modules
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("@/context/pokemonTypeContext", () => ({
  usePokemonType: jest.fn(),
}));

jest.mock("@/databases/index", () => ({
  getById: jest.fn(),
}));

describe("PokemonCard Component", () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockTypes = [
    {
      name: "grass",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/12.png",
    },
  ];

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (usePokemonType as jest.Mock).mockReturnValue({ types: mockTypes });
    (getById as jest.Mock).mockResolvedValue(null);
  });

  it("renders correctly with given pokemon data", () => {
    const { getByText, getByTestId } = render(
      <PokemonCard pokemon={pokemon} />
    );

    // Check if pokemon order and name are rendered
    expect(getByText("#001")).toBeTruthy();
    expect(getByText("Bulbasaur")).toBeTruthy();

    // Check if the sprite image is rendered
    const spriteImage = getByTestId("sprite-image");
    expect(spriteImage.props.source.uri).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    );

    // Check if the type image is rendered
    const typeImage = getByTestId("type-image");
    expect(typeImage.props.source.uri).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/12.png"
    );
  });

  it("navigates to the pokemon stats screen on press", () => {
    const { getByTestId } = render(<PokemonCard pokemon={pokemon} />);

    const touchable = getByTestId("pokemon-card-touchable");
    fireEvent.press(touchable);

    expect(mockNavigation.navigate).toHaveBeenCalledWith("pokemon_stats", {
      pokemon,
      imageTypes: [
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/12.png",
      ],
    });
  });

  it("displays the correct pokeball based on isMyPokemon state", async () => {
    // Mock getById to return a pokemon, indicating isMyPokemon is true
    (getById as jest.Mock).mockResolvedValueOnce({ id: 1 });

    const { findByTestId } = render(<PokemonCard pokemon={pokemon} />);

    // Check if the pokeball image for "isMyPokemon" state is rendered
    const pokeballImage = await findByTestId("pokeball-image");
    expect(pokeballImage.props.source).toEqual(
      require("@/assets/images/pokeball.png")
    );
  });
});
