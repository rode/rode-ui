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
import { act, render, screen } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import ResourceSearchAndResults from "components/playground/ResourceSearchAndResults";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import { RESOURCE_TYPES } from "utils/resource-utils";

jest.mock("hooks/usePaginatedFetch");

describe("ResourceSearchAndResults", () => {
  let onResourceSelect,
    selectedResource,
    state,
    dispatch,
    fetchResponse,
    fetchedResources,
    rerender;

  beforeEach(() => {
    onResourceSelect = jest.fn();
    state = {
      resourceSearchTerm: chance.string(),
    };
    dispatch = jest.fn();
    fetchedResources = chance.n(
      () => ({
        id: chance.string(),
        name: chance.string(),
        type: chance.pickone(Object.values(RESOURCE_TYPES)),
      }),
      chance.d4()
    );
    fetchResponse = {
      data: fetchedResources,
      isLastPage: chance.bool(),
      goToNextPage: jest.fn(),
      loading: false,
    };

    selectedResource = null;

    usePaginatedFetch.mockReturnValue(fetchResponse);

    const utils = render(
      <ResourceSearchAndResults
        onResourceSelect={onResourceSelect}
        selectedResource={selectedResource}
      />,
      {
        state,
        dispatch,
      }
    );
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the search bar", () => {
    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();

    const renderedViewAllResourcesButton = screen.getByRole("button", {
      name: "View all resources",
    });
    expect(renderedViewAllResourcesButton).toBeInTheDocument();
    userEvent.click(renderedViewAllResourcesButton);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_RESOURCE_SEARCH_TERM",
      data: "all",
    });
  });

  it("should render the loading indicator when searching for a resource", () => {
    fetchResponse.loading = true;
    fetchResponse.data = null;

    searchForResource();

    expect(usePaginatedFetch).toHaveBeenCalledWith(
      "/api/resources",
      {
        searchTerm: state.resourceSearchTerm,
      },
      5
    );
    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should render a search result for each resource found", () => {
    searchForResource();

    expect(screen.queryByTestId("loadingIndicator")).not.toBeInTheDocument();
    fetchedResources.forEach((resource, index) => {
      expect(screen.getByText(resource.name)).toBeInTheDocument();
      expect(screen.queryAllByText("Type")[index]).toBeInTheDocument();
      expect(screen.getAllByText(resource.type)[0]).toBeInTheDocument();
    });
  });

  it("should indicate the currently selected resource", () => {
    selectedResource = fetchedResources[0];
    rerender(
      <ResourceSearchAndResults
        onResourceSelect={onResourceSelect}
        selectedResource={selectedResource}
      />
    );
    searchForResource();

    const selectedResourceButton = screen.getByLabelText("Selected Resource");
    expect(selectedResourceButton).toBeInTheDocument();
    expect(selectedResourceButton).toHaveClass("selectedButton");
    expect(selectedResourceButton).toBeDisabled();
  });

  it("should select the resource when prompted", () => {
    searchForResource();

    userEvent.click(screen.getAllByText("Select Resource")[0]);
    expect(onResourceSelect).toHaveBeenCalledWith(fetchedResources[0]);
  });

  it("should render a View More button when there are more resources to fetch", () => {
    fetchResponse.isLastPage = false;

    searchForResource();

    const renderedShowMoreButton = screen.getByRole("button", {
      name: "See More Resources",
    });

    expect(renderedShowMoreButton).toBeInTheDocument();
    userEvent.click(renderedShowMoreButton);
    expect(fetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
  });

  it("should render the no resource found message if no resources were found", () => {
    fetchResponse.loading = false;
    fetchResponse.data = [];

    rerender(<ResourceSearchAndResults onResourceSelect={onResourceSelect} />);
    searchForResource();

    expect(screen.getByText(/no resources found/i)).toBeInTheDocument();
  });
});

const searchForResource = () => {
  const renderedSearch = screen.getByText(/search for a resource/i);
  const renderedSearchButton = screen.getByLabelText(/search resources/i);

  act(() => {
    userEvent.type(renderedSearch, chance.string());
  });
  act(() => {
    userEvent.click(renderedSearchButton);
  });
};
