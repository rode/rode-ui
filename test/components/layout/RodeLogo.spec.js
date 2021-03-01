import React from "react";
import { render, screen } from "@testing-library/react";
import RodeLogo from "components/layout/RodeLogo";
import { DARK_THEME, LIGHT_THEME } from "utils/theme-utils";

describe("Rode Logo", () => {
  it("should render the dark theme logo if dark theme is turned on", () => {
    render(<RodeLogo theme={DARK_THEME} />);

    expect(screen.getByTestId("darkThemeLogo")).toBeInTheDocument();
  });
  it("should render the light theme logo if light theme is turned on", () => {
    render(<RodeLogo theme={LIGHT_THEME} />);

    expect(screen.getByTestId("lightThemeLogo")).toBeInTheDocument();
  });
});
