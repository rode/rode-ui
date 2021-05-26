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
import ResourceVersionSearchAndResults from "components/playground/ResourceVersionSearchAndResults";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { getResourceDetails } from "utils/resource-utils";

jest.mock("hooks/usePaginatedFetch");

describe("ResourceVersionSearchAndResults", () => {
  let onVersionSelect,
    genericResource,
    state,
    dispatch,
    fetchResponse,
    fetchedVersions,
    rerender;

  beforeEach(() => {
    onVersionSelect = jest.fn();
    state = {
      versionSearchTerm: chance.string(),
    };
    dispatch = jest.fn();
    fetchedVersions = chance.n(() => {
      const name = chance.string();
      return {
        versionedResourceUri: createMockResourceUri(name),
        aliases: chance.n(() => `${name}:${chance.string()}`),
      };
    }, chance.d4());
    fetchResponse = {
      data: fetchedVersions,
      isLastPage: chance.bool(),
      goToNextPage: jest.fn(),
      loading: false,
    };

    genericResource = { id: chance.string() };

    usePaginatedFetch.mockReturnValue(fetchResponse);

    // const utils = render(
    //   <ResourceVersionSearchAndResults
    //     onVersionSelect={onVersionSelect}
    //     genericResource={genericResource}
    //   />,
    //   {
    //     resourceState: state,
    //     resourceDispatch: dispatch,
    //   }
    // );
    // rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should use the correct params when no search term is specified", () => {
    state.versionSearchTerm = null;
    render(
      <ResourceVersionSearchAndResults
        onVersionSelect={onVersionSelect}
        genericResource={genericResource}
      />,
      {
        resourceState: state,
        resourceDispatch: dispatch,
      }
    );
    searchForVersion();

    expect(usePaginatedFetch).toHaveBeenCalledWith(
      "/api/resource-versions",
      {
        id: genericResource.id,
      },
      5
    );
  });

  it("should use the correct params when searching for a version", () => {
    render(
      <ResourceVersionSearchAndResults
        onVersionSelect={onVersionSelect}
        genericResource={genericResource}
      />,
      {
        resourceState: state,
        resourceDispatch: dispatch,
      }
    );
    searchForVersion();

    expect(usePaginatedFetch).toHaveBeenLastCalledWith(
      "/api/resource-versions",
      {
        id: genericResource.id,
        filter: `version.contains("${state.versionSearchTerm}")`,
      },
      5
    );
  });

  it("should use the correct params when searching for all versions", () => {
    state.versionSearchTerm = "all";
    render(
      <ResourceVersionSearchAndResults
        onVersionSelect={onVersionSelect}
        genericResource={genericResource}
      />,
      {
        resourceState: state,
        resourceDispatch: dispatch,
      }
    );
    searchForVersion();

    expect(usePaginatedFetch).toHaveBeenCalledWith(
      "/api/resource-versions",
      {
        id: genericResource.id,
      },
      5
    );
  });

  describe("searching for a version", () => {
    beforeEach(() => {
      const utils = render(
        <ResourceVersionSearchAndResults
          onVersionSelect={onVersionSelect}
          genericResource={genericResource}
        />,
        {
          resourceState: state,
          resourceDispatch: dispatch,
        }
      );

      rerender = utils.rerender;
    });

    it("should render the search bar", () => {
      expect(screen.getByText(/search for a version/i)).toBeInTheDocument();

      const renderedViewAllResourcesButton = screen.getByRole("button", {
        name: "View all versions",
      });
      expect(renderedViewAllResourcesButton).toBeInTheDocument();
      userEvent.click(renderedViewAllResourcesButton);
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_VERSION_SEARCH_TERM",
        data: "all",
      });
    });

    it("should render the loading indicator when searching for a version", () => {
      fetchResponse.loading = true;
      fetchResponse.data = null;
      searchForVersion();

      expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
    });

    it("should render a search result for each resource found", () => {
      searchForVersion();

      expect(screen.queryByTestId("loadingIndicator")).not.toBeInTheDocument();
      fetchedVersions.forEach((version, index) => {
        const { resourceVersion, aliasLabel, aliases } = getResourceDetails(
          version.versionedResourceUri,
          version
        );
        expect(screen.getAllByText("Version")[index]).toBeInTheDocument();
        expect(
          screen.getByText(resourceVersion.substring(0, 12))
        ).toBeInTheDocument();
        expect(screen.getAllByText(aliasLabel)[index]).toBeInTheDocument();
        expect(screen.getByText(aliases.join(", "))).toBeInTheDocument();
      });
    });

    it("should select the version when prompted", () => {
      searchForVersion();

      userEvent.click(screen.getAllByText("Select Version")[0]);
      expect(onVersionSelect).toHaveBeenCalledWith(fetchedVersions[0]);
    });

    it("should render a View More button when there are more resources to fetch", () => {
      fetchResponse.isLastPage = false;

      searchForVersion();

      const renderedShowMoreButton = screen.getByRole("button", {
        name: "See More Versions",
      });

      expect(renderedShowMoreButton).toBeInTheDocument();
      userEvent.click(renderedShowMoreButton);
      expect(fetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
    });

    it("should return some instructions to pick a resource if the generic resource is not specified", () => {
      rerender(
        <ResourceVersionSearchAndResults
          onVersionSelect={onVersionSelect}
          genericResource={null}
        />,
        {
          resourceState: state,
          resourceDispatch: dispatch,
        }
      );

      expect(
        screen.getByText(/select a resource to view a list of versions/i)
      ).toBeInTheDocument();
    });
  });
});

const searchForVersion = () => {
  const renderedSearch = screen.getByText(/search for a version/i);
  const renderedSearchButton = screen.getByLabelText(/search versions/i);

  act(() => {
    userEvent.type(renderedSearch, chance.string());
  });
  act(() => {
    userEvent.click(renderedSearchButton);
  });
};
