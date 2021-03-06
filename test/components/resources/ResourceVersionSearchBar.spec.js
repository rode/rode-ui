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
import { act, cleanup, render, screen } from "test/testing-utils/renderer";
import ResourceVersionSearchBar from "components/resources/ResourceVersionSearchBar";
import userEvent, { specialChars } from "@testing-library/user-event";

describe("ResourceVersionSearchBar", () => {
  let onSubmit, dispatch, state, rerender;
  beforeEach(() => {
    onSubmit = jest.fn();
    dispatch = jest.fn();
    state = {
      resourceVersionSearchTerm: "",
    };

    const utils = render(<ResourceVersionSearchBar onSubmit={onSubmit} />, {
      state,
      dispatch,
    });
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
    expect(dispatch)
      .toHaveBeenCalledTimes(searchTerm.length)
      .toHaveBeenNthCalledWith(searchTerm.length, {
        type: "SET_RESOURCE_VERSION_SEARCH_TERM",
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
    expect(dispatch)
      .toHaveBeenCalledTimes(searchTerm.length)
      .toHaveBeenNthCalledWith(searchTerm.length, {
        type: "SET_RESOURCE_VERSION_SEARCH_TERM",
        data: expect.any(String),
      });
    expect(onChangeMock).toHaveBeenCalledTimes(searchTerm.length);
  });

  it("should search for all versions when the user clears any search terms", () => {
    const renderedInput = screen.getByLabelText(/search for a version/i);
    expect(renderedInput).toBeInTheDocument();

    const character = " ";
    act(() => {
      userEvent.type(renderedInput, character);
    });
    act(() => {
      userEvent.type(renderedInput, specialChars.backspace);
    });
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "SET_RESOURCE_VERSION_SEARCH_TERM",
      data: "all",
    });
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
    const resourceVersionSearchTerm = chance.string();

    state.resourceVersionSearchTerm = resourceVersionSearchTerm;
    rerender(<ResourceVersionSearchBar onSubmit={onSubmit} />);
    const renderedSearchButton = screen.getByLabelText("Search Versions");

    userEvent.click(renderedSearchButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
