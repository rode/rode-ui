import React from "react";
import { render, screen } from "@testing-library/react";
import { DARK_THEME, LIGHT_THEME } from "utils/theme-utils";
import Liatrio from "components/icons/Liatrio";

describe("Liatrio", () => {
  it("should render the dark theme svg when specified", () => {
    render(<Liatrio theme={DARK_THEME} />);

    expect(screen.getByTestId("darkThemeLiatrioLogo")).toBeInTheDocument();
  });
  it("should render the light theme svg when specified", () => {
    render(<Liatrio theme={LIGHT_THEME} />);

    expect(screen.getByTestId("lightThemeLiatrioLogo")).toBeInTheDocument();
  });
});
