import React from "react";
import { render, screen } from "@testing-library/react";
import { useTheme } from "hooks/useTheme";
import { DARK_THEME, LIGHT_THEME } from "../../../utils/theme-utils";
import ThemeToggle from "../../../components/layout/ThemeToggle";
import userEvent from "@testing-library/user-event";

jest.mock("hooks/useTheme");

describe("ThemeToggle", () => {
  let toggleThemeMock;

  beforeEach(() => {
    toggleThemeMock = jest.fn();

    useTheme.mockReturnValue({
      theme: chance.pickone([DARK_THEME, LIGHT_THEME]),
      toggleTheme: toggleThemeMock,
    });
  });

  it("should call to toggle the theme when clicked", () => {
    render(<ThemeToggle />);
    const renderedToggle = screen.getByRole("switch");

    userEvent.click(renderedToggle);
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  it("should show the dark mode as on when appropriate", () => {
    useTheme.mockReturnValue({
      theme: DARK_THEME,
      toggleTheme: toggleThemeMock,
    });

    render(<ThemeToggle />);
    expect(screen.getByText(/dark mode: on/i)).toBeInTheDocument;
  });

  it("should show the dark mode as off when appropriate", () => {
    useTheme.mockReturnValue({
      theme: LIGHT_THEME,
      toggleTheme: toggleThemeMock,
    });

    render(<ThemeToggle />);
    expect(screen.getByText(/dark mode: off/i)).toBeInTheDocument;
  });
});
