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
import { render, screen, act } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import ResourceSearchAndResults from "components/playground/ResourceSearchAndResults";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { getResourceDetails } from "utils/resource-utils";

jest.mock("hooks/usePaginatedFetch");

describe("ResourceSearchAndResults", () => {
  let setResource,
    clearEvaluation,
    state,
    dispatch,
    fetchResponse,
    fetchedResources,
    scrollMock,
    rerender;

  beforeEach(() => {
    setResource = jest.fn();
    clearEvaluation = jest.fn();
    state = {
      searchTerm: chance.string(),
    };
    dispatch = jest.fn();
    fetchedResources = chance.n(
      () => ({
        uri: createMockResourceUri(),
      }),
      chance.d4()
    );
    scrollMock = jest.fn();
    fetchResponse = {
      data: fetchedResources,
      isLastPage: chance.bool(),
      goToNextPage: jest.fn(),
      loading: false,
    };

    usePaginatedFetch.mockReturnValue(fetchResponse);

    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: scrollMock,
    });

    const utils = render(
      <ResourceSearchAndResults
        setResource={setResource}
        clearEvaluation={clearEvaluation}
      />,
      {
        resourceState: state,
        resourceDispatch: dispatch,
      }
    );
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the button to open the search drawer", () => {
    const renderedButton = screen.getByLabelText(/search for resources/i);
    expect(renderedButton).toBeInTheDocument();
    expect(screen.getByTestId("drawer")).toHaveClass("closedDrawer");

    userEvent.click(renderedButton);

    expect(screen.getByTestId("drawer")).toHaveClass("openDrawer");
  });

  it("should render the search bar", () => {
    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();

    const renderedViewAllResourcesButton = screen.getByRole("button", {
      name: "View all resources",
    });
    expect(renderedViewAllResourcesButton).toBeInTheDocument();
    userEvent.click(renderedViewAllResourcesButton);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_SEARCH_TERM",
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
        filter: state.searchTerm,
      },
      5
    );
    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should render a search result for each resource found", () => {
    searchForResource();

    expect(screen.queryByTestId("loadingIndicator")).not.toBeInTheDocument();
    fetchedResources.forEach((resource, index) => {
      const {
        resourceName,
        resourceVersion,
        resourceType,
      } = getResourceDetails(resource.uri);
      expect(screen.getByText(resourceName)).toBeInTheDocument();
      expect(screen.queryAllByText("Version")[index]).toBeInTheDocument();
      expect(
        screen.getByText(resourceVersion.substring(0, 12))
      ).toBeInTheDocument();
      expect(screen.queryAllByText("Type")[index]).toBeInTheDocument();
      expect(screen.getAllByText(resourceType)[index]).toBeInTheDocument();
    });
  });

  it("should select the resource when prompted", () => {
    searchForResource();

    const { resourceName, resourceVersion, resourceType } = getResourceDetails(
      fetchedResources[0].uri
    );

    userEvent.click(screen.getAllByText("Select Resource")[0]);
    expect(setResource).toHaveBeenCalledWith({
      uri: fetchedResources[0].uri,
      name: resourceName,
      version: resourceVersion,
      type: resourceType,
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_SEARCH_TERM",
      data: "",
    });
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

    rerender(
      <ResourceSearchAndResults
        setResource={setResource}
        clearEvaluation={clearEvaluation}
      />
    );
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
