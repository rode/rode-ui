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
import { cleanup, render, screen } from "@testing-library/react";
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import userEvent from "@testing-library/user-event";
import { useResources } from "providers/resources";

jest.mock("providers/resources");

describe("ResourceSearchBar", () => {
  let onSubmit, dispatchMock, rerender;
  beforeEach(() => {
    jest.spyOn(console, "log");
    onSubmit = jest.fn();
    dispatchMock = jest.fn();

    useResources.mockReturnValue({
      state: { searchTerm: "" },
      dispatch: dispatchMock,
    });

    const utils = render(<ResourceSearchBar onSubmit={onSubmit} />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("should render an input for searching for a resource", () => {
    const renderedInput = screen.getByText(/search for a resource/i);
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
    rerender(<ResourceSearchBar onSubmit={onSubmit} onChange={onChangeMock} />);

    const renderedInput = screen.getByText(/search for a resource/i);
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

  it("should render the button to perform a search", () => {
    const renderedSearchButton = screen.getByLabelText("Search");
    expect(renderedSearchButton).toBeInTheDocument();
    expect(renderedSearchButton).toBeDisabled();
  });

  it("should render some helper text if specified", () => {
    const helpText = chance.string();
    rerender(<ResourceSearchBar onSubmit={onSubmit} helpText={helpText} />);

    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it("should enable the button when a search term is entered", () => {
    useResources.mockReturnValue({
      state: { searchTerm: chance.string() },
      dispatch: jest.fn(),
    });

    rerender(<ResourceSearchBar onSubmit={onSubmit} />);

    const renderedSearchButton = screen.getByLabelText("Search");
    expect(renderedSearchButton).not.toBeDisabled();
  });

  it("should fill in the search term based on the url query", () => {
    const currentSearchTerm = chance.string();
    useResources.mockReturnValue({
      state: { searchTerm: currentSearchTerm },
      dispatch: jest.fn(),
    });

    rerender(<ResourceSearchBar onSubmit={onSubmit} />);

    const renderedSearchInput = screen.getByLabelText(/search for a resource/i);
    expect(renderedSearchInput).toHaveAttribute("value", currentSearchTerm);
  });

  it("should start the search process when the button is clicked", () => {
    const searchTerm = chance.string();

    useResources.mockReturnValue({
      state: { searchTerm },
      dispatch: jest.fn(),
    });
    rerender(<ResourceSearchBar onSubmit={onSubmit} />);
    const renderedSearchButton = screen.getByLabelText("Search");

    userEvent.click(renderedSearchButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
