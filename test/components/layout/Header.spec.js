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
    jest.spyOn(document, "addEventListener");
    jest.spyOn(document, "removeEventListener");
    render(
      <div>
        <Header />
        <p>Trigger</p>
      </div>
    );
  });

  it("should add an event listener to listen to clicks outside of the nav menu", () => {
    act(() => {
      userEvent.click(screen.getByLabelText(/^toggle navigation/i));
    });
    expect(document.addEventListener).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );

    act(() => {
      userEvent.click(screen.getByText("Trigger"));
    });

    expect(document.removeEventListener).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
  });

  it("should render the Rode logo", () => {
    expect(screen.getByTitle(/rode logo/i)).toBeInTheDocument();
  });

  it("should render a button to toggle the navigation", () => {
    const toggleButton = screen.getByTitle(/menu/i);
    expect(toggleButton).toBeInTheDocument();

    const navigationContainer = screen.getByTestId("navigationContainer");
    expect(navigationContainer).toHaveClass("hidden");

    act(() => {
      userEvent.click(toggleButton);
    });

    expect(navigationContainer).not.toHaveClass("hidden");
  });

  it("should render the section and links for Resources", () => {
    act(() => {
      userEvent.click(screen.getByTitle(/menu/i));
    });

    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Resource Search")).toBeInTheDocument();
  });

  it("should render the section and links for Policies", () => {
    act(() => {
      userEvent.click(screen.getByTitle(/menu/i));
    });

    expect(screen.getByText("Policies")).toBeInTheDocument();
    expect(screen.getByText("Policy Playground")).toBeInTheDocument();
    expect(screen.getByText("Create New Policy")).toBeInTheDocument();
  });

  it("should render the section and links for Admin", () => {
    act(() => {
      userEvent.click(screen.getByTitle(/menu/i));
    });

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Policy Groups")).toBeInTheDocument();
  });
});
