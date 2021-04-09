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
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "components/layout/Header";

describe("Header", () => {
  beforeEach(() => {
    render(<Header />);
  });

  it("should render the Rode logo", () => {
    expect(screen.getByTitle(/rode logo/i)).toBeInTheDocument();
  });

  it("should render a button to toggle the navigation", () => {
    const toggleButton = screen.getByTitle(/menu/i);

    expect(toggleButton).toBeInTheDocument();

    act(() => {
      userEvent.click(toggleButton);
    });

    expect(screen.getByText("Resources")).toBeVisible();
  });

  it("should render the section and links for Resources", () => {
    userEvent.click(screen.getByTitle(/menu/i));

    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Resource Search")).toBeInTheDocument();
  });

  it("should render the section and links for Policies", () => {
    userEvent.click(screen.getByTitle(/menu/i));

    expect(screen.getByText("Policies")).toBeInTheDocument();
    expect(screen.getByText("Policy Playground")).toBeInTheDocument();
    expect(screen.getByText("Create New Policy")).toBeInTheDocument();
  });
});
