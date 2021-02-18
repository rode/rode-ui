import React from "react";
import { render, screen } from "@testing-library/react";
import useTheme from "hooks/useTheme";
import { DARK_THEME, LIGHT_THEME } from "../../../utils/theme-utils";
import ThemeToggle from "../../../components/layout/ThemeToggle";

jest.mock("hooks/useTheme");

describe("ThemeToggle", () => {
  let toggleThemeMock;

  beforeEach(() => {
    toggleThemeMock = jest.fn();

    useTheme.mockReturnValue({
      theme: chance.pickone([DARK_THEME, LIGHT_THEME]),
      toggleTheme: toggleThemeMock,
    });

    render(<ThemeToggle />);
  });

  it("should call to toggle the theme when clicked", () => {
    screen.getByA;
  });
});
