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
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeComponent from "test/testing-utils/hook-components/useThemeComponent";
import { ThemeProvider } from "providers/theme";
import { isServerSide } from "utils/shared-utils";

jest.mock("utils/shared-utils");

describe("theme provider", () => {
  let rerender;

  beforeEach(() => {
    isServerSide.mockReturnValue(false);
    jest.spyOn(React, "useEffect");
    jest.spyOn(React, "useLayoutEffect");

    const utils = render(
      <ThemeProvider>
        <ThemeComponent />
      </ThemeProvider>
    );

    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
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

  it("should use the correct effect hook when on the server", () => {
    expect(React.useLayoutEffect).toHaveBeenCalled();

    isServerSide.mockReturnValue(true);
    rerender(
      <ThemeProvider>
        <ThemeComponent />
      </ThemeProvider>
    );

    expect(React.useEffect).toHaveBeenCalled();
  });
});
