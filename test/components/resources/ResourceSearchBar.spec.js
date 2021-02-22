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

jest.mock("next/router");

describe("ResourceSearchBar", () => {
  let pushMock, rerender;
  beforeEach(() => {
    jest.spyOn(console, "log");
    pushMock = jest.fn();

    useRouter.mockReturnValue({
      push: pushMock,
    });

    const utils = render(<ResourceSearchBar />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("should render an input for searching for a resource", () => {
    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
  });

  it("should render the button to perform a search", () => {
    const renderedSearchButton = screen.getByLabelText("Search");
    const renderedSearchInput = screen.getByText(/search for a resource/i);
    expect(renderedSearchButton).toBeInTheDocument();
    expect(renderedSearchButton).toBeDisabled();

    userEvent.type(renderedSearchInput, chance.character());
    expect(renderedSearchButton).not.toBeDisabled();
  });

  it("should fill in the search term based on the url query", () => {
    const currentSearchTerm = chance.string();
    rerender(<ResourceSearchBar currentSearch={currentSearchTerm} />);

    const renderedSearchInput = screen.getByLabelText(/search for a resource/i);
    expect(renderedSearchInput).toHaveAttribute("value", currentSearchTerm);
  });

  it("should do the thing when the button is clicked", () => {
    const renderedSearchButton = screen.getByLabelText("Search");
    const renderedSearchInput = screen.getByText(/search for a resource/i);
    const searchTerm = chance.string();

    userEvent.type(renderedSearchInput, searchTerm);
    userEvent.click(renderedSearchButton);

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(`/resources?search=${searchTerm}`);
  });
});
