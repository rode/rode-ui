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
import { cleanup, render, screen, act } from "@testing-library/react";
import PolicySearchBar from "components/policies/PolicySearchBar";
import userEvent, { specialChars } from "@testing-library/user-event";
import { usePolicies } from "providers/policies";

jest.mock("providers/policies");

describe("PolicySearchBar", () => {
  let onSubmit, dispatchMock, rerender;
  beforeEach(() => {
    jest.spyOn(console, "log");
    onSubmit = jest.fn();
    dispatchMock = jest.fn();

    usePolicies.mockReturnValue({
      state: { searchTerm: "" },
      dispatch: dispatchMock,
    });

    const utils = render(<PolicySearchBar onSubmit={onSubmit} />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("should render an input for searching for a policy", () => {
    const renderedInput = screen.getByText(/search for a policy/i);
    expect(renderedInput).toBeInTheDocument();

    const searchTerm = chance.string();

    userEvent.type(renderedInput, searchTerm);
    expect(dispatchMock)
      .toHaveBeenCalledTimes(searchTerm.length)
      .toHaveBeenNthCalledWith(searchTerm.length, {
        type: "SET_SEARCH_TERM",
        data: expect.any(String),
      });
  });

  it("should handle any additional onChange events that are passed", () => {
    const onChangeMock = jest.fn();
    rerender(<PolicySearchBar onSubmit={onSubmit} onChange={onChangeMock} />);

    const renderedInput = screen.getByText(/search for a policy/i);
    const searchTerm = chance.string();

    userEvent.type(renderedInput, searchTerm);
    expect(dispatchMock)
      .toHaveBeenCalledTimes(searchTerm.length)
      .toHaveBeenNthCalledWith(searchTerm.length, {
        type: "SET_SEARCH_TERM",
        data: expect.any(String),
      });
    expect(onChangeMock).toHaveBeenCalledTimes(searchTerm.length);
  });

  it("should search for all policies when the user clears any search terms", () => {
    const renderedInput = screen.getByLabelText(/search for a policy/i);
    expect(renderedInput).toBeInTheDocument();

    const character = " ";
    act(() => {
      userEvent.type(renderedInput, character);
    });
    act(() => {
      userEvent.type(renderedInput, specialChars.backspace);
    });
    expect(dispatchMock).toHaveBeenLastCalledWith({
      type: "SET_SEARCH_TERM",
      data: "all",
    });
  });

  it("should render the button to perform a search", () => {
    const renderedSearchButton = screen.getByLabelText("Search Policies");
    expect(renderedSearchButton).toBeInTheDocument();
  });

  it("should render some helper text if specified", () => {
    const helpText = chance.string();
    rerender(<PolicySearchBar onSubmit={onSubmit} helpText={helpText} />);
    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it("should fill in the search term based on the url query", () => {
    const currentSearchTerm = chance.string();
    usePolicies.mockReturnValue({
      state: { searchTerm: currentSearchTerm },
      dispatch: jest.fn(),
    });

    rerender(<PolicySearchBar onSubmit={onSubmit} />);

    const renderedSearchInput = screen.getByLabelText(/search for a policy/i);
    expect(renderedSearchInput).toHaveAttribute("value", currentSearchTerm);
  });

  it("should start the search process when the button is clicked", () => {
    const searchTerm = chance.string();

    usePolicies.mockReturnValue({
      state: { searchTerm },
      dispatch: jest.fn(),
    });
    rerender(<PolicySearchBar onSubmit={onSubmit} />);
    const renderedSearchButton = screen.getByLabelText("Search Policies");

    userEvent.click(renderedSearchButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
