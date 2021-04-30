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
  let resource,
    setResource,
    clearEvaluation,
    state,
    dispatch,
    fetchResponse,
    fetchedResources,
    scrollMock,
    rerender;

  beforeEach(() => {
    resource = {};
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
        resource={resource}
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

  it("should render the search bar", () => {
    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
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
    fetchedResources.forEach((resource) => {
      const {
        resourceName,
        resourceVersion,
        resourceType,
      } = getResourceDetails(resource.uri);
      expect(screen.getByText(resourceName)).toBeInTheDocument();
      expect(
        screen.getByText(`Version: ${resourceVersion}`)
      ).toBeInTheDocument();
      expect(
        screen.getAllByText(`Type: ${resourceType}`)[0]
      ).toBeInTheDocument();
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

  it("should render a resource as selected if it is the current resource to evaluate", () => {
    const { resourceName, resourceVersion, resourceType } = getResourceDetails(
      fetchedResources[0].uri
    );

    rerender(
      <ResourceSearchAndResults
        setResource={setResource}
        clearEvaluation={clearEvaluation}
        resource={{
          uri: fetchedResources[0].uri,
          name: resourceName,
          version: resourceVersion,
          type: resourceType,
        }}
      />
    );

    searchForResource();

    expect(
      screen.getByRole("button", { name: "Selected" })
    ).toBeInTheDocument();
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
    expect(document.getElementById).toHaveBeenCalledWith(
      "viewMoreResourcesButton"
    );
    expect(scrollMock).toHaveBeenCalledWith({
      block: "end",
      behavior: "smooth",
    });
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
