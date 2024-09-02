import React from "react";
import { render } from "@testing-library/react-native";
import { PokemonEvolution } from "@/components/PokemonEvolution";

describe("<PokemonEvolution />", () => {
  it("renders correctly", () => {
    const { getByText, getByTestId } = render(
      <PokemonEvolution
        name="Bulbasaur"
        image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
        color="#1b932c"
        isEvolution={false}
      />
    );

    // Check if the name is rendered
    expect(getByText("Bulbasaur")).toBeTruthy();

    // Check if the image is rendered with correct URI
    const image = getByTestId("sprite_image");
    expect(image.props.source.uri).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    );
  });

  it("applies the correct border color", () => {
    const { getByTestId } = render(
      <PokemonEvolution
        name="Charmander"
        image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
        color="#F08030"
      />
    );

    const imageContainer = getByTestId("sprite_image_container");

    expect(imageContainer.props.style[1].borderColor).toBe("#F08030");
  });
});
