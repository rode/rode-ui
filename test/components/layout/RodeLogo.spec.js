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
import RodeLogo from "components/layout/RodeLogo";
import { DARK_THEME, LIGHT_THEME } from "utils/constants";

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
