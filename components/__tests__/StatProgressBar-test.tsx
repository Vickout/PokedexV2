import React from "react";
import { render } from "@testing-library/react-native";
import { StatProgressBar } from "@/components/StatProgressBar";

describe("StatProgressBar Component", () => {
  const defaultProps = {
    base_stat: 100,
    name: "attack",
    color: "#ff0000",
  };

  it("renders the correct stat label and value", () => {
    const { getByText } = render(<StatProgressBar {...defaultProps} />);

    expect(getByText("ATK")).toBeTruthy();
    expect(getByText("100")).toBeTruthy();
    expect(getByText("255")).toBeTruthy();
  });

  it("calculates the correct progress bar width", () => {
    const { getByTestId } = render(<StatProgressBar {...defaultProps} />);

    const progressBar = getByTestId("progress-bar");

    // The width should be 39.2% because 100 / 255 * 100 = 39.2%
    expect(progressBar.props.style[1].width).toBe("39.21568627450981%");
  });

  it("renders the correct progress bar color", () => {
    const { getByTestId } = render(<StatProgressBar {...defaultProps} />);

    const progressBar = getByTestId("progress-bar");

    // The background color of the progress bar should be the color prop
    expect(progressBar.props.style[1].backgroundColor).toBe("#ff0000");
  });
});
