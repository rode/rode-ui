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
import { useRouter } from "next/router";
import { useResources } from "providers/resources";

jest.mock("next/router");
jest.mock("providers/resources");

describe("ResourceSearchBar", () => {
  let pushMock, dispatchMock, rerender;
  beforeEach(() => {
    jest.spyOn(console, "log");
    pushMock = jest.fn();
    dispatchMock = jest.fn();

    useRouter.mockReturnValue({
      push: pushMock,
    });

    useResources.mockReturnValue({
      state: {},
      dispatch: dispatchMock,
    });

    const utils = render(<ResourceSearchBar />);
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

  it("should render the button to perform a search", () => {
    const renderedSearchButton = screen.getByLabelText("Search");
    expect(renderedSearchButton).toBeInTheDocument();
    expect(renderedSearchButton).toBeDisabled();
  });

  it("should enable the button when a search term is entered", () => {
    useResources.mockReturnValue({
      state: { searchTerm: chance.string() },
      dispatch: jest.fn(),
    });

    rerender(<ResourceSearchBar />);

    const renderedSearchButton = screen.getByLabelText("Search");
    expect(renderedSearchButton).not.toBeDisabled();
  });

  it("should fill in the search term based on the url query", () => {
    const currentSearchTerm = chance.string();
    useResources.mockReturnValue({
      state: { searchTerm: currentSearchTerm },
      dispatch: jest.fn(),
    });

    rerender(<ResourceSearchBar />);

    const renderedSearchInput = screen.getByLabelText(/search for a resource/i);
    expect(renderedSearchInput).toHaveAttribute("value", currentSearchTerm);
  });

  it("should do the thing when the button is clicked", () => {
    const searchTerm = chance.string();

    useResources.mockReturnValue({
      state: { searchTerm },
      dispatch: jest.fn(),
    });
    rerender(<ResourceSearchBar />);
    const renderedSearchButton = screen.getByLabelText("Search");

    userEvent.click(renderedSearchButton);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(`/resources?search=${searchTerm}`);
  });
});
