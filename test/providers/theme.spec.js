import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeComponent from "test/testing-utils/useThemeComponent";
import { ThemeProvider } from "providers/theme";

describe("theme provider", () => {
  beforeEach(() => {
    render(
      <ThemeProvider>
        <ThemeComponent />
      </ThemeProvider>
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("should render the default theme", () => {
    expect(screen.getByText(/light/i)).toBeInTheDocument();
  });

  it("should toggle the theme when prompted", () => {
    const toggleButton = screen.getByText(/toggle/i);

    userEvent.click(toggleButton);
    expect(screen.getByText(/dark/i)).toBeInTheDocument();

    userEvent.click(toggleButton);
    expect(screen.getByText(/light/i)).toBeInTheDocument();
  });
});
