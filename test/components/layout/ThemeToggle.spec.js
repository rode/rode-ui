/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { useTheme } from "providers/theme";
import { DARK_THEME, LIGHT_THEME } from "../../../utils/theme-utils";
import ThemeToggle from "../../../components/layout/ThemeToggle";
import userEvent from "@testing-library/user-event";

jest.mock("providers/theme");

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
