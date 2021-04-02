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
import { render, screen, act } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import ThemeComponent from "test/testing-utils/hook-components/useThemeComponent";
import { isServerSide } from "utils/shared-utils";

jest.mock("utils/shared-utils");

describe.only("theme provider", () => {
  let rerender, originalLocalStorage, getItemMock, setItemMock;

  beforeEach(() => {
    originalLocalStorage = window.localStorage;
    delete window.localStorage;
    getItemMock = jest.fn().mockReturnValue("lightTheme");
    setItemMock = jest.fn().mockReturnThis();

    window.localStorage = {
      setItem: setItemMock,
      getItem: getItemMock,
    };

    isServerSide.mockReturnValue(false);
    jest.spyOn(React, "useEffect");
    jest.spyOn(React, "useLayoutEffect");

    act(() => {
      const utils = render(<ThemeComponent />);

      rerender = utils.rerender;
    });
  });

  afterEach(() => {
    window.localStorage = originalLocalStorage;
    jest.resetAllMocks();
  });

  it("should render the default theme", () => {
    expect(screen.getByText(/light/i)).toBeInTheDocument();
    expect(getItemMock).toHaveBeenCalledWith("rode-ui-theme");
  });

  it("should toggle the theme when prompted", () => {
    const toggleButton = screen.getByText(/toggle/i);

    userEvent.click(toggleButton);
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
    expect(setItemMock).toHaveBeenCalledWith("rode-ui-theme", "darkTheme");

    userEvent.click(toggleButton);
    expect(screen.getByText(/light/i)).toBeInTheDocument();
    expect(setItemMock).toHaveBeenCalledWith("rode-ui-theme", "lightTheme");
  });

  it("should use the correct effect hook when on the server", () => {
    expect(React.useLayoutEffect).toHaveBeenCalled();

    isServerSide.mockReturnValue(true);
    rerender(<ThemeComponent />);

    expect(React.useEffect).toHaveBeenCalled();
  });
});
