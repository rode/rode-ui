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
import ResourceVersionSearchBar from "components/resources/ResourceVersionSearchBar";
import userEvent from "@testing-library/user-event";
import { useResources } from "providers/resources";

jest.mock("providers/resources");

describe("ResourceVersionSearchBar", () => {
  let onSubmit, dispatchMock, rerender;
  beforeEach(() => {
    onSubmit = jest.fn();
    dispatchMock = jest.fn();

    useResources.mockReturnValue({
      state: { versionSearchTerm: "" },
      dispatch: dispatchMock,
    });

    const utils = render(<ResourceVersionSearchBar onSubmit={onSubmit} />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("should render an input for searching for a version", () => {
    const renderedInput = screen.getByText(/search for a version/i);
    expect(renderedInput).toBeInTheDocument();

    const searchTerm = chance.string();

    userEvent.type(renderedInput, searchTerm);
    expect(dispatchMock)
      .toHaveBeenCalledTimes(searchTerm.length)
      .toHaveBeenNthCalledWith(searchTerm.length, {
        type: "SET_VERSION_SEARCH_TERM",
        data: expect.any(String),
      });
  });

  it("should handle any additional onChange events that are passed", () => {
    const onChangeMock = jest.fn();
    rerender(
      <ResourceVersionSearchBar onSubmit={onSubmit} onChange={onChangeMock} />
    );

    const renderedInput = screen.getByText(/search for a version/i);
    const searchTerm = chance.string();

    userEvent.type(renderedInput, searchTerm);
    expect(dispatchMock)
      .toHaveBeenCalledTimes(searchTerm.length)
      .toHaveBeenNthCalledWith(searchTerm.length, {
        type: "SET_VERSION_SEARCH_TERM",
        data: expect.any(String),
      });
    expect(onChangeMock).toHaveBeenCalledTimes(searchTerm.length);
  });

  it("should render the button to perform a search", () => {
    const renderedSearchButton = screen.getByLabelText("Search Versions");
    expect(renderedSearchButton).toBeInTheDocument();
  });

  it("should render some helper text if specified", () => {
    const helpText = chance.string();
    rerender(
      <ResourceVersionSearchBar onSubmit={onSubmit} helpText={helpText} />
    );

    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it("should start the search process when the button is clicked", () => {
    const versionSearchTerm = chance.string();

    useResources.mockReturnValue({
      state: { versionSearchTerm },
      dispatch: jest.fn(),
    });
    rerender(<ResourceVersionSearchBar onSubmit={onSubmit} />);
    const renderedSearchButton = screen.getByLabelText("Search Versions");

    userEvent.click(renderedSearchButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
