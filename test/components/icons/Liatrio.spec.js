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
import { DARK_THEME, LIGHT_THEME } from "utils/constants";
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
