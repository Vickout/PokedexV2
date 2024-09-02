import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PokeHeader, { PokeHeaderProps } from "@/components/PokeHeader";
import { useNavigation } from "@react-navigation/native";

// Mock the required dependencies
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("<PokeHeader />", () => {
  const mockGoBack = jest.fn();

  beforeEach(() => {
    // Mock the useNavigation hook to return the mock goBack function
    (useNavigation as jest.Mock).mockReturnValue({ goBack: mockGoBack });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title correctly", () => {
    const props: PokeHeaderProps = { title: "Pokédex" };
    const { getByText } = render(<PokeHeader {...props} />);

    // Check if the title is rendered correctly
    expect(getByText("Pokédex")).toBeTruthy();
  });

  it("navigates back when the back button is pressed", () => {
    const props: PokeHeaderProps = { title: "Pokédex" };
    const { getByTestId } = render(<PokeHeader {...props} />);

    // Simulate pressing the back button
    fireEvent.press(getByTestId("button"));

    // Ensure the goBack function is called
    expect(mockGoBack).toHaveBeenCalled();
  });
});
