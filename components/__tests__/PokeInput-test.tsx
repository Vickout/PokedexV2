import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PokeInput from "@/components/PokeInput";

describe("PokeInput Component", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(
      <PokeInput value="" onChangeText={() => {}} />
    );

    expect(getByPlaceholderText("Search for Pokémon...")).toBeTruthy();
  });

  it("displays the correct value", () => {
    const { getByDisplayValue } = render(
      <PokeInput value="Pikachu" onChangeText={() => {}} />
    );

    expect(getByDisplayValue("Pikachu")).toBeTruthy();
  });

  it("calls the onChangeText function when text is entered", () => {
    const onChangeTextMock = jest.fn();

    const { getByPlaceholderText } = render(
      <PokeInput value="" onChangeText={onChangeTextMock} />
    );

    const input = getByPlaceholderText("Search for Pokémon...");
    fireEvent.changeText(input, "Bulbasaur");

    expect(onChangeTextMock).toHaveBeenCalledWith("Bulbasaur");
  });

  it("applies additional props correctly", () => {
    const { getByPlaceholderText } = render(
      <PokeInput value="" onChangeText={() => {}} keyboardType="numeric" />
    );

    const input = getByPlaceholderText("Search for Pokémon...");
    expect(input.props.keyboardType).toBe("numeric");
  });
});
